"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { FaRupeeSign } from "react-icons/fa"
import { useTheme } from "../contexts/ThemeContext"
import "./CategoryDistribution.css"

const CategoryDistribution = ({ data, categories, isLoading }) => {
  const { isDarkTheme } = useTheme()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name.replace(/[🍔🛍️🚗🎬💡💪📚✈️💇🎁🤷]/gu, "").trim() : categoryId
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.color : "#ccc"
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.icon : "💰"
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip">
          <p className="tooltip-category">{getCategoryName(data.category)}</p>
          <p className="tooltip-value">{formatCurrency(data.total)}</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="category-distribution-loading">
        <div className="skeleton-chart"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="no-data-message">
        <p>No category data to display.</p>
      </div>
    )
  }

  return (
    <div className="category-distribution">
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="total"
              nameKey="category"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const RADIAN = Math.PI / 180
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                )
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="category-legend">
        {data.map((entry, index) => (
          <div className="legend-item" key={index}>
            <div className="legend-color" style={{ backgroundColor: getCategoryColor(entry.category) }}>
              {getCategoryIcon(entry.category)}
            </div>
            <div className="legend-label">{getCategoryName(entry.category)}</div>
            <div className="legend-value">
              <FaRupeeSign className="rupee-icon-small" /> {formatCurrency(entry.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryDistribution
