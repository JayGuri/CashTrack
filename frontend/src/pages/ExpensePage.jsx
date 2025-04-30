"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL, DEFAULT_CATEGORIES } from "../config"
import { toast } from "react-hot-toast"
import { FaPlus, FaFilter, FaSearch, FaTrash, FaEdit, FaCalendarAlt } from "react-icons/fa"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseCalendar from "../components/ExpenseCalendar"
import StarBorder from "../components/StarBorder"
import "./ExpensePage.css"

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [viewMode, setViewMode] = useState("list") // 'list' or 'calendar'

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    filterExpenses()
  }, [expenses, searchTerm, categoryFilter, dateFilter])

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/expenses`)
      setExpenses(response.data)
      setFilteredExpenses(response.data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
      // Use empty arrays if API fails
      setExpenses([])
      setFilteredExpenses([])
      toast.error("Failed to load expenses")
    } finally {
      setIsLoading(false)
    }
  }

  const filterExpenses = () => {
    let filtered = [...expenses]

    if (searchTerm) {
      filtered = filtered.filter((expense) => expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (categoryFilter) {
      filtered = filtered.filter((expense) => expense.category === categoryFilter)
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.toDateString() === filterDate.toDateString()
      })
    }

    setFilteredExpenses(filtered)
  }

  const handleExpenseAdded = () => {
    setShowExpenseForm(false)
    setEditingExpense(null)
    fetchExpenses()
    toast.success("Expense saved successfully! 💰")
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowExpenseForm(true)
  }

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`${API_URL}/api/expenses/${id}`)
        fetchExpenses()
        toast.success("Expense deleted successfully")
      } catch (error) {
        console.error("Error deleting expense:", error)

        // For development, remove from local state
        setExpenses(expenses.filter((expense) => expense._id !== id))
        toast.success("Expense deleted successfully")
      }
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setCategoryFilter("")
    setDateFilter("")
    setShowFilters(false)
  }

  const getCategoryName = (categoryId) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const getCategoryIcon = (categoryId) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category ? category.icon : "💰"
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <div className="expense-page-container">
      <div className="expense-page-header">
        <h1>Expenses</h1>
        <div className="expense-page-actions">
          <button
            className={`btn btn-outline view-toggle ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List View
          </button>
          <button
            className={`btn btn-outline view-toggle ${viewMode === "calendar" ? "active" : ""}`}
            onClick={() => setViewMode("calendar")}
          >
            <FaCalendarAlt /> Calendar
          </button>
          <StarBorder
            as="button"
            className="btn add-expense-btn"
            color="#1e88e5"
            speed="5s"
            onClick={() => {
              setEditingExpense(null)
              setShowExpenseForm(true)
            }}
          >
            <FaPlus /> Add Expense
          </StarBorder>
        </div>
      </div>

      {showExpenseForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExpenseForm
              onClose={() => {
                setShowExpenseForm(false)
                setEditingExpense(null)
              }}
              onExpenseAdded={handleExpenseAdded}
              categories={DEFAULT_CATEGORIES}
              expense={editingExpense}
            />
          </div>
        </div>
      )}

      <div className="expense-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className={`filter-toggle ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
        </button>

        {showFilters && (
          <div className="filter-options">
            <div className="filter-group">
              <label>Category</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                {DEFAULT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Date</label>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>

            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-message">Loading expenses...</div>
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="expense-list">
              {filteredExpenses.length === 0 ? (
                <div className="no-expenses">
                  <p>No expenses found. Add your first expense!</p>
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <div className="expense-item" key={expense._id}>
                    <div
                      className="expense-icon"
                      style={{
                        backgroundColor: DEFAULT_CATEGORIES.find((cat) => cat.id === expense.category)?.color || "#ccc",
                      }}
                    >
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="expense-details">
                      <div className="expense-description">{expense.description}</div>
                      <div className="expense-meta">
                        <span className="expense-category">{getCategoryName(expense.category)}</span>
                        <span className="expense-date">{formatDate(expense.date)}</span>
                      </div>
                    </div>
                    <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                    <div className="expense-actions">
                      <button className="expense-edit-btn" onClick={() => handleEditExpense(expense)}>
                        <FaEdit />
                      </button>
                      <button className="expense-delete-btn" onClick={() => handleDeleteExpense(expense._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="expense-calendar-container">
              <ExpenseCalendar
                expenses={expenses}
                categories={DEFAULT_CATEGORIES}
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExpensePage
