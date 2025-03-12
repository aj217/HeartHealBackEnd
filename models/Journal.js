const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  mood: { type: String, enum: ["happy", "sad", "neutral", "angry", "excited"] },
  images: [{ type: String }], // Array of image URLs
  moodAnalysis: { type: String, default: "" }, // Optional for AI analysis
  createdAt: { type: Date, default: Date.now },
});

// Index for faster retrieval & sorting
JournalSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Journal", JournalSchema);
