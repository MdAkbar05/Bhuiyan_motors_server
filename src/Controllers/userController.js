const createHttpError = require("http-errors");
const User = require("../Models/userModel");
const emailWithNodeMailer = require("../Helpers/emailSender");
const { createJSONWebToken } = require("../Helpers/jwt");
const { jwtOtpKey } = require("../secret");
const jwt = require("jsonwebtoken");
// /api/users Get
const handleGetUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      throw createHttpError(404, "No user found in database");
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// /apo/users Post
const handleRegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check user already registered with email
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(403)
        .json({ message: "User already registered with " + email });
    }

    // Function to generate a 6-digit OTP
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    };
    const otp = generateOTP();
    //user
    const token = {
      user: {
        name,
        email,
        password,
      },
      OTP: otp,
    };
    console.log(token);
    // Prepare email data
    // const emailData = {
    //   email,
    //   subject: "Your OTP Code for Account Activation",
    //   html: `
    //   <h2>Hello ${username}!</h2>
    //   <p>Your OTP code for account activation is: <strong>${otp}</strong></p>
    //   <p>This code is valid for the next 10 minutes.</p>
    // `,
    // };

    // // Send OTP email with Nodemailer
    // await emailWithNodeMailer(emailData);

    // Create a JWT token with the OTP
    const userToken = createJSONWebToken(token, jwtOtpKey, "10m"); // Token expires in 10 minutes

    // Set the OTP token in a cookie
    res.cookie("userToken", userToken, {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 60 * 1000,
    });

    res.status(200).json({ message: "OTP sent to your email address", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleVerifyUser = async (req, res) => {
  try {
    const { otp } = req.body;

    // Check if the OTP sent in the request matches the one stored in the cookie
    const userToken = req.cookies.userToken;
    if (!userToken) {
      return res.status(404).json({ message: "OTP has expired" });
    }
    const { user, OTP } = jwt.verify(userToken, jwtOtpKey);
    console.log(jwt.verify(userToken, jwtOtpKey));
    if (OTP !== otp) {
      throw createHttpError(401, "Did not match OTP code");
    }
    const newUser = new User(user);
    await newUser.save();

    res.clearCookie("userToken"); // Clear the cookie after successful registration
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(createError(500, error.message));
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve review" });
  }
};

module.exports = {
  handleGetUsers,
  handleRegisterUser,
  handleUpdateUser,
  handleDeleteUser,
  handleVerifyUser,
};
