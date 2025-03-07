// Import required modules
const express = require("express"); // Express framework for handling routes
const axios = require("axios"); // Axios for making HTTP requests
const NodeCache = require("node-cache"); // Node-cache for caching API responses
const router = express.Router(); // Create an Express router instance

// Initialize cache (Stores quotes for 10 minutes)
const cache = new NodeCache({ stdTTL: 600 });

// Hardcoded fallback quotes (Used if external APIs fail)
const localQuotes = [
  "Healing takes time.",
  "You are enough.",
  "Stay strong!",
  "Every storm runs out of rain.",
  "Believe in yourself.",
];

// Middleware to check cache before making an API request
const checkCache = (req, res, next) => {
  const cachedData = cache.get("quote"); // Get cached quote
  if (cachedData) {
    console.log("Returning cached quote"); // Log cache hit
    return res.json(cachedData); // Return cached quote to client
  }
  next(); // Proceed to fetch new quote if not found in cache
};

// Define route to fetch quotes
router.get("/", checkCache, async (req, res) => {
  try {
    console.log("Fetching new quote..."); // Log request to external API

    let response;
    try {
      // Try fetching quote from the primary API
      response = await axios.get("https://api.quotable.io/random");
    } catch (err) {
      console.log("Quotable API down. Trying backup API..."); // Log API failure
      // Try fetching quote from backup API
      response = await axios.get("https://zenquotes.io/api/random");
    }

    // Extract quote text from response (Handles different API structures)
    const quote = { quote: response.data.content || response.data[0].q };

    // Store the fetched quote in cache
    cache.set("quote", quote);

    // Send quote as JSON response
    res.json(quote);
  } catch (error) {
    console.error("All APIs failed. Using fallback quote."); // Log total failure
    // Return a fallback quote from hardcoded list
    res.json({
      quote: localQuotes[Math.floor(Math.random() * localQuotes.length)],
    });
  }
});

// Export the router for use in other parts of the application
module.exports = router;
