const Achievement = require("../models/Achievement");
const Milestone = require("../models/Milestone");

// @desc Get earned achievements for the logged-in user
// @route GET /api/achievements
// @access Private
const getAchievements = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch milestones where user has unlocked an achievement
    const earned = await Milestone.find({ user: req.user._id }).populate(
      "achievementId"
    );

    // Format the response
    const achievements = earned.map((milestone) => ({
      name: milestone.achievementId.name,
      description: milestone.achievementId.description,
      icon: milestone.achievementId.icon,
      earned: true,
      achievedAt: milestone.achievedAt,
    }));

    res.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error.message);
    res.status(500).json({ message: "Error fetching achievements" });
  }
};

module.exports = {
  getAchievements,
};
