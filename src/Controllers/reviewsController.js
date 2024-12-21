const path = require("path");
const deleteProjectImage = require("../Helpers/deleteImage");
const createError = require("http-errors");
const downloadImage = require("../Helpers/downloadImageByPath");
const ClientReview = require("../Models/reviewModel");

// /api/reviews Get
const handleGetReviews = async (req, res) => {
  try {
    const reviews = await ClientReview.find().sort({ createdAt: -1 }).populate({
      path: "user", // Populate reviews
      select: "name email role",
    });
    res.status(200).json({ message: "Review Fetched successfully", reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// /apo/review Post
const handleCreateReview = async (req, res) => {
  try {
    const { clientName, clientTitle, review, rating, clientImage } = req.body;

    // Generate a unique filename for the image
    const fileName = `${Date.now()}-profile-image.jpg`;

    // Define the path to save the image
    const savePath = path.join(
      __dirname,
      "../../public/ReviewedUsers",
      fileName
    );
    // Download and save the image
    await downloadImage(clientImage, savePath);

    // const imgUrl = `/projectImages/${fileName}`;
    const newReview = new ClientReview({
      clientName,
      clientTitle,
      review,
      rating,
      clientImage,
    });

    await newReview.save();

    res.json({ success: true, newReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to create review", error });
  }
};

const handleDeleteReview = async (req, res) => {
  try {
    const review = await ClientReview.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully", review });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const handleApprove = async (req, res) => {
  try {
    const review = await ClientReview.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to approve review" });
  }
};

const handleReject = async (req, res) => {
  try {
    const review = await ClientReview.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to reject review" });
  }
};

module.exports = {
  handleGetReviews,
  handleCreateReview,
  handleDeleteReview,
  handleApprove,
  handleReject,
};
