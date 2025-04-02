const express = require("express");
const passport = require("../passportConfig");
const { googleAuthCallback, logoutUser } = require("../Controllers/authController");

const router = express.Router();

// Google Authentication Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback
);

// Logout Route
router.get("/logout", logoutUser);

module.exports = router;
