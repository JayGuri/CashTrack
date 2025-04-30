"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL, DEFAULT_CATEGORIES } from "../config"
import { toast } from "react-hot-toast"
import { FaPlus, FaChartPie, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseSummary from "../components/ExpenseSummary"
import RecentExpenses from "../components/RecentExpenses"
import CategoryDistribution from "../components/CategoryDistribution"
import MonthlyTrend from "../components/MonthlyTrend"
import StarBorder from "../components/StarBorder"
import "./Dashboard.css"

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalExpenses: 0,
    recentExpenses: [],
    categoryDistribution: [],
    monthlyTrend: [],
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/dashboard`)
      setDashboardData(response.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExpenseAdded = () => {
    setShowExpenseForm(false)
    fetchDashboardData()
    toast.success("Expense added successfully! 💰")
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <StarBorder
          as="button"
          className="btn add-expense-btn"
          color="#1e88e5"
          speed="5s"
          onClick={() => setShowExpenseForm(true)}
        >
          <FaPlus /> Add Expense
        </StarBorder>
      </div>

      {showExpenseForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExpenseForm
              onClose={() => setShowExpenseForm(false)}
              onExpenseAdded={handleExpenseAdded}
              categories={DEFAULT_CATEGORIES}
            />
          </div>
        </div>
      )}

      <div className="dashboard-summary">
        <ExpenseSummary totalExpenses={isLoading ? 0 : dashboardData.totalExpenses} isLoading={isLoading} />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-expenses-card">
          <div className="card-header">
            <h2>
              <FaMoneyBillWave /> Recent Expenses
            </h2>
          </div>
          <div className="card-body">
            <RecentExpenses
              expenses={isLoading ? [] : dashboardData.recentExpenses}
              categories={DEFAULT_CATEGORIES}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="dashboard-card category-distribution-card">
          <div className="card-header">
            <h2>
              <FaChartPie /> Spending by Category
            </h2>
          </div>
          <div className="card-body">
            <CategoryDistribution
              data={isLoading ? [] : dashboardData.categoryDistribution}
              categories={DEFAULT_CATEGORIES}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="dashboard-card monthly-trend-card">
          <div className="card-header">
            <h2>
              <FaCalendarAlt /> Monthly Trend
            </h2>
          </div>
          <div className="card-body">
            <MonthlyTrend data={isLoading ? [] : dashboardData.monthlyTrend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
