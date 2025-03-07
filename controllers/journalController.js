const Journal = require("../models/Journal");

// Save a New Journal Entry
const saveJournal = async (req, res) => {
  try {
    const { text, mood, images } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Journal text is required." });
    }

    const journal = new Journal({
      user: req.user.id,
      text,
      mood,
      images,
    });

    await journal.save();
    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: "Error saving journal entry" });
  }
};

// Get Paginated Journal Entries
const getJournals = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default page = 1
  const limit = parseInt(req.query.limit) || 10; // Default 10 entries per page
  const skip = (page - 1) * limit;

  try {
    const totalEntries = await Journal.countDocuments({ user: req.user.id });
    const journals = await Journal.find({ user: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by latest entry

    res.json({
      page,
      totalPages: Math.ceil(totalEntries / limit),
      totalEntries,
      journals,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching journal entries" });
  }
};

module.exports = { saveJournal, getJournals };
