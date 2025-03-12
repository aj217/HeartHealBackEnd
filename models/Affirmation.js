const mongoose = require("mongoose");

const AffirmationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, default: "general" },
  createdAt: { type: Date, default: Date.now },
});

// Index for faster queries
AffirmationSchema.index({ category: 1 });

module.exports = mongoose.model("Affirmation", AffirmationSchema);
