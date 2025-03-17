const Journal = require("../models/Journal");
const Milestone = require("../models/Milestone");
const Achievement = require("../models/Achievement"); // Import Achievement model

const getAchievements = async (req, res) => {
  try {
    // Get Earned Achievement IDs
    const earnedAchievements = await Milestone.find({ user: req.user.id })
      .populate("achievement")
      .select("achievement -_id");

    // Map Achievements to Include Earned Status and Details
    const achievements = earnedAchievements.map((milestone) => {
      return {
        name: milestone.achievement.name,
        description: milestone.achievement.description,
        icon: milestone.achievement.icon,
        earned: true,
      };
    });

    res.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error.message);
    res.status(500).json({ message: "Error fetching achievements" });
  }
};

module.exports = { getAchievements };
