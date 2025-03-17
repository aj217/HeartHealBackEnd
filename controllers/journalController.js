const Journal = require("../models/Journal");
const Milestone = require("../models/Milestone");
const sentiment = require("sentiment"); // Import sentiment analysis library
const Achievement = require("../models/Achievement");

const achievementCriteria = [
  {
    name: "First Entry",
    description: "Create your first journal entry.",
    criteria: (user) => Journal.countDocuments({ user: user.id }) === 1,
  },
  {
    name: "7-Day Streak",
    description: "Write in your journal for 7 consecutive days.",
    criteria: async (user) => {
      const journals = await Journal.find({ user: user.id })
        .sort({ createdAt: -1 })
        .limit(7);
      if (journals.length < 7) return false;

      // Check if the journals were written on consecutive days
      for (let i = 0; i < journals.length - 1; i++) {
        const diff =
          journals[i].createdAt.getTime() - journals[i + 1].createdAt.getTime();
        if (diff > 24 * 60 * 60 * 1000) {
          return false;
        }
      }
      return true;
    },
  },
  {
    name: "Mood Tracker",
    description: "Select a mood for 10 journal entries.",
    criteria: (user) =>
      Journal.countDocuments({ user: user.id, mood: { $ne: null } }) >= 10,
  },
  {
    name: "Reflection Master",
    description: "Write 30 journal entries.",
    criteria: (user) => Journal.countDocuments({ user: user.id }) >= 30,
  },
];

// Save a New Journal Entry
const saveJournal = async (req, res) => {
  try {
    const { text, mood, images } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Journal text is required." });
    }

    // Mood Analysis using sentiment library
    const sentimentAnalysis = sentiment.analyze(text);
    let suggestedMood = getSuggestedMood(sentimentAnalysis.score); // Get suggested mood from score

    const journal = new Journal({
      user: req.user.id,
      text,
      mood: mood || suggestedMood, // Use user-selected mood or suggested mood
      images,
      moodAnalysis: JSON.stringify(sentimentAnalysis), // Store sentiment analysis results
    });

    await journal.save();

    // Check for new achievements
    for (const achievement of achievementCriteria) {
      // Get the Achievement from the DB
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
        console.log(
          `New milestone achieved: ${achievement.name} by user ${req.user.id}`
        );
      }
    }

    res.status(201).json(journal);
  } catch (error) {
    console.error("Error saving journal entry:", error);
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

// Function to map sentiment score to a mood
function getSuggestedMood(score) {
  if (score > 1) {
    return "excited";
  } else if (score > 0.2) {
    return "happy";
  } else if (score < -1) {
    return "angry";
  } else if (score < -0.2) {
    return "sad";
  } else {
    return "neutral";
  }
}

module.exports = { saveJournal, getJournals };
