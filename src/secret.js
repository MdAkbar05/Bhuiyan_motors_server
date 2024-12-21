require("dotenv").config();

const serverPort = process.env.PORT || 5001; // IF NOT WORK 5000

const smtpUser = process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASSWORD;
const dbUrl = process.env.MONGODB_URL || "";
const jwtAccessKey = process.env.JWT_ACCESS_KEY;
const jwtRefreshKey = process.env.JWT_REFRESH_KEY;
const jwtOtpKey = process.env.JWT_OTP_KEY;

module.exports = {
  serverPort,
  dbUrl,
  jwtAccessKey,
  jwtRefreshKey,
  jwtOtpKey,
  smtpUser,
  smtpPass,
};
