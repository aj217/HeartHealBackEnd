const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  achievementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Achievement",
    required: true,
  },
  milestoneType: { type: String, required: true }, // e.g., "First Entry"
  achievedAt: { type: Date, default: Date.now },
});

// Index for faster lookup
MilestoneSchema.index({ user: 1, achievementId: 1 });

module.exports = mongoose.model("Milestone", MilestoneSchema);
