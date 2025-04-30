"use client"

import { useState } from "react"
import { FaChevronLeft, FaChevronRight, FaTrash, FaEdit } from "react-icons/fa"
import "./ExpenseCalendar.css"

const ExpenseCalendar = ({ expenses, categories, onEditExpense, onDeleteExpense }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.icon : "💰"
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.color : "#ccc"
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const renderCalendarHeader = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    return (
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>
          <FaChevronLeft />
        </button>
        <h3>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button className="calendar-nav-btn" onClick={nextMonth}>
          <FaChevronRight />
        </button>
      </div>
    )
  }

  const renderCalendarDays = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
      <div className="calendar-days">
        {dayNames.map((day) => (
          <div className="calendar-day-name" key={day}>
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCalendarCells = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const cells = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div className="calendar-cell empty" key={`empty-${i}`}></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split("T")[0]

      // Get expenses for this day
      const dayExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getFullYear() === year && expenseDate.getMonth() === month && expenseDate.getDate() === day
      })

      // Calculate total for the day
      const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      cells.push(
        <div className={`calendar-cell ${dayExpenses.length > 0 ? "has-expenses" : ""}`} key={day}>
          <div className="cell-date">{day}</div>
          {dayExpenses.length > 0 && (
            <div className="cell-content">
              <div className="day-total">{formatCurrency(dayTotal)}</div>
              <div className="day-expenses">
                {dayExpenses.map((expense) => (
                  <div className="day-expense-item" key={expense._id}>
                    <div className="expense-icon" style={{ backgroundColor: getCategoryColor(expense.category) }}>
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="expense-details">
                      <div className="expense-description">{expense.description}</div>
                      <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                    </div>
                    <div className="expense-actions">
                      <button className="expense-edit-btn" onClick={() => onEditExpense(expense)}>
                        <FaEdit />
                      </button>
                      <button className="expense-delete-btn" onClick={() => onDeleteExpense(expense._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>,
      )
    }

    return <div className="calendar-grid">{cells}</div>
  }

  return (
    <div className="expense-calendar">
      {renderCalendarHeader()}
      {renderCalendarDays()}
      {renderCalendarCells()}
    </div>
  )
}

export default ExpenseCalendar
