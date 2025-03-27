const mongoose = require("mongoose");

const MusicSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  searchQuery: { type: String, required: true },
  searchType: {
    type: String,
    enum: ["track", "artist", "album"],
    required: true,
  },
  results: [
    {
      name: String,
      artists: [String], 
      album: String,
      url: String,
      image: String,
      preview_url: String,
    },
  ],

  mood: { type: String },
  lastPlayedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Index for quick search retrieval
MusicSchema.index({ searchQuery: 1 });

module.exports = mongoose.model("Music", MusicSchema);
