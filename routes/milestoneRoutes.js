const express = require("express");
const router = express.Router();
const { getMilestones } = require("../controllers/milestoneController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, getMilestones);

module.exports = router;
