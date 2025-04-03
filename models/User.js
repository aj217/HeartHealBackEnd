const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    refreshToken: { type: String },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    challengeCompletedAt: { type: Date },
    lastChallengeDate: { type: String }, // e.g., "2025-04-03"
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
