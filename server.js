const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const musicRoutes = require("./routes/musicRoutes");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Initialize Cache (Store data for 10 minutes)
const cache = new NodeCache({ stdTTL: 600 });

// Middleware to check cache before fetching new data
const checkCache = (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Returning cached data");
    return res.json(cachedData);
  }
  next();
};

// API Rate Limiting (100 requests per 10 minutes)
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Max 100 requests per IP
  message: "Too many requests, please try again later.",
});

// Apply rate limit to all routes
app.use("/api", apiLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quotes", checkCache, quoteRoutes); // Cache applied to Quotes API
app.use("/api/music", musicRoutes);

// Home Route
app.get("/", (req, res) => res.send("Backend Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
