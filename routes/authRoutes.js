const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); 

const router = express.Router();

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login attempts per 15 mins
  message: "Too many login attempts, please try again later.",
});

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);

// Apply the upload middleware to the update route
router.put("/update", protect, upload.single("profilePicture"), updateProfile);

// Email verification (placeholder)
router.get("/verify-email/:token", (req, res) => {
  res.json({ message: "Email verification route (implement logic here)" });
});

module.exports = router;
