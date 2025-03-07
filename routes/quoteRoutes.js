const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const router = express.Router();

// Cache instance (Stores quotes for 10 minutes)
const cache = new NodeCache({ stdTTL: 600 }); // 600 seconds = 10 minutes

// Hardcoded quotes (Fallback)
const localQuotes = [
  "Healing takes time.",
  "You are enough.",
  "Stay strong!",
  "Every storm runs out of rain.",
  "Believe in yourself.",
];

// Middleware to check cache before fetching new data
const checkCache = (req, res, next) => {
  const cachedData = cache.get("quote");
  if (cachedData) {
    console.log("Returning cached quote");
    return res.json(cachedData);
  }
  next();
};

// Fetch quotes from an external API
router.get("/", checkCache, async (req, res) => {
  try {
    console.log("Fetching new quote from external API...");
    const response = await axios.get("https://api.quotable.io/random");
    const quote = { quote: response.data.content };

    // Store response in cache
    cache.set("quote", quote);
    res.json(quote);
  } catch (error) {
    console.error("Error fetching quote from API:", error.message);
    // Fallback: Use local quotes if API fails
    const fallbackQuote = {
      quote: localQuotes[Math.floor(Math.random() * localQuotes.length)],
    };
    cache.set("quote", fallbackQuote); // Cache fallback response
    res.json(fallbackQuote);
  }
});

module.exports = router;
