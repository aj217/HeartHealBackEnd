const Affirmation = require("../models/Affirmation");
const Music = require("../models/Music");
const Journal = require("../models/Journal");

const getRecommendations = async (req, res) => {
  try {
    // Determine User's Mood
    let mood = null;
    const latestJournal = await Journal.findOne({ user: req.user.id }).sort({
      createdAt: -1,
    });
    if (latestJournal && latestJournal.mood) {
      mood = latestJournal.mood;
    }

    // Fetch Music Recommendations
    let music = [];
    if (mood) {
      music = await Music.find({ user: req.user.id, mood: mood }).limit(5); // Limit to 5 recommendations
    } else {
      music = await Music.find({ user: req.user.id }).limit(5); // If no mood, get recent music
    }

    // Fetch Affirmation Recommendations
    let affirmations = [];
    if (mood) {
      affirmations = await Affirmation.find({ mood: mood }).limit(5);
    } else {
      affirmations = await Affirmation.find({}).limit(5); // If no mood, get random affirmations
    }

    // Combine and Return Recommendations
    const recommendations = {
      music: music,
      affirmations: affirmations,
    };

    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};

module.exports = { getRecommendations };
