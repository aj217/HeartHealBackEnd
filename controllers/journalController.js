const Journal = require("../models/Journal");

// Save journal entry
exports.saveJournal = async (req, res) => {
  try {
    const { text, mood, images } = req.body;
    const newEntry = await Journal.create({
      user: req.user.id,
      text,
      mood,
      images,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Retrieve journal entries
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
