const Journal = require("../models/Journal");
const Milestone = require("../models/Milestone");
const Achievement = require("../models/Achievement");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const fs = require("fs");
const path = require("path");

// Mood suggestion based on sentiment score
function getSuggestedMood(score) {
  if (score > 1) return "excited";
  if (score > 0.2) return "happy";
  if (score < -1) return "angry";
  if (score < -0.2) return "sad";
  return "neutral";
}

// Achievement criteria definitions
const achievementCriteria = [
  {
    name: "First Entry",
    description: "Create your first journal entry.",
    criteria: async (user) => {
      const count = await Journal.countDocuments({ user: user._id });
      return count === 1;
    },
  },
  {
    name: "3-Day Writing Streak",
    description: "Write in your journal for 3 consecutive days.",
    criteria: async (user) => {
      const journals = await Journal.find({ user: user._id });
      const uniqueDays = new Set(
        journals.map((j) => new Date(j.createdAt).toISOString().split("T")[0])
      );

      const today = new Date();
      let streak = 0;

      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formatted = date.toISOString().split("T")[0];
        if (uniqueDays.has(formatted)) {
          streak++;
        } else {
          break;
        }
      }

      return streak === 3;
    },
  },
  {
    name: "Mood Tracker",
    description: "Select a mood for 10 journal entries.",
    criteria: async (user) => {
      const moodCount = await Journal.countDocuments({
        user: user._id,
        mood: { $exists: true, $ne: null, $ne: "" },
      });
      return moodCount >= 10;
    },
  },
  {
    name: "Reflection Master",
    description: "Write on 30 unique days.",
    criteria: async (user) => {
      const journals = await Journal.find({ user: user._id });
      const uniqueDays = new Set(
        journals.map((j) => new Date(j.createdAt).toISOString().split("T")[0])
      );
      return uniqueDays.size >= 30;
    },
  },
];

// Save Journal Entry
const saveJournal = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { text, mood } = req.body;

    // Validate plain text
    const plainText = text.replace(/<[^>]*>/g, "").trim();
    if (!plainText) {
      return res.status(400).json({
        message: "Your journal is empty. Please write something.",
      });
    }

    // Sentiment & mood handling
    const sentimentAnalysis = sentiment.analyze(text);
    const suggestedMood = getSuggestedMood(sentimentAnalysis.score);

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const journal = new Journal({
      user: req.user._id,
      text,
      mood: mood || suggestedMood,
      images,
      moodAnalysis: JSON.stringify(sentimentAnalysis),
    });

    await journal.save();
    console.log("Journal saved:", journal);

    // Milestone check
    const unlockedMilestones = [];

    for (const achievement of achievementCriteria) {
      const alreadyUnlocked = await Milestone.findOne({
        user: req.user._id,
        milestoneType: achievement.name,
      });

      const criteriaMet = await achievement.criteria(req.user);

      if (!alreadyUnlocked && criteriaMet) {
        const badge = await Achievement.findOne({ name: achievement.name });
        if (!badge) {
          console.warn(`Achievement not found: ${achievement.name}`);
          continue;
        }

        const milestone = new Milestone({
          user: req.user._id,
          milestoneType: achievement.name,
          achievementId: badge._id,
          achievedAt: new Date(),
        });

        await milestone.save();
        console.log(`Milestone unlocked: ${achievement.name}`);
        unlockedMilestones.push(achievement.name);
      }
    }

    res.status(201).json({
      journal,
      unlockedMilestones,
    });
  } catch (error) {
    console.error("Error saving journal:", error);
    res.status(500).json({ message: "Error saving journal entry" });
  }
};

// Get paginated journals
const getJournals = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Journal.countDocuments({ user: req.user._id });
    const journals = await Journal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalEntries: total,
      journals,
    });
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({ message: "Error fetching journal entries" });
  }
};

// Download a journal entry as .txt
const downloadJournal = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    const filename = `journal-${journal._id}.txt`;
    const plainText = `Date: ${journal.createdAt.toDateString()}\nMood: ${
      journal.mood
    }\n\n${journal.text.replace(/<[^>]*>?/gm, "")}`;

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "text/plain");
    res.send(plainText);
  } catch (error) {
    console.error("Error downloading journal:", error);
    res.status(500).json({ message: "Error downloading journal" });
  }
};

module.exports = {
  saveJournal,
  getJournals,
  downloadJournal,
};
