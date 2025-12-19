"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { productsAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await productsAPI.getById(id)
      setProduct(response.data.product)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setDeleting(true)
    try {
      await productsAPI.delete(id)
      alert("Product deleted successfully")
      navigate("/my-products")
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const isOwner = user && product && product.owner._id === user.id

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/products" className="text-primary hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500">
              Sold by <span className="font-medium">{product.owner.username}</span>
            </p>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Link
                to={`/products/${product._id}/edit`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Availability</h2>
          <p className="text-gray-700">
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </p>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
          <p>Last updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
