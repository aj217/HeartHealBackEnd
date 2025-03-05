const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const router = express.Router();
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
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    accessToken = response.data.access_token;
    console.log("🔹 New Spotify Access Token:", accessToken);

    // Automatically refresh token before it expires (after 1 hour)
    setTimeout(() => {
      console.log("Refreshing Spotify Token...");
      getSpotifyToken();
    }, 3600 * 1000); // 1 hour
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
    console.log("Getting new Spotify token...");
    await getSpotifyToken();
  }
  next();
};

// Search for Any Song, Artist, or Album
router.get("/search", ensureSpotifyToken, async (req, res) => {
  const { query, type = "track" } = req.query; // `type` can be "track", "artist", or "album"
  if (!query)
    return res
      .status(400)
      .json({ message: "Please provide a search query" });

  try {
    const response = await axios.get(
      `${process.env.SPOTIFY_API_URL}/search?q=${encodeURIComponent(
        query
      )}&type=${type}&limit=10`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    let results;
    if (type === "track") {
      results = response.data.tracks.items.map((track) => ({
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        url: track.external_urls.spotify,
        image: track.album.images[0]?.url || null,
        preview_url: track.preview_url || null, // Short audio preview
      }));
    } else if (type === "artist") {
      results = response.data.artists.items.map((artist) => ({
        name: artist.name,
        genres: artist.genres.join(", "),
        followers: artist.followers.total,
        url: artist.external_urls.spotify,
        image: artist.images[0]?.url || null,
      }));
    } else {
      results = response.data.albums.items.map((album) => ({
        name: album.name,
        artist: album.artists.map((artist) => artist.name).join(", "),
        release_date: album.release_date,
        url: album.external_urls.spotify,
        image: album.images[0]?.url || null,
      }));
    }

    res.json({ query, type, results });
  } catch (error) {
    console.error(
      "Error searching Spotify:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        message: "Error fetching music from Spotify",
        error: error.response?.data || error.message,
      });
  }
});

// Suggest Songs Based on Mood (No Predefined Playlists)
router.get("/suggest/:mood", ensureSpotifyToken, async (req, res) => {
  const mood = req.params.mood.toLowerCase();
  const searchQuery = `${mood} music`; // Example: "motivational music"

  try {
    console.log(`Searching Spotify for: ${searchQuery}`);

    const response = await axios.get(
      `${process.env.SPOTIFY_API_URL}/search?q=${encodeURIComponent(
        searchQuery
      )}&type=track&limit=10`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log("Successfully fetched mood-based tracks from Spotify!");

    const tracks = response.data.tracks.items.map((track) => ({
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      url: track.external_urls.spotify,
      image: track.album.images[0]?.url || null,
      preview_url: track.preview_url || null, // Optional: Short preview
    }));

    res.json({ mood, tracks });
  } catch (error) {
    console.error(
      "Error fetching mood-based music:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Error fetching mood-based music from Spotify",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
