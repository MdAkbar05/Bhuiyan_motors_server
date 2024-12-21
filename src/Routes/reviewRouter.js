const express = require("express");
const {
  handleGetReviews,
  handleDeleteReview,
} = require("../Controllers/reviewsController");

const reviewRouter = express.Router();

reviewRouter.get("/", handleGetReviews);
// delete review
reviewRouter.delete("/:id", handleDeleteReview);

module.exports = reviewRouter;
