const express = require("express");
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
const { Routes } = require("react-router-dom");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/update", protect, updateProfile);

module.exports = router;
