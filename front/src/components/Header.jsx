"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const { user, logout, isAuthenticated, isSeller, isCusto } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Accueil */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">SRAQcueil</span>
          </Link>
          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary transition">
              Produits
            </Link>

            {isAuthenticated ? (
              <>
                {isSeller && (
                  <Link to="/my-products" className="text-gray-700 hover:text-primary transition">
                    Mes Produits
                  </Link>
                )}{isCusto && (
                  <Link to="/my-orders" className="text-gray-700 hover:text-primary transition">
                    Mes Commandes
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-primary transition">
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
