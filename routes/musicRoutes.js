const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const Music = require("../models/Music");
const protect = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
let accessToken = null;

// Get Spotify Access Token
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
    console.log("Spotify Access Token Acquired");
  } catch (error) {
    console.error(
      "Error getting Spotify token:",
      error.response?.data || error.message
    );
  }
};

// Initial Token + Auto Refresh
getSpotifyToken();
setInterval(getSpotifyToken, 3600 * 1000); // Refresh every hour

// Middleware: Ensure Token Exists 
const ensureSpotifyToken = async (req, res, next) => {
  if (!accessToken) {
    console.log("Acquiring Spotify token...");
    await getSpotifyToken();
  }
  next();
};

// Rate Limiting
const musicLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many requests. Please try again later.",
});

// SEARCH Route
router.get(
  "/search",
  protect,
  musicLimiter,
  ensureSpotifyToken,
  async (req, res) => {
    const { query, type = "track" } = req.query;
    if (!query)
      return res.status(400).json({ message: "Please provide a search query" });

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

      const results = response.data.tracks.items.map((track) => ({
        name: track.name,
        artists: track.artists.map((a) => a.name),
        album: track.album.name,
        url: track.external_urls.spotify,
        image: track.album.images[0]?.url || null,
        preview_url: track.preview_url || null,
      }));

      await Music.create({
        user: req.user.id,
        searchQuery: query,
        searchType: type,
        results,
      });

      cache.set(cacheKey, { query, type, results });

      res.json({ query, type, results });
    } catch (error) {
      console.error(
        "Error searching Spotify:",
        error.response?.data || error.message
      );
      res.status(500).json({
        message: "Error fetching music from Spotify",
        error: error.response?.data || error.message,
      });
    }
  }
);

// MOOD-BASED MUSIC Route
router.get("/spotify", ensureSpotifyToken, async (req, res) => {
  const { mood, limit = 10 } = req.query;
  if (!mood)
    return res.status(400).json({ message: "Please provide a mood parameter" });

  const queryMap = {
    happy: "happy upbeat",
    calm: "calm relaxing",
    sad: "sad emotional",
    energetic: "energetic workout",
  };

  const query = queryMap[mood.toLowerCase()] || mood;
  const searchLimit = parseInt(limit);

  const cacheKey = `mood-${mood}-${searchLimit}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Returning cached mood results.");
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `${process.env.SPOTIFY_API_URL}/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=${searchLimit}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const results = response.data.tracks.items.map((track) => ({
      name: track.name,
      artists: track.artists.map((a) => a.name),
      album: track.album.name,
      url: track.external_urls.spotify,
      image: track.album.images[0]?.url || null,
      preview_url: track.preview_url || null,
    }));

    cache.set(cacheKey, { mood, results });

    console.log(`Mood-based music fetched for mood: ${mood}`);
    res.json({ mood, results });
  } catch (error) {
    console.error(
      "Error fetching Spotify mood music:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Error fetching music from Spotify",
      error: error.response?.data || error.message,
    });
  }
});

// Search History Route
router.get("/history", protect, async (req, res) => {
  try {
    const history = await Music.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (error) {
    console.error("Error fetching search history:", error.message);
    res.status(500).json({ message: "Error fetching search history" });
  }
});

module.exports = router;
