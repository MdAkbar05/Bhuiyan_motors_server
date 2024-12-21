// utils/deleteProjectImage.js
const fs = require("fs");
const path = require("path");

const deleteProductImage = (imagePath) => {
  try {
    const fullPath = path.join(__dirname, "../../../Client/public/", imagePath);
    console.log(fullPath);
    console.log(fullPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("Image deleted successfully");
    } else {
      console.log("Image file does not exist, so nothing to delete");
    }
  } catch (error) {
    console.error("Error deleting image: ", error);
  }
};

module.exports = deleteProductImage;
