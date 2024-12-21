const { default: mongoose } = require("mongoose");
const deleteProductImage = require("../Helpers/deleteImage");
const Product = require("../Models/productModel");
const Review = require("../Models/reviewModel");
const ObjectID = mongoose.Schema.Types.ObjectId;

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "reviews", // Populate reviews
      populate: {
        path: "user", // Populate user details for each review
        select: "name email", // Select specific fields from User model, adjust as needed
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product with image upload
const createProduct = async (req, res) => {
  const { name, description, price, category, brand, quantity, trend } =
    req.body;
  // if name exist with find by name product checking then error
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({ message: "Product already exists" });
  }

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      quantity,
      trend,
      imageUrl: `/productImages/${req.file?.filename}`, // Store the image URL based on uploaded file
    });

    const savedProduct = await Product.insertMany(product);

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product and replace old image with a new one if provided
const updateProduct = async (req, res) => {
  const { id } = req.params; // Get product ID from request params
  const { name, description, price, category, brand, quantity, trend } =
    req.body;

  try {
    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.quantity = quantity || product.quantity;
    product.trend = trend || product.trend;

    // Handle the new image if uploaded
    let updatedImageUrl = product?.imageUrl; // Default to existing image
    if (req.file) {
      // Delete the old image using your utility function
      deleteProductImage(updatedImageUrl);

      // Set the new image URL
      updatedImageUrl = `/productImages/${req.file?.filename}`;
    }

    product.imageUrl = updatedImageUrl;

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews", // Populate reviews
      populate: {
        path: "user", // Populate user details for each review
        select: "name email", // Select specific fields from User model, adjust as needed
      },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a review to a product
const addReview = async (req, res) => {
  const { rating, comment, userId } = req.body;
  const productId = req.params.id;
  console.log(rating, comment);

  try {
    const product = await Product.findById(productId);
    console.log(product);

    if (product) {
      // Create a new review
      const review = new Review({
        user: userId, // Assuming you have user authentication
        rating,
        comment,
      });
      await review.populate("user");
      await review.save();

      // Add the new review ID to the product's reviews array
      product.reviews.push(review._id);
      product.numReviews = product.reviews.length;

      // Populate the reviews with actual Review data
      await product.populate("reviews");

      // Recalculate the average rating
      product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json({ message: "Review added successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // First, find the product to get its reviews
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await deleteProductImage(product.imageUrl);

    // Delete reviews associated with the product
    await Review.deleteMany({ _id: { $in: product.reviews } });

    // Now, delete the product itself
    await Product.findByIdAndDelete(productId);

    res
      .status(200)
      .json({ message: "Product and associated reviews deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products by name, description, or category
const handleSearchProducts = async (req, res, next) => {
  try {
    const { query, category, brand } = req.query; // Destructure category, query, and brand

    // Base filter object
    const filter = {};

    // Add query to the filter if it exists
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search in product name
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search in product description
      ];
    }

    // Add case-insensitive category match to the filter if it exists
    if (category) {
      filter.category = { $regex: category, $options: "i" }; // Case-insensitive category match
    }

    // Add case-insensitive brand match to the filter if it exists
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" }; // Case-insensitive brand match
    }

    // Fetch products based on the filter
    const searchResults = await Product.find(filter);

    // If no products are found
    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No products found",
        payload: [], // Return an empty array if no products are found
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products returned.",
      payload: searchResults,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Problem with controller", error });
  }
};

// Get product by category
const getProductByCategory = async (req, res) => {
  const category = req.params.category;
  const result = await Product.find({
    category: { $regex: category, $options: "i" },
  });

  try {
    res
      .status(200)
      .json({ message: "Get product by category success", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  addReview,
  deleteProduct,
  handleSearchProducts,
  updateProduct,
  getProductByCategory,
};
