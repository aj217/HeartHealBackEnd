const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Fallback: Check for token in query param (for downloads or previews)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = protect;
