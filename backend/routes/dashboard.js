const express = require("express")
const Expense = require("../models/Expense")
const auth = require("../middleware/auth")
const router = express.Router()

// Get dashboard data
router.get("/", auth, async (req, res) => {
  try {
    // Get current month range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Get total expenses for current month
    const totalExpensesResult = await Expense.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])

    const totalExpenses = totalExpensesResult.length > 0 ? totalExpensesResult[0].total : 0

    // Get recent expenses
    const recentExpenses = await Expense.find({ user: req.userId }).sort("-date").limit(5)

    // Get category distribution
    const categoryDistribution = await Expense.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          total: 1,
          _id: 0,
        },
      },
    ])

    // Get monthly trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })
      const startOfMonthDate = new Date(month.getFullYear(), month.getMonth(), 1)
      const endOfMonthDate = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59)

      const monthTotal = await Expense.aggregate([
        {
          $match: {
            user: req.userId,
            date: { $gte: startOfMonthDate, $lte: endOfMonthDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])

      monthlyTrend.push({
        month: monthName,
        total: monthTotal.length > 0 ? monthTotal[0].total : 0,
      })
    }

    res.json({
      totalExpenses,
      recentExpenses,
      categoryDistribution,
      monthlyTrend,
    })
  } catch (error) {
    console.error("Dashboard data error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
