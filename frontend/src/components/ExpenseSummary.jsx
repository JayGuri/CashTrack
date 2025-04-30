import { FaRupeeSign } from "react-icons/fa"
import "./ExpenseSummary.css"

const ExpenseSummary = ({ totalExpenses, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <div className="expense-summary">
      <div className="summary-card">
        <div className="summary-icon">
          <FaRupeeSign />
        </div>
        <div className="summary-content">
          <h3>Total Expenses</h3>
          <div className="summary-amount">
            {isLoading ? <div className="skeleton-loader"></div> : formatCurrency(totalExpenses)}
          </div>
          <p className="summary-period">This Month</p>
        </div>
      </div>
    </div>
  )
}

export default ExpenseSummary
