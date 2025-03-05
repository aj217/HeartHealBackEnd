const express = require("express");
const {
  saveJournal,
  getJournals,
} = require("../controllers/journalController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, saveJournal);
router.get("/", protect, getJournals);

module.exports = router;
