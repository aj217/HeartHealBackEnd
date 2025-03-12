const express = require("express");
const NodeCache = require("node-cache");
const {
  getProgress,
  updateProgress,
} = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

router.get("/", protect, async (req, res) => {
  const cachedProgress = cache.get(req.user.id);
  if (cachedProgress) return res.json(cachedProgress);

  const progress = await getProgress(req, res);
  cache.set(req.user.id, progress);
  res.json(progress);
});

router.put("/", protect, updateProgress);

module.exports = router;
