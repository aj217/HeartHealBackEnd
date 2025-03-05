const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const musicRoutes = require("./routes/musicRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/music", musicRoutes);

app.get("/", (req, res) => res.send("Backend Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
