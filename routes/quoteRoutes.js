const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const protect = require("../middleware/authMiddleware");
const Quote = require("../models/Quotes");

const router = express.Router();

// Cache quotes for 5 seconds
const cache = new NodeCache({ stdTTL: 5 });

// Rate Limiting Middleware to prevent API abuse
const quoteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // Allow up to 30 requests per 10 minutes
  message: "Too many requests, please slow down.",
});

// Returns a random inspirational quote
router.get("/random", quoteLimiter, async (req, res) => {
  const cacheKey = "random-quote";
  const cachedQuote = cache.get(cacheKey);
  if (cachedQuote) {
    console.log("Returning cached quote");
    return res.json(cachedQuote);
  }

  try {
    // Fetch a random quote from ZenQuotes API
    const response = await axios.get("https://zenquotes.io/api/random");
    if (response.data && response.data[0]) {
      const quoteData = {
        quote: response.data[0].q,
        author: response.data[0].a,
      };
      // Cache the quote data for future requests
      cache.set(cacheKey, quoteData);
      res.json(quoteData);
    } else {
      res.status(500).json({ message: "No quote data received." });
    }
  } catch (error) {
    console.error(
      "Error fetching quote:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Error fetching quote",
      error: error.response?.data || error.message,
    });
  }
});

// Save a favorite quote
router.post("/favorite", protect, async (req, res) => {
  const { text, author, mood } = req.body;
  try {
    // Prevent duplicate quote for same user
    const existing = await Quote.findOne({
      user: req.user.id,
      text,
      author,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Quote already saved to favorites." });
    }

    const saved = await Quote.create({
      user: req.user.id,
      text,
      author,
      mood,
      source: "User Favorite",
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving favorite quote:", error.message);
    res.status(500).json({ message: "Failed to save quote" });
  }
});

// Get user’s saved quotes
router.get("/favorites", protect, async (req, res) => {
  try {
    const { mood } = req.query;
    const filter = { user: req.user.id };

    if (mood) {
      filter.mood = mood;
    }

    const quotes = await Quote.find(filter).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    console.error("Error fetching favorite quotes:", error.message);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

// DELETE a favorite quote
router.delete("/favorites/:id", protect, async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    await Quote.deleteOne({ _id: quote._id });
    res.json({ message: "Quote removed from favorites" });
  } catch (error) {
    console.error("Error deleting favorite quote:", error.message);
    res.status(500).json({ message: "Failed to delete quote" });
  }
});

module.exports = router;
