const express = require("express");
const {
  getProducts,
  getProductById,
  addReview,
  createProduct,
  deleteProduct,
  handleSearchProducts,
  updateProduct,
  getProductByCategory,
} = require("../Controllers/productController");
const productImageUpload = require("../Middlewares/upload");
const productRouter = express.Router();

// Define routes
productRouter.get("/", getProducts); // Get all products
// /api/products/search?query=laptop
productRouter.post("/", productImageUpload.single("imageUrl"), createProduct); // Add  a product
productRouter.get("/search", handleSearchProducts);
productRouter.get("/:id", getProductById); // Get product by ID
productRouter.put("/:id", productImageUpload.single("imageUrl"), updateProduct); // Update a product
productRouter.delete("/:id", deleteProduct); // Delete a review with a product
productRouter.post("/:id/reviews", addReview); // Add a review for a product
productRouter.get("/by-category/:category", getProductByCategory); // Add a review for a product

module.exports = productRouter;
