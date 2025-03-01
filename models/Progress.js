const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trackedActivities: [{ activity: String, timestamp: Date }], // Activities like meditation, therapy, etc.
  journalStreaks: { type: Number, default: 0 }, // Consecutive journal entries
  milestones: [{ title: String, date: Date }], // Major achievements
});

module.exports = mongoose.model("Progress", ProgressSchema);
