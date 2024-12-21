const express = require("express");
const {
  handleGetUsers,
  handleRegisterUser,
  handleUpdateUser,
  handleDeleteUser,
  handleVerifyUser,
} = require("../Controllers/userController");

const userRouter = express.Router();

// http://localhost:5000/api/reviews
userRouter.get("/", handleGetUsers);
userRouter.post("/", handleRegisterUser);
userRouter.post("/verify-user", handleVerifyUser);
userRouter.put("/:id/", handleUpdateUser);
userRouter.delete("/:id", handleDeleteUser);

module.exports = userRouter;
