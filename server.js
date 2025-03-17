const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const musicRoutes = require("./routes/musicRoutes");
const affirmationRoutes = require("./routes/affirmationRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const milestoneRoutes = require("./routes/milestoneRoutes");
const apiLimiter = require("./config/rateLimitConfig");
const challengeRoutes = require("./routes/challengeRoutes");
const recommendationsRoutes = require("./routes/recommendationsRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error(`Database Connection Error: ${err.message}`);
  process.exit(1);
});

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" })); // Secure CORS settings
app.use(compression());
app.use(helmet());
app.use(morgan("combined")); // Logs requests (useful for debugging & monitoring)

// Apply rate limit to all API routes
app.use("/api", apiLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/affirmations", affirmationRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/recommendations", recommendationsRoutes);

// Home Route
app.get("/", (req, res) => res.send("Backend Running!"));

// 404 Route Handling (for unknown routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

// Error Handling Middleware
app.use(errorHandler);

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Promise Rejection: ${err.message}`);
  process.exit(1);
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
