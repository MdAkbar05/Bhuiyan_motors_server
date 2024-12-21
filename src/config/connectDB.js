const mongoose = require("mongoose");
const { dbUrl } = require("../secret");

const connectDB = async (option = {}) => {
  try {
    await mongoose.connect(dbUrl, option);
    console.log("Mongodb is connected with Bhuiyan_MotorsDB");
    mongoose.connection.on("error", (error) => {
      console.log("DB Conncection Error: ", error);
    });
  } catch (error) {
    console.error("DB Connection Failed: ", error.toString());
  }
};

module.exports = connectDB;
