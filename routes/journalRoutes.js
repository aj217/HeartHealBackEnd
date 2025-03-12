const express = require("express");
const {
  saveJournal,
  getJournals,
} = require("../controllers/journalController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create journal entry
router.post("/", protect, saveJournal);

// Get journal entries (paginated)
router.get("/", protect, getJournals);

// Soft delete journal (optional)
router.delete("/:id", protect, async (req, res) => {
  // Implement soft delete logic here instead of permanent deletion
  res.json({ message: "Journal deleted (soft delete logic needed)" });
});

module.exports = router;
