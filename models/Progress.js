const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trackedActivities: [{ type: String }], 
  journalStreaks: { type: Number, default: 0 },
  milestones: [{ type: String }], // Array of completed milestone names
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", ProgressSchema);
