const express = require("express");
const {
  verifyEmail,
  resetPassword,
} = require("../controllers/tokenController");

const router = express.Router();

router.get("/verify/:token", verifyEmail);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
