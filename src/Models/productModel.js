const mongoose = require("mongoose");

// Enums for category
const categories = [
  "Engine",
  "Transmission",
  "Brakes",
  "Suspension",
  "Electrical",
  "Interior",
  "Exterior",
  "Lubricant",
  "Tyre",
  "Filter",
  "Car-Care-Product",
  "Electrical-Parts",
  "Body-Parts",
  "Battery",
  "Horn",
];
// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,

      required: true,
    },
    brand: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, required: true },
    trend: {
      type: String,
      enum: ["trending", "new", "top", "popular", "special"],
      default: "New",
      required: true,
    },
    imageUrl: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Reference to Review
    ratings: { type: Number, default: 5 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
