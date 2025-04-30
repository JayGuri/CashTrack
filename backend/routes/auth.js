const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()

// Default categories
const defaultCategories = [
  { id: "food", name: "Food & Dining 🍔", color: "#FF5733", icon: "🍔", isDefault: true },
  { id: "shopping", name: "Shopping 🛍️", color: "#C70039", icon: "🛍️", isDefault: true },
  { id: "transport", name: "Transportation 🚗", color: "#900C3F", icon: "🚗", isDefault: true },
  { id: "entertainment", name: "Entertainment 🎬", color: "#581845", icon: "🎬", isDefault: true },
  { id: "utilities", name: "Bills & Utilities 💡", color: "#FFC300", icon: "💡", isDefault: true },
  { id: "health", name: "Health & Fitness 💪", color: "#DAF7A6", icon: "💪", isDefault: true },
  { id: "education", name: "Education 📚", color: "#FF5733", icon: "📚", isDefault: true },
  { id: "travel", name: "Travel ✈️", color: "#C70039", icon: "✈️", isDefault: true },
  { id: "personal", name: "Personal Care 💇", color: "#900C3F", icon: "💇", isDefault: true },
  { id: "gifts", name: "Gifts & Donations 🎁", color: "#581845", icon: "🎁", isDefault: true },
  { id: "other", name: "Other 🤷", color: "#FFC300", icon: "🤷", isDefault: true },
]

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      categories: defaultCategories,
    })

    await user.save()

    // Create and sign JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and sign JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
