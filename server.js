const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Route files
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const musicRoutes = require("./routes/musicRoutes");
const affirmationRoutes = require("./routes/affirmationRoutes");
const milestoneRoutes = require("./routes/milestoneRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const recommendationsRoutes = require("./routes/recommendationsRoutes");
const achievementRoutes = require("./routes/achievementRoutes");

// Error and rate limiting middleware/configurations
const errorHandler = require("./middleware/errorMiddleware");
const apiLimiter = require("./config/rateLimitConfig");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error(`Database Connection Error: ${err.message}`);
  process.exit(1);
});

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(express.json());

// CORS for frontend at localhost:5500 (no cookies needed)
const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5500"];
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(compression());
app.use(helmet());
app.use(morgan("combined"));

// Static file serving for uploaded images
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Rate limiter
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

// Home route
app.get("/", (req, res) => res.send("Backend Running!"));

// 404 route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

// Handle multer errors and others
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// Global error handler
app.use(errorHandler);

// Exit handling
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
