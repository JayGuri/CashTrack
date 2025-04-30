const express = require("express")
const Expense = require("../models/Expense")
const auth = require("../middleware/auth")
const router = express.Router()

// Get report data
router.get("/", auth, async (req, res) => {
  try {
    const { dateRange = "month", category } = req.query

    // Determine date range
    const now = new Date()
    let startDate, endDate

    if (dateRange === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    } else if (dateRange === "quarter") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    } else if (dateRange === "year") {
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
    }

    // Build base query
    const baseQuery = {
      user: req.userId,
      date: { $gte: startDate, $lte: endDate },
    }

    if (category) {
      baseQuery.category = category
    }

    // Get category data
    const categoryData = await Expense.aggregate([
      {
        $match: baseQuery,
      },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          value: 1,
          id: "$_id",
          _id: 0,
        },
      },
    ])

    // Get monthly data
    const monthlyData = []

    if (dateRange === "month" || dateRange === "quarter") {
      // For month or quarter, get daily data grouped by category
      const daysInRange = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

      for (let i = 0; i < daysInRange; i++) {
        const day = new Date(startDate)
        day.setDate(day.getDate() + i)
        const dayStr = day.toLocaleDateString("en-US", { month: "short", day: "numeric" })

        const dayData = { name: dayStr }

        const categoriesForDay = await Expense.aggregate([
          {
            $match: {
              ...baseQuery,
              date: {
                $gte: new Date(day.setHours(0, 0, 0, 0)),
                $lte: new Date(day.setHours(23, 59, 59, 999)),
              },
            },
          },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
        ])

        categoriesForDay.forEach((cat) => {
          dayData[cat._id] = cat.total
        })

        monthlyData.push(dayData)
      }
    } else {
      // For year, get monthly data
      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), i, 1)
        const monthName = month.toLocaleString("default", { month: "short" })
        const startOfMonth = new Date(now.getFullYear(), i, 1)
        const endOfMonth = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59)

        const monthData = { name: monthName }

        const categoriesForMonth = await Expense.aggregate([
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
        ])

        categoriesForMonth.forEach((cat) => {
          monthData[cat._id] = cat.total
        })

        monthlyData.push(monthData)
      }
    }

    // Get weekday data
    const weekdayData = []
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    for (let i = 0; i < 7; i++) {
      const weekdayExpenses = await Expense.aggregate([
        {
          $match: {
            ...baseQuery,
            $expr: { $eq: [{ $dayOfWeek: "$date" }, i === 6 ? 1 : i + 2] },
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$amount" },
          },
        },
      ])

      weekdayData.push({
        name: weekdays[i],
        amount: weekdayExpenses.length > 0 ? weekdayExpenses[0].amount : 0,
      })
    }

    // Get trend data (daily for the date range)
    const trendData = []
    const daysInRange = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

    for (let i = 0; i < daysInRange; i++) {
      const day = new Date(startDate)
      day.setDate(day.getDate() + i)
      const dayStart = new Date(day.setHours(0, 0, 0, 0))
      const dayEnd = new Date(day.setHours(23, 59, 59, 999))

      const dayExpenses = await Expense.aggregate([
        {
          $match: {
            ...baseQuery,
            date: { $gte: dayStart, $lte: dayEnd },
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$amount" },
          },
        },
      ])

      trendData.push({
        date: dayStart.toISOString().split("T")[0],
        amount: dayExpenses.length > 0 ? dayExpenses[0].amount : 0,
      })
    }

    res.json({
      categoryData,
      monthlyData,
      weekdayData,
      trendData,
    })
  } catch (error) {
    console.error("Report data error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
