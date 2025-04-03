const Milestone = require("../models/Milestone");

// Get all milestones for the logged-in user
const getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ user: req.user.id }).sort({
      achievedAt: -1,
    });
    res.status(200).json(milestones);
  } catch (error) {
    console.error(" Error fetching milestones:", error);
    res.status(500).json({ message: "Failed to load milestones." });
  }
};

module.exports = {
  getMilestones,
};
