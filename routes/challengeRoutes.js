const express = require("express");
const {
  getChallenges,
  completeChallenge,
} = require("../controllers/challengeController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getChallenges);
router.post("/complete", protect, completeChallenge);

module.exports = router;
