const Challenge = require("../models/Challenge");
const User = require("../models/User");
const { selectDailyChallenge } = require("../utils/selectDailyChallenge");

// GET daily challenges
const getDailyChallenge = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const todayStr = new Date().toISOString().split("T")[0];
    const challenge = await selectDailyChallenge();

    const isCompletedToday = user.lastChallengeDate === todayStr;

    res.json({
      ...challenge.toObject(),
      completed: isCompletedToday,
      xp: user.xp || 0,
      level: user.level || 1,
    });
  } catch (error) {
    console.error("Failed to fetch daily challenge:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST completed challenge
const completeChallenge = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const todayStr = new Date().toISOString().split("T")[0];

    if (user.lastChallengeDate === todayStr) {
      return res.status(400).json({
        message: "Challenge already completed for today.",
        xp: user.xp,
        level: user.level,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const challenge = await Challenge.findOne({ assignedDate: today });
    if (!challenge) {
      return res
        .status(404)
        .json({ message: "No challenge assigned for today." });
    }

    const xpReward = challenge.xpReward || 50;
    const previousLevel = user.level || 1;

    user.xp = (user.xp || 0) + xpReward;
    user.level = Math.floor(user.xp / 250) + 1;
    const leveledUp = user.level > previousLevel;

    user.lastChallengeDate = todayStr;
    await user.save();

    res.status(200).json({
      message: "Challenge completed!",
      xpEarned: xpReward,
      totalXp: user.xp,
      level: user.level,
      leveledUp,
    });
  } catch (error) {
    console.error("Error completing challenge:", error);
    res.status(500).json({ message: "Failed to complete challenge" });
  }
};

// Export both functions
module.exports = {
  completeChallenge,
  getDailyChallenge,
};
