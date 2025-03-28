const Journal = require("../models/Journal");
const Milestone = require("../models/Milestone");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const fs = require("fs");
const path = require("path");

// Map sentiment score to mood
function getSuggestedMood(score) {
  if (score > 1) return "excited";
  else if (score > 0.2) return "happy";
  else if (score < -1) return "angry";
  else if (score < -0.2) return "sad";
  else return "neutral";
}

// Milestone rules
const achievementCriteria = [
  {
    name: "First Entry",
    description: "Create your first journal entry.",
    criteria: async (user) =>
      (await Journal.countDocuments({ user: user.id })) === 1,
  },
  {
    name: "7-Day Streak",
    description: "Write in your journal for 7 consecutive days.",
    criteria: async (user) => {
      const journals = await Journal.find({ user: user.id })
        .sort({ createdAt: -1 })
        .limit(7);
      if (journals.length < 7) return false;

      for (let i = 0; i < journals.length - 1; i++) {
        const diff =
          journals[i].createdAt.getTime() - journals[i + 1].createdAt.getTime();
        if (diff > 24 * 60 * 60 * 1000) return false;
      }
      return true;
    },
  },
  {
    name: "Mood Tracker",
    description: "Select a mood for 10 journal entries.",
    criteria: async (user) =>
      (await Journal.countDocuments({ user: user.id, mood: { $ne: null } })) >=
      10,
  },
  {
    name: "Reflection Master",
    description: "Write 30 journal entries.",
    criteria: async (user) =>
      (await Journal.countDocuments({ user: user.id })) >= 30,
  },
];

// Save New Journal Entry
const saveJournal = async (req, res) => {
  try {
    const { text, mood } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Journal text is required." });
    }

    // Handle uploaded images
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    // Sentiment analysis
    const sentimentAnalysis = sentiment.analyze(text);
    const suggestedMood = getSuggestedMood(sentimentAnalysis.score);

    const journal = new Journal({
      user: req.user.id,
      text,
      mood: mood || suggestedMood,
      images,
      moodAnalysis: JSON.stringify(sentimentAnalysis),
    });

    await journal.save();

    // Milestone tracking
    for (const achievement of achievementCriteria) {
      const alreadyAchieved = await Milestone.findOne({
        user: req.user.id,
        milestoneType: achievement.name,
      });

      if (!alreadyAchieved && (await achievement.criteria(req.user))) {
        const milestone = new Milestone({
          user: req.user.id,
          milestoneType: achievement.name,
        });
        await milestone.save();
        console.log(`🏆 Milestone unlocked: ${achievement.name}`);
      }
    }

    res.status(201).json(journal);
  } catch (error) {
    console.error("Error saving journal:", error);
    res.status(500).json({ message: "Error saving journal entry" });
  }
};

// Get Paginated Journal Entries
const getJournals = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalEntries = await Journal.countDocuments({ user: req.user.id });
    const journals = await Journal.find({ user: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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

// Download Journal as Text File
const downloadJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!journal) return res.status(404).json({ message: "Journal not found" });

    const fileName = `journal-${journal._id}.txt`;
    const plainText = `📝 Journal Entry\n\nDate: ${journal.createdAt.toDateString()}\nMood: ${
      journal.mood
    }\n\n${journal.text.replace(/<[^>]+>/g, "")}`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "text/plain");
    res.send(plainText);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error generating download" });
  }
};

module.exports = {
  saveJournal,
  getJournals,
  downloadJournal,
};
