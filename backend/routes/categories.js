const express = require("express")
const Category = require("../models/Category")
const User = require("../models/User")
const auth = require("../middleware/auth")
const router = express.Router()

// Get all categories for the user
router.get("/", auth, async (req, res) => {
  try {
    // Get user's custom categories
    const customCategories = await Category.find({ user: req.userId })

    // Get user's default categories
    const user = await User.findById(req.userId)
    const defaultCategories = user.categories.filter((cat) => cat.isDefault)

    // Combine and send
    res.json([...defaultCategories, ...customCategories])
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new category
router.post("/", auth, async (req, res) => {
  try {
    const { id, name, color, icon } = req.body

    // Check if category ID already exists
    const existingCategory = await Category.findOne({
      user: req.userId,
      id,
    })

    if (existingCategory) {
      return res.status(400).json({ message: "Category ID already exists" })
    }

    const category = new Category({
      user: req.userId,
      id,
      name,
      color,
      icon,
      isDefault: false,
    })

    await category.save()

    res.status(201).json(category)
  } catch (error) {
    console.error("Create category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a category
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, color, icon } = req.body
    const updates = {}

    if (name) updates.name = name
    if (color) updates.color = color
    if (icon) updates.icon = icon

    // Check if it's a default category
    const user = await User.findById(req.userId)
    const defaultCategory = user.categories.find((cat) => cat.id === req.params.id && cat.isDefault)

    if (defaultCategory) {
      // Update in user's default categories
      const updatedCategories = user.categories.map((cat) => {
        if (cat.id === req.params.id) {
          return { ...cat, ...updates }
        }
        return cat
      })

      await User.findByIdAndUpdate(req.userId, { categories: updatedCategories })

      const updatedCategory = user.categories.find((cat) => cat.id === req.params.id)
      return res.json(updatedCategory)
    }

    // Update custom category
    const category = await Category.findOneAndUpdate(
      { id: req.params.id, user: req.userId },
      { $set: updates },
      { new: true },
    )

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json(category)
  } catch (error) {
    console.error("Update category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a category
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if it's a default category
    const user = await User.findById(req.userId)
    const isDefault = user.categories.some((cat) => cat.id === req.params.id && cat.isDefault)

    if (isDefault) {
      return res.status(400).json({ message: "Cannot delete default category" })
    }

    const category = await Category.findOneAndDelete({
      id: req.params.id,
      user: req.userId,
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category deleted" })
  } catch (error) {
    console.error("Delete category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
