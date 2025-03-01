// User Model 
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store hashed version in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Log the token in the console for testing
    console.log(`Generated Reset Token: ${resetToken}`);
    console.log(
      `Use this URL: http://localhost:5000/api/auth/reset-password/${resetToken}`
    );

    // Send Email (If configured)
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Reset your password here: http://localhost:5000/api/auth/reset-password/${resetToken}`
    );

    res.json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//  Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// logout 

exports.logout = async (req, res) => {
  res.json({ message: "User logged out successfully" });
};

// Get User
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
