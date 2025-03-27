const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getJournals,
  saveJournal,
} = require("../controllers/journalController");

router.get("/", protect, getJournals); // GET /api/journal
router.post("/", protect, saveJournal); // POST /api/journal

module.exports = router;
