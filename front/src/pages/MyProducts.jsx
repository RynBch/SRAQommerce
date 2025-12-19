import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { productsAPI } from "../services/api"

function MyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // charger mes produits au demarrage
  useEffect(() => {
    chargerMesProduits()
  }, [])

  async function chargerMesProduits() {
    setLoading(true)
    setError("")

    try {
      const reponse = await productsAPI.getMyProducts()
      setProducts(reponse.data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tete */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes produits</h1>
        <Link 
          to="/products/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Si aucun produit */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-500 mb-4">
            Vous n'avez pas encore cree de produit
          </p>
          <Link to="/products/new" className="text-blue-600 hover:underline">
            Creer votre premier produit
          </Link>
        </div>
      ) : (
        // Grille des produits
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((produit) => (
            <div key={produit._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              {/* Image */}
              {produit.image && (
                <div className="h-40 overflow-hidden rounded-t-lg">
                  <img 
                    src={produit.image} 
                    alt={produit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Nom et statut stock */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{produit.name}</h3>
                  <span className={
                    produit.stock > 0 
                      ? "px-2 py-1 text-xs rounded bg-green-100 text-green-800"
                      : "px-2 py-1 text-xs rounded bg-red-100 text-red-800"
                  }>
                    {produit.stock > 0 ? "En stock" : "Rupture"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {produit.description}
                </p>

                {/* Prix et stock */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-blue-600">
                    {produit.price.toFixed(2)} €
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {produit.stock}
                  </span>
                </div>

                {/* Boutons */}
                <div className="flex gap-2">
                  <Link
                    to={"/products/" + produit._id}
                    className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  >
                    Voir
                  </Link>
                  <Link
                    to={"/products/" + produit._id + "/edit"}
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProducts