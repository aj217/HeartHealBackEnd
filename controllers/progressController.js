const Progress = require("../models/Progress");

// Get progress for a logged-in user
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({ message: "No progress data found" });
    }

    res.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error.message);
    res.status(500).json({ message: "Error fetching progress data" });
  }
};

// Update progress data (e.g., update streaks & milestones)
const updateProgress = async (req, res) => {
  try {
    const { trackedActivities, journalStreaks, milestones } = req.body;

    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      // If no progress data exists, create a new entry
      progress = new Progress({
        user: req.user.id,
        trackedActivities,
        journalStreaks,
        milestones,
      });
    } else {
      // Update existing progress
      if (trackedActivities) progress.trackedActivities = trackedActivities;
      if (journalStreaks !== undefined)
        progress.journalStreaks = journalStreaks;
      if (milestones) progress.milestones = milestones;
    }

    await progress.save();
    res.json({ message: "Progress updated successfully", progress });
  } catch (error) {
    console.error("Error updating progress:", error.message);
    res.status(500).json({ message: "Error updating progress data" });
  }
};

module.exports = { getProgress, updateProgress };
