const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  xpReward: { type: Number, default: 50 },
  assignedDate: { type: Date }, 
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
