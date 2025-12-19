"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Bienvenu sur SRAQommerce</h1>
        <p className="text-xl text-gray-600 mb-8">Pour votre sante, acheter 5 hoddies et pendules par jour</p>
        {isAuthenticated ? (
          <p className="text-lg text-gray-700">
            Ravie de vous revoir, <span className="font-semibold text-primary">{user?.username}</span>!
          </p>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
              Get Started
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Voir Produits
            </Link>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🛍️</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Selection Importante</h3>
          <p className="text-gray-600">Allez a l'encontre de merveilleux produits publies par nos commercants de confiance</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Boutique Securise</h3>
          <p className="text-gray-600">Visitez en toute tranquilite avec notre securite de qualite</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">💼</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Rejoignez le commerce</h3>
          <p className="text-gray-600">Commencez a vendre vos produits ici et maintenant</p>
        </div>
      </div>
    </div>
  )
}
