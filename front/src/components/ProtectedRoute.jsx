"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, requireSeller = false }) {
  const { isAuthenticated, isSeller, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireSeller && !isSeller) {
    return <Navigate to="/" replace />
  }

  return children
}

export function ProtectedRouteCustomer({ children, requireCusto = false }) {
  const { isAuthenticated, isCusto, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireCusto && !isCusto) {
    return <Navigate to="/" replace />
  }

  return children
}


