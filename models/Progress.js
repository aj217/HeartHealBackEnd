const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    journalCount: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    moodStats: {
      type: Map,
      of: Number,
      default: {},
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    dailyChallengesCompleted: {
      type: [String], // Dates in 'YYYY-MM-DD' format
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", ProgressSchema);
