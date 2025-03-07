const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    mood: { type: String },
    images: [{ type: String }], // Optional images
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", JournalSchema);
