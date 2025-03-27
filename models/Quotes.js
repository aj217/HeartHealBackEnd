const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  mood: { type: String }, 
  source: { type: String, default: "Generated" },
  createdAt: { type: Date, default: Date.now },
});

QuoteSchema.index({ author: 1 });

module.exports = mongoose.model("Quote", QuoteSchema);
