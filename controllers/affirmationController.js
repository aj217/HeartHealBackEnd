const Affirmation = require("../models/Affirmation");

// Get all affirmations
exports.getAffirmations = async (req, res) => {
  try {
    const affirmations = await Affirmation.find().sort({ createdAt: -1 });
    res.json(affirmations);
  } catch (error) {
    console.error("Error fetching affirmations:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
