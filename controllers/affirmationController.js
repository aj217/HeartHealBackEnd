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

// Add a new affirmation
exports.addAffirmation = async (req, res) => {
  try {
    const { text, category } = req.body;
    if (!text)
      return res.status(400).json({ message: "Affirmation text is required" });

    const affirmation = new Affirmation({ text, category });
    await affirmation.save();

    res
      .status(201)
      .json({ message: "Affirmation added successfully", affirmation });
  } catch (error) {
    console.error("Error saving affirmation:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
