const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const Music = require("../models/Music");
const protect = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache results for 1 hour
let accessToken = null;

// Function to Get Spotify Access Token
const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    accessToken = response.data.access_token;
    console.log("New Spotify Access Token Acquired");

    // Automatically refresh token every hour
    setTimeout(getSpotifyToken, 3600 * 1000);
  } catch (error) {
    console.error(
      "Error getting Spotify token:",
      error.response?.data || error.message
    );
  }
};

// Middleware to Ensure Access Token is Available
const ensureSpotifyToken = async (req, res, next) => {
  if (!accessToken) {
    console.log("Acquiring new Spotify token...");
    await getSpotifyToken();
  }
  next();
};

// Rate Limiting Middleware (Prevents API Abuse)
const musicLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Limit to 20 requests per 10 minutes
  message: "Too many requests, please slow down.",
});

// Search for Any Song, Artist, or Album (Stores in DB)
router.get(
  "/search",
  protect,
  musicLimiter,
  ensureSpotifyToken,
  async (req, res) => {
    const { query, type = "track" } = req.query;
    if (!query)
      return res
        .status(400)
        .json({ message: "Please provide a search query" });

    // Check cache for existing results
    const cacheKey = `${query}-${type}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached search results.");
      return res.json(cachedData);
    }

    try {
      const response = await axios.get(
        `${process.env.SPOTIFY_API_URL}/search?q=${encodeURIComponent(
          query
        )}&type=${type}&limit=10`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      let results = response.data.tracks.items.map((track) => ({
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        url: track.external_urls.spotify,
        image: track.album.images[0]?.url || null,
        preview_url: track.preview_url || null,
      }));

      // Store Search in MongoDB
      await Music.create({
        user: req.user.id,
        searchQuery: query,
        searchType: type,
        results,
      });

      // Cache the result
      cache.set(cacheKey, { query, type, results });

      res.json({ query, type, results });
    } catch (error) {
      console.error(
        "Error searching Spotify:",
        error.response?.data || error.message
      );
      res
        .status(500)
        .json({
          message: " Error fetching music from Spotify",
          error: error.response?.data || error.message,
        });
    }
  }
);

// Fetch User's Search History
router.get("/history", protect, async (req, res) => {
  try {
    const history = await Music.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (error) {
    console.error(" Error fetching search history:", error.message);
    res.status(500).json({ message: "⚠️ Error fetching search history" });
  }
});

module.exports = router;
