const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Doctor=require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const {sendForgotPasswordEmail,sendUserCredentialsEmail }= require("../utils/email");

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: user.getSignedJwtToken(),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
/*const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find user by email and select the password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  console.log("Password match result:", isMatch);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate JWT token with user id and role
  const token = user.getSignedJwtToken();

  // Set token in cookie
  res.cookie("authToken", token, {
    httpOnly: true,  // Make the cookie accessible only by HTTP requests
    secure: process.env.NODE_ENV === "production",  // Secure cookie only in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Set for cross-origin requests
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days expiration for the cookie
  });

  // Respond with success message and user info (excluding password)
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
*/




// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt received:", { email, passwordProvided: !!password });

  // Validate email and password
  if (!email || !password) {
    console.log("Missing email or password");
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find user by email and select the password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    console.log("User not found for email:", email);
    res.status(401);
    throw new Error("Invalid credentials");
  }
  console.log("User found:", user.email);

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  console.log("Password match result:", isMatch);

  if (!isMatch) {
    console.log("Password incorrect for user:", user.email);
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate JWT token with user id and role
  const token = user.getSignedJwtToken();
  console.log("JWT token generated");


  // Set token in cookie
  /*res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });*/

  //new added
  // Set token in cookie
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",    //added
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Respond with success message and user info (excluding password)
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized, user missing");
  }

  // Fetch user based on role (doctor, patient, or admin)
  let user;

  if (req.user.role === "doctor") {
    user = await Doctor.findById(req.user.id).select("-password");
  } else if (req.user.role === "patient") {
    user = await User.findById(req.user._id).select("-password"); // Assuming User is the patient model
  } else {
    // Admins can also access this route, but you can adjust based on your needs
    user = await User.findById(req.user._id).select("-password");
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  console.log("Authenticated User:", req.user); // Logging for debugging purposes

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // 2. Create JWT reset token with short expiry
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // token expires in 1 hour
    );

    // 3. Save reset token expiry in user (optional but useful)
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 4. Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/auth/resetpassword?token=${token}`;

    // 5. Email content
    const message = `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    // 6. Send email
    await sendForgotPasswordEmail(user.email, token, user.name);


    res.status(200).json({ message: "Reset password link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


const resetUserPassword = async (req, res) => {
  try {
    let decodedToken;
    try {
      decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET);
          console.log("✅ Decoded token:", decodedToken); 
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 console.log("✅ User found:", user.email);
    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "Password reset link has expired" });
    }

    const { newPassword } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least 1 uppercase letter, 1 number, and 1 special character, and be at least 6 characters long",
      });
    }

   

    user.password = newPassword;  // assign plain password, do NOT hash here
     console.log("🔐 Password being updated for user:", user._id);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
  const savedUser = await User.findById(user._id).select("+password");
console.log("Saved user's password hash:", savedUser.password);

    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetUserPassword,
};
