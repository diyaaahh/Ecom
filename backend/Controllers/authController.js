const jwt = require("jsonwebtoken");

// Handle Google Login Callback
const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL;
const googleAuthCallback = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // Set JWT token in a secure cookie
  res.cookie("authToken", req.user.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 3600000, // 1 hour
  });
  res.redirect(`${CLIENT_URL}/`); // Redirect to homepage after login
};

// Logout user
const logoutUser = (req, res) => {
  res.clearCookie("authToken"); // Clear auth cookie
  res.json({ message: "Logged out successfully" });
};

module.exports = { googleAuthCallback, logoutUser };
