const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getAchievements } = require("../controllers/achievementController");

// Get earned achievements for logged-in user
router.get("/", protect, getAchievements);

module.exports = router;
