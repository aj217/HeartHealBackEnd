const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  xpReward: { type: Number, default: 50 },
  date: { type: Date, required: true, unique: true }, // One challenge per day
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
