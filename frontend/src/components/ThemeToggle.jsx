"use client"

import { FaSun, FaMoon } from "react-icons/fa"
import { useTheme } from "../contexts/ThemeContext"
import "./ThemeToggle.css"

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme()

  return (
    <button
      className={`theme-toggle-btn ${isDarkTheme ? "light-mode-btn" : "dark-mode-btn"}`}
      onClick={toggleTheme}
      aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDarkTheme ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
      <span>{isDarkTheme ? "Light Mode" : "Dark Mode"}</span>
    </button>
  )
}

export default ThemeToggle
