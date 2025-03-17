const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trackedActivities: [{ type: String }],
  journalStreaks: { type: Number, default: 0 },
  milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }], // Store Achievement IDs
  dailyChallengesCompleted: [{ type: Date }],
  xp: { type: Number, default: 0 }, 
  level: { type: Number, default: 1 }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", ProgressSchema);
