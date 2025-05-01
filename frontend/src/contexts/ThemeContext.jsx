"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Check if theme preference is saved in localStorage
    const savedTheme = localStorage.getItem("theme")
    return savedTheme === "dark"
  })

  useEffect(() => {
    // Apply theme to document body
    if (isDarkTheme) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light")
  }, [isDarkTheme])

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev)
  }

  return <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}
