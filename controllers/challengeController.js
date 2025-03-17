const Challenge = require("../models/Challenge");
const Progress = require("../models/Progress");
const User = require("../models/User");

const getChallenges = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    let challenge = await Challenge.findOne({ date: today });

    if (!challenge) {
      // Create a new challenge if one doesn't exist for today
      const newChallenge = new Challenge({
        description:
          "Write a journal entry about something you're grateful for.",
        xpReward: 75,
        date: today,
      });
      challenge = await newChallenge.save();
    }

    res.json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error.message);
    res.status(500).json({ message: "Error fetching challenge" });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const challenge = await Challenge.findOne({ date: today });

    if (!challenge) {
      return res.status(404).json({ message: "No challenge found for today" });
    }

    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = new Progress({ user: req.user.id });
    }

    // Check if the challenge has already been completed
    if (progress.dailyChallengesCompleted.includes(today)) {
      return res
        .status(400)
        .json({ message: "Challenge already completed today" });
    }

    // Update progress
    progress.dailyChallengesCompleted.push(today);
    progress.xp = (progress.xp || 0) + challenge.xpReward;
    await progress.save();

    // Update user level (example logic)
    const user = await User.findById(req.user.id);
    user.xp = (user.xp || 0) + challenge.xpReward;
    user.level = Math.floor(user.xp / 1000) + 1; // Example leveling system
    await user.save();

    res.json({
      message: "Challenge completed successfully",
      xp: challenge.xpReward,
      level: user.level,
    });
  } catch (error) {
    console.error("Error completing challenge:", error.message);
    res.status(500).json({ message: "Error completing challenge" });
  }
};

module.exports = { getChallenges, completeChallenge };
