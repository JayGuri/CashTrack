"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"
import { toast } from "react-hot-toast"
import { FaTimes, FaRupeeSign } from "react-icons/fa"
import StarBorder from "./StarBorder"
import "./ExpenseForm.css"

const ExpenseForm = ({ onClose, onExpenseAdded, categories, expense = null }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: new Date(expense.date).toISOString().split("T")[0],
      })
    }
  }, [expense])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.amount || !formData.category || !formData.description || !formData.date) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      if (expense) {
        await axios.put(`${API_URL}/api/expenses/${expense._id}`, formData)
      } else {
        await axios.post(`${API_URL}/api/expenses`, formData)
      }

      onExpenseAdded()
    } catch (error) {
      console.error("Error saving expense:", error)
      toast.error("Failed to save expense")

      // For development, simulate success
      setTimeout(() => {
        onExpenseAdded()
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="expense-form-container">
      <div className="expense-form-header">
        <h2>{expense ? "Edit Expense" : "Add New Expense"} <FaRupeeSign /></h2>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount"><FaRupeeSign className="input-icon" /> Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="What did you spend on?"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-actions">
          <StarBorder as="button" type="button" className="btn btn-outline" color="#00897b" speed="5s" onClick={onClose} disabled={isLoading}>
            Cancel
          </StarBorder>
          <StarBorder as="button" type="submit" className="btn btn-primary" color="#1e88e5" speed="5s" disabled={isLoading}>
            {isLoading ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
          </StarBorder>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
