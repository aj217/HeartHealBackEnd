const Progress = require("../models/Progress");

// Get healing progress
exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({ message: "No progress found" });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
