const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")
const router = express.Router()

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/me", auth, async (req, res) => {
  try {
    const { name, email } = req.body
    const updates = {}

    if (name) updates.name = name
    if (email) updates.email = email

    const user = await User.findByIdAndUpdate(req.userId, { $set: updates }, { new: true })

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Change password
router.put("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Check current password
    const isMatch = await req.user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    req.user.password = newPassword
    await req.user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
