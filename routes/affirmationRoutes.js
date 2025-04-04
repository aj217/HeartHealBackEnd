const express = require("express");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const Affirmation = require("../models/Affirmation");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 1800 }); // Cache for 30 minutes

// Rate Limiting Middleware
const affirmationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Allow max 50 requests per 10 mins
  message: "Too many requests, slow down!",
});

// Get All Affirmations with Pagination & Caching
router.get("/", affirmationLimiter, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category || "general";
  const skip = (page - 1) * limit;

  const cacheKey = `affirmations-${category}-${page}-${limit}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const totalAffirmations = await Affirmation.countDocuments({ category });
    const affirmations = await Affirmation.find({ category })
      .skip(skip)
      .limit(limit);

    const responseData = {
      page,
      totalPages: Math.ceil(totalAffirmations / limit),
      totalAffirmations,
      affirmations,
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching affirmations:", error.message);
    res.status(500).json({ message: "Error fetching affirmations" });
  }
});

module.exports = router;
