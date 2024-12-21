const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const { createJSONWebToken } = require("../Helpers/jwt");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const bcrpt = require("bcryptjs");
const createHttpError = require("http-errors");

// /api/auth/login
const handleLogin = async (req, res, next) => {
  console.log("reched");
  try {
    const { email, password } = req.body;

    //is exits
    const users = await User.findOne({ email: email });

    if (!users) {
      throw createHttpError(
        404,
        "User does not exist with this email. Please register first."
      );
    }
    // compare the password
    const isPassword = await bcrpt.compare(password, users.password);

    if (!isPassword) {
      throw createHttpError(401, "password did not match");
    }

    // Create access token for login
    const accessToken = createJSONWebToken({ users }, jwtAccessKey, "1h");
    console.log("reched");

    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 1000, // 1H
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const refreshToken = createJSONWebToken({ users }, jwtRefreshKey, "7d");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7Day
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const userData = {
      id: users._id,
      email: users.email,
      name: users.name,
      role: users.role,
      member_since: users.createdAt,
    };
    res.status(200).json({ message: "Login Successful", user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // Success response
    return res.status(200).json({ message: "User Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: " Logout not successful", error });
  }
};
const handleRefreshToken = async (req, res, next) => {
  try {
    const oldCookies = req.cookies.refreshToken;
    // Verify cookies
    const decodedRefreshToken = jwt.verify(oldCookies, jwtRefreshKey);
    console.log("reched 69");

    if (!decodedRefreshToken) {
      throw createError(401, "Invalid refresh token");
    }

    // Create access token for login
    const accessToken = createJSONWebToken(
      decodedRefreshToken.users,
      jwtAccessKey,
      "1h"
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 1000, // 1h
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Refresh token successful",
      user: decodedRefreshToken.users,
    });
  } catch (error) {
    res.status(500).json({ message: "Refresh token failed", error });
  }
};
const handleProtected = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    // Verify cookies
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token");
    }

    res.status(200).json({
      statusCode: 200,
      message: "Protected Resource accessed successfully",
      user: decodedToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error with access protectd route", error });
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtected,
};
