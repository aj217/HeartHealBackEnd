const Journal = require("../models/Journal");
const Milestone = require("../models/Milestone");
const Achievement = require("../models/Achievement");

async function checkAndAwardAchievements(userId) {
  const journals = await Journal.find({ user: userId });
  const moodsUsed = new Set(journals.map((j) => j.mood));
  const journalCount = journals.length;

  const alreadyHas = async (name) =>
    await Milestone.findOne({ user: userId, milestoneType: name });

  const milestones = [];

  // First Entry
  if (journalCount >= 1 && !(await alreadyHas("First Entry"))) {
    const badge = await Achievement.findOne({ name: "First Entry" });
    if (badge) {
      milestones.push(
        new Milestone({
          user: userId,
          milestoneType: "First Entry",
          achievementId: badge._id, // ✅ Required field
        })
      );
    }
  }

  // 10 Journal Entries
  if (journalCount >= 10 && !(await alreadyHas("10 Journal Entries"))) {
    const badge = await Achievement.findOne({ name: "10 Journal Entries" });
    if (badge) {
      milestones.push(
        new Milestone({
          user: userId,
          milestoneType: "10 Journal Entries",
          achievementId: badge._id,
        })
      );
    }
  }

  // 🎭 Mood Master (Used 5 or more moods)
  if (moodsUsed.size >= 5 && !(await alreadyHas("Mood Master"))) {
    const badge = await Achievement.findOne({ name: "Mood Master" });
    if (badge) {
      milestones.push(
        new Milestone({
          user: userId,
          milestoneType: "Mood Master",
          achievementId: badge._id,
        })
      );
    }
  }

  // 3-Day Streak
  const streak = calculateStreak(journals.map((j) => j.createdAt));
  if (streak >= 3 && !(await alreadyHas("3-Day Streak"))) {
    const badge = await Achievement.findOne({ name: "3-Day Streak" });
    if (badge) {
      milestones.push(
        new Milestone({
          user: userId,
          milestoneType: "3-Day Streak",
          achievementId: badge._id,
        })
      );
    }
  }

  for (const m of milestones) {
    await m.save();
  }
}

// Calculate streak of consecutive days
function calculateStreak(dates) {
  const sorted = dates
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  let streak = 0;
  let today = new Date().setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expectedDate = today - streak * 86400000; // 1 day in ms
    if (sorted[i] === expectedDate) streak++;
    else break;
  }

  return streak;
}

module.exports = { checkAndAwardAchievements };
