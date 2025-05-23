const express = require("express")
const { registerUser, loginUser,getUserProfile,forgotPassword,resetUserPassword } = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/").post(registerUser)
router.post("/login", loginUser)
router.route("/forgotPassword").post(forgotPassword)
router.route("/resetPassword/:token").post(resetUserPassword)
router.route("/profile").get(protect, getUserProfile)

module.exports = router