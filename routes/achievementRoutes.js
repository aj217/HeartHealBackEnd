const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { getAchievements } = require("../controllers/achievementController");

router.get("/", protect, getAchievements); // GET /api/achievements

module.exports = router;
