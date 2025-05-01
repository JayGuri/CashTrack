"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FaChartPie, FaMoneyBillWave, FaSignOutAlt, FaUser, FaTachometerAlt } from "react-icons/fa"
import StarBorder from "./StarBorder"
import ThemeToggle from "./ThemeToggle"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-text">
            Cash<span className="logo-accent">Track</span>
          </span>
        </Link>

        <div className="navbar-menu-toggle" onClick={toggleMenu}>
          <div className={`menu-icon ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/dashboard" className={isActive("/dashboard")}>
              <FaTachometerAlt /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/expenses" className={isActive("/expenses")}>
              <FaMoneyBillWave /> Expenses
            </Link>
          </li>
          <li>
            <Link to="/reports" className={isActive("/reports")}>
              <FaChartPie /> Reports
            </Link>
          </li>
        </ul>

        <div className={`navbar-user ${isMenuOpen ? "active" : ""}`}>
          <ThemeToggle />
          <div className="user-info">
            <FaUser />
            <span>{user?.name || "User"}</span>
          </div>
          <StarBorder as="button" className="logout-btn" color="#1e88e5" speed="5s" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </StarBorder>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
