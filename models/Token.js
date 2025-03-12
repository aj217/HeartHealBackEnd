const mongoose = require("mongoose");
const crypto = require("crypto");

const TokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true }, // Stores hashed version of token
  tokenType: {
    type: String,
    enum: ["resetPassword", "emailVerification", "refreshToken"],
    required: true,
  },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // Auto-delete expired tokens
});

// Hash token before saving to DB for extra security
TokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) return next();
  this.token = crypto.createHash("sha256").update(this.token).digest("hex");
  next();
});

// Verify token function (Compare input token with hashed version)
TokenSchema.methods.verifyToken = function (inputToken) {
  const hashedInput = crypto
    .createHash("sha256")
    .update(inputToken)
    .digest("hex");
  return this.token === hashedInput;
};

module.exports = mongoose.model("Token", TokenSchema);
