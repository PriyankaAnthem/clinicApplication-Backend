const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");




const loginAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide email");
  }

  const admin = await User.findOne({ email });

  if (!admin) {
    console.log("Admin not found with the provided email:", email);
    res.status(401);
    throw new Error("Invalid email");
  }

  if (admin.role === "admin") {
    const token = admin.getSignedJwtToken();

    res.cookie("authToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",  // only secure in prod
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",  // relax sameSite in dev
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days, keep consistent
});


   /*  res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", 
      maxAge: 24 * 60 * 60 * 1000, 
    });*/


    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      
    });
  } else {
    console.log("User is not an admin");
    res.status(401);
    throw new Error("Not authorized as admin");
  }
});



// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)


const getAdminProfile = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized as admin');
  }

  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});




module.exports = {loginAdmin,getAdminProfile};