const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController"); 
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login attempts per 15 mins
  message: "Too many login attempts, please try again later.",
});

// Authentication Routes using localStorage (JWT in Authorization header)
router.post("/signup", authController.signup);
router.post("/login", loginLimiter, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/logout", authController.logout);

// Protected Routes (require JWT token)
router.get("/profile", protect, authController.getProfile);
router.put(
  "/update",
  protect,
  upload.single("profilePicture"),
  authController.updateProfile
);

// Placeholder for future email verification
router.get("/verify-email/:token", (req, res) => {
  res.json({ message: "Email verification route (implement logic here)" });
});

module.exports = router;
