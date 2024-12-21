const jwt = require("jsonwebtoken");
const { jwtRefreshKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res
        .status(403)
        .json({ message: "You are already logged out, Please login again" });
    }

    const decoded = jwt.verify(token, jwtRefreshKey);
    if (!decoded) {
      return res.status(402).json({ message: "Invalid Token. Please login." });
    }
    // set userId in req.body... now I can recieve from body in getUserById controllers

    req.users = decoded.users;
    next();
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, jwtRefreshKey);
      if (decoded) {
        return res
          .status(403)
          .json({ message: "You are already logged in, Please logout first" });
      } else {
        return res.status(200).json({ message: "problem with decoding token" });
      }
    }

    next();
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = { isLoggedIn, isLoggedOut };
