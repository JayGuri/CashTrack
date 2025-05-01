"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "../contexts/ThemeContext"
import "./MonthlyTrend.css"

const MonthlyTrend = ({ data, isLoading }) => {
  const { isDarkTheme } = useTheme()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="monthly-trend-loading">
        <div className="skeleton-bars"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="no-data-message">
        <p>No monthly data to display.</p>
      </div>
    )
  }

  return (
    <div className="monthly-trend">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
          />
          <XAxis dataKey="month" stroke={isDarkTheme ? "#b0bec5" : "#37474f"} />
          <YAxis tickFormatter={(value) => `₹${value}`} stroke={isDarkTheme ? "#b0bec5" : "#37474f"} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" fill="#1e88e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTrend
