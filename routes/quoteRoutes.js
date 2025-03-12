const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 });

const localQuotes = ["Healing takes time.", "You are enough.", "Stay strong!"];

// Middleware to check cache
const checkCache = (req, res, next) => {
  const cachedQuote = cache.get("quote");
  if (cachedQuote) return res.json(cachedQuote);
  next();
};

// Fetch Quotes API
router.get("/", checkCache, async (req, res) => {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const quote = { quote: response.data.content };

    cache.set("quote", quote);
    res.json(quote);
  } catch (error) {
    res.json({
      quote: localQuotes[Math.floor(Math.random() * localQuotes.length)],
    });
  }
});

module.exports = router;
