const Journal = require("../models/Journal");

// Utility to calculate streak from journal dates
function calculateStreak(dates) {
  const sorted = dates
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  let streak = 0;
  let today = new Date().setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expectedDate = today - streak * 86400000;
    if (sorted[i] === expectedDate) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Get dashboard progress
const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const journals = await Journal.find({ user: userId });

    const journalCount = journals.length;
    const moodStats = {};
    const entryDates = [];

    journals.forEach((entry) => {
      const mood = entry.mood || "unspecified";
      moodStats[mood] = (moodStats[mood] || 0) + 1;
      entryDates.push(entry.createdAt);
    });

    const streak = calculateStreak(entryDates);

    res.json({
      journalCount,
      moodStats,
      streak,
    });
  } catch (error) {
    console.error("Error fetching dashboard progress:", error.message);
    res.status(500).json({ message: "Error fetching progress data" });
  }
};

module.exports = { getProgress };
