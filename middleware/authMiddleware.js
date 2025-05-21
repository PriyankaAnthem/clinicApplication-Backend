const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel"); // Used for both patients and admins

// Middleware to protect routes (for doctors, patients, and admins)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Step 1: Log cookies
  console.log("🔍 Incoming request cookies:", req.cookies);

  // Step 2: Get token from cookies
  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
    console.log("✅ Token found in cookies:", token);
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("✅ Token found in Authorization header:", token);
  } else {
    console.log("❌ No token found in cookies or headers");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Step 3: Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token successfully decoded:", decoded);

    let user;

    // Step 4: Fetch the correct user type based on role
    if (decoded.role === "doctor") {
      user = await Doctor.findById(decoded.id).select("-password");
      console.log("👨‍⚕️ Doctor fetched:", user);
    } else if (decoded.role === "patient" || decoded.role === "admin") {
      user = await User.findById(decoded.id).select("-password");
      console.log("👤 User fetched (admin/patient):", user);
    } else {
      console.log("❌ Invalid role in token:", decoded.role);
      return res.status(401).json({ message: "Not authorized, invalid role" });
    }

    // Step 5: Check if user exists
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    console.log("✅ Request authenticated. req.user:", req.user);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
});


// Admin-only middleware
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
});

module.exports = { protect, admin };
