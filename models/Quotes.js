const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  source: { type: String, default: "Generated" },
  createdAt: { type: Date, default: Date.now },
});

// Indexing for fast lookups
QuoteSchema.index({ author: 1 });

module.exports = mongoose.model("Quote", QuoteSchema);
