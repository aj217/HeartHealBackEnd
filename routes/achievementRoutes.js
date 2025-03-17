
const express = require("express");
const { getAchievements } = require("../controllers/achievementController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAchievements);

module.exports = router;
