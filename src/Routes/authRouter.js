const express = require("express");
const {
  handleLogin,
  handleLogout,
  handleProtected,
  handleRefreshToken,
} = require("../Controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../Middlewares/auth");

const authRouter = express.Router();

// http://localhost:5000/api/reviews
authRouter.post("/login", isLoggedOut, handleLogin);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.post("/refresh-token/", handleRefreshToken);
authRouter.post("/protected", handleProtected);

module.exports = authRouter;
