"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL, DEFAULT_CATEGORIES } from "../config"
import { toast } from "react-hot-toast"
import { FaChartPie, FaChartBar, FaChartLine, FaCalendarAlt, FaDownload } from "react-icons/fa"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import "./ReportPage.css"

const ReportPage = () => {
  const [reportData, setReportData] = useState({
    categoryData: [],
    monthlyData: [],
    weekdayData: [],
    trendData: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("month") // 'month', 'quarter', 'year'
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    fetchReportData()
  }, [dateRange, selectedCategory])

  const fetchReportData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/reports`, {
        params: { dateRange, category: selectedCategory },
      })
      setReportData(response.data)
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error("Failed to load report data")

      // Use empty data if API fails
      setReportData({
        categoryData: [],
        monthlyData: [],
        weekdayData: [],
        trendData: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryColor = (categoryId) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category ? category.color : "#ccc"
  }

  const handleExportData = () => {
    // In a real app, this would generate a CSV or PDF
    toast.success("Report exported successfully! 📊")
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="report-page-container">
      <div className="report-page-header">
        <h1>Reports & Analytics</h1>
        <button className="btn btn-primary export-btn" onClick={handleExportData}>
          <FaDownload /> Export Data
        </button>
      </div>

      <div className="report-filters">
        <div className="filter-group">
          <label>Date Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category Filter</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {DEFAULT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading report data...</div>
      ) : (
        <div className="report-grid">
          <div className="report-card">
            <div className="card-header">
              <h2>
                <FaChartPie /> Spending by Category
              </h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.id)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {reportData.categoryData.map((entry, index) => (
                  <div className="legend-item" key={index}>
                    <div className="legend-color" style={{ backgroundColor: getCategoryColor(entry.id) }}></div>
                    <div className="legend-text">{entry.name}</div>
                    <div className="legend-value">{formatCurrency(entry.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="report-card">
            <div className="card-header">
              <h2>
                <FaChartBar /> Monthly Breakdown
              </h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {DEFAULT_CATEGORIES.slice(0, 5).map((category, index) => (
                      <Bar
                        key={category.id}
                        dataKey={category.id}
                        name={category.name.replace(/[🍔🛍️🚗🎬💡💪📚✈️💇🎁🤷]/gu, "").trim()}
                        stackId="a"
                        fill={getCategoryColor(category.id)}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="report-card">
            <div className="card-header">
              <h2>
                <FaCalendarAlt /> Spending by Day of Week
              </h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.weekdayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="amount" fill="#1e88e5" name="Daily Spending" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="report-card">
            <div className="card-header">
              <h2>
                <FaChartLine /> Daily Spending Trend
              </h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString()
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#00897b"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Daily Spending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportPage
