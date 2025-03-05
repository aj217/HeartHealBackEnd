const express = require("express");
const axios = require("axios");
const router = express.Router();

// Hardcoded quotes (Fallback)
const localQuotes = [
  "Healing takes time.",
  "You are enough.",
  "Stay strong!",
  "Every storm runs out of rain.",
  "Believe in yourself.",
];

// Fetch quotes from an external API
router.get("/", async (req, res) => {
  try {
    // External API for quotes (Optional: Use if available)
    const response = await axios.get("https://api.quotable.io/random");
    res.json({ quote: response.data.content });
  } catch (error) {
    console.error("Error fetching quote:", error.message);
    // Fallback: Use local quotes if API fails
    res.json({
      quote: localQuotes[Math.floor(Math.random() * localQuotes.length)],
    });
  }
});

module.exports = router;
