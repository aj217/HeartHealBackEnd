const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: "/images/default_badge.png" }, 
  xpReward: { type: Number, default: 100 },
  criteria: {
    type: String,
    enum: ["journalEntries", "streak", "moodEntries", "musicSearches"],
    required: true,
  },
  targetValue: { type: Number, required: true },
});

module.exports = mongoose.model("Achievement", AchievementSchema);
