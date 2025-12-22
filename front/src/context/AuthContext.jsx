"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  // Check token expiration
  const isTokenExpired = (token) => {
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token")

      if (!savedToken || isTokenExpired(savedToken)) {
        logout()
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.getMe()
        setUser(response.data.user)
        setToken(savedToken)
      } catch (error) {
        console.error("Failed to load user:", error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Auto logout on token expiration
  useEffect(() => {
    if (!token || isTokenExpired(token)) return

    const payload = JSON.parse(atob(token.split(".")[1]))
    const expiresIn = payload.exp * 1000 - Date.now()

    const timer = setTimeout(() => {
      logout()
      alert("Your session has expired. Please login again.")
    }, expiresIn)

    return () => clearTimeout(timer)
  }, [token])

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password })
    const { token, user } = response.data

    localStorage.setItem("token", token)
    setToken(token)
    setUser(user)

    return response.data
  }

  const register = async (email, username, password, role) => {
    const response = await authAPI.register({ email, username, password, role })
    const { token, user } = response.data

    localStorage.setItem("token", token)
    setToken(token)
    setUser(user)

    return response.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isSeller: user?.role === "seller",
    isCusto: user?.role === "customer",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
