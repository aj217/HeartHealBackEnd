const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  completeChallenge,
  getDailyChallenge,
} = require("../controllers/challengeController");

router.get("/daily", auth, getDailyChallenge);
router.post("/complete", auth, completeChallenge);

module.exports = router;
