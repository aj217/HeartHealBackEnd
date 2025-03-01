const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  mood: {
    type: String,
    enum: ["happy", "sad", "neutral", "angry", "excited"],
    default: "neutral",
  },
  images: [{ type: String }], // Array of image URLs 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Journal", JournalSchema);
