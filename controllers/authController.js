const asyncHandler = require("express-async-handler");

// Logout handler for all roles (Admin, Doctor, User)
const logout = asyncHandler(async (req, res) => {
  // Clear the authToken cookie
/*res.clearCookie('authToken', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});*/

/*res.clearCookie('authToken', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/', // 
});*/


//new added
 res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });




res.status(200).json({ message: 'Logged out successfully' });
});

module.exports =  logout ;
