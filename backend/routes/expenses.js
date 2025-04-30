const express = require("express")
const Expense = require("../models/Expense")
const auth = require("../middleware/auth")
const router = express.Router()

// Get all expenses for the user
router.get("/", auth, async (req, res) => {
  try {
    const { category, startDate, endDate, sort = "-date" } = req.query

    // Build query
    const query = { user: req.userId }

    if (category) {
      query.category = category
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) }
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) }
    }

    const expenses = await Expense.find(query).sort(sort)

    res.json(expenses)
  } catch (error) {
    console.error("Get expenses error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single expense
router.get("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.json(expense)
  } catch (error) {
    console.error("Get expense error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new expense
router.post("/", auth, async (req, res) => {
  try {
    const { amount, category, description, date } = req.body

    const expense = new Expense({
      user: req.userId,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    })

    await expense.save()

    res.status(201).json(expense)
  } catch (error) {
    console.error("Create expense error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update an expense
router.put("/:id", auth, async (req, res) => {
  try {
    const { amount, category, description, date } = req.body
    const updates = {}

    if (amount) updates.amount = amount
    if (category) updates.category = category
    if (description) updates.description = description
    if (date) updates.date = new Date(date)

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: updates },
      { new: true },
    )

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.json(expense)
  } catch (error) {
    console.error("Update expense error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete an expense
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.json({ message: "Expense deleted" })
  } catch (error) {
    console.error("Delete expense error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
