const Challenge = require("../models/Challenge");

const selectDailyChallenge = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if a challenge is already assigned today
  const existing = await Challenge.findOne({ assignedDate: today });
  if (existing) return existing;

  // Get recently used challenges (past 7 days)
  const pastWeek = new Date(today);
  pastWeek.setDate(pastWeek.getDate() - 7);

  const recentChallenges = await Challenge.find({
    assignedDate: { $gte: pastWeek, $lt: today },
  });

  const usedDescriptions = recentChallenges.map((c) => c.description);

  // Find unused challenges
  const eligibleChallenges = await Challenge.find({
    description: { $nin: usedDescriptions },
    assignedDate: { $exists: false },
  });

  if (eligibleChallenges.length === 0) {
    // Fallback: use any unassigned challenge
    const allUnassigned = await Challenge.find({
      assignedDate: { $exists: false },
    });

    if (allUnassigned.length === 0) {
      console.warn("⚠ No unassigned challenges left in the database.");
      return {
        description: "No challenge available today.",
        xpReward: 0,
        assignedDate: today,
      };
    }

    const fallback =
      allUnassigned[Math.floor(Math.random() * allUnassigned.length)];
    fallback.assignedDate = today;
    await fallback.save();
    return fallback;
  }

  // Assign and return a random eligible challenge
  const selected =
    eligibleChallenges[Math.floor(Math.random() * eligibleChallenges.length)];
  selected.assignedDate = today;
  await selected.save();
  return selected;
};

// Proper export to avoid circular dependency issues
module.exports = {
  selectDailyChallenge,
};
