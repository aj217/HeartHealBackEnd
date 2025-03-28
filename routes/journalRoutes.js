const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); 
const {
  saveJournal,
  getJournals,
  downloadJournal,
} = require("../controllers/journalController");

// Routes
router.get("/", protect, getJournals);
router.post("/", protect, upload.array("images", 5), saveJournal);
router.get("/download/:id", protect, downloadJournal);

module.exports = router;
