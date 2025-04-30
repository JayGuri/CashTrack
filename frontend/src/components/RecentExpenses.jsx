import "./RecentExpenses.css"

const RecentExpenses = ({ expenses, categories, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.icon : "💰"
  }

  if (isLoading) {
    return (
      <div className="recent-expenses-loading">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="expense-item-skeleton" key={i}>
            <div className="skeleton-circle"></div>
            <div className="skeleton-lines">
              <div className="skeleton-line-1"></div>
              <div className="skeleton-line-2"></div>
            </div>
            <div className="skeleton-amount"></div>
          </div>
        ))}
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="no-expenses-message">
        <p>No recent expenses to show.</p>
      </div>
    )
  }

  return (
    <div className="recent-expenses-list">
      {expenses.map((expense) => (
        <div className="recent-expense-item" key={expense._id}>
          <div
            className="expense-icon"
            style={{ backgroundColor: categories.find((cat) => cat.id === expense.category)?.color || "#ccc" }}
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
        </div>
      ))}
    </div>
  )
}

export default RecentExpenses
