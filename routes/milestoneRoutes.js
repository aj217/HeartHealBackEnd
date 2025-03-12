const express = require("express");
const {
  getMilestones,
  addMilestone,
} = require("../controllers/milestoneController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMilestones);
router.post("/", protect, addMilestone);

module.exports = router;
