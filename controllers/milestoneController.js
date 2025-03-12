const Milestone = require("../models/Milestone");

// Add a New Milestone
exports.addMilestone = async (req, res) => {
  try {
    const { milestoneType } = req.body;
    if (!milestoneType)
      return res.status(400).json({ message: "Milestone type is required" });

    const milestone = new Milestone({ user: req.user.id, milestoneType });
    await milestone.save();

    res
      .status(201)
      .json({ message: "Milestone added successfully", milestone });
  } catch (error) {
    console.error("Error adding milestone:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All User Milestones
exports.getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
