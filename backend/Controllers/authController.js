const jwt = require("jsonwebtoken");

// Handle Google Login Callback
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
  res.redirect("http://localhost:5173/"); // Redirect to homepage after login
};

// Logout user
const logoutUser = (req, res) => {
  res.clearCookie("authToken"); // Clear auth cookie
  res.json({ message: "Logged out successfully" });
};

module.exports = { googleAuthCallback, logoutUser };
