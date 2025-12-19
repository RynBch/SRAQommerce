import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { productsAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

function ProductsList() {
  // states pour stocker les donnees
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [tagFiltre, setTagFiltre] = useState("")

  // charger les produits au demarrage et quand les filtres changent
  useEffect(() => {
    chargerProduits()
  }, [search, tagFiltre])

  // fonction pour recuperer les produits depuis l'API
  async function chargerProduits() {
    setLoading(true)
    setError("")
    
    try {
      // preparer les parametres de recherche
      let params = {}
      if (search !== "") {
        params.q = search
      }
      if (tagFiltre !== "") {
        params.tag = tagFiltre
      }

      const reponse = await productsAPI.getAll(params)
      setProducts(reponse.data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // extraire tous les tags uniques des produits
  let tousLesTags = []
  for (let i = 0; i < products.length; i++) {
    let produit = products[i]
    if (produit.tags) {
      for (let j = 0; j < produit.tags.length; j++) {
        let tag = produit.tags[j]
        if (!tousLesTags.includes(tag)) {
          tousLesTags.push(tag)
        }
      }
    }
  }

  // fonction pour vider les filtres
  function viderFiltres() {
    setSearch("")
    setTagFiltre("")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tous les produits</h1>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher un produit
            </label>
            <input
              type="text"
              placeholder="Rechercher par nom ou description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par tag
            </label>
            <select
              value={tagFiltre}
              onChange={(e) => setTagFiltre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {tousLesTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Afficher les filtres actifs */}
        {(search || tagFiltre) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtres actifs:</span>
            {search && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Recherche: {search}
              </span>
            )}
            {tagFiltre && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Tag: {tagFiltre}
              </span>
            )}
            <button onClick={viderFiltres} className="text-sm text-red-600 hover:text-red-700">
              Effacer
            </button>
          </div>
        )}
      </div>

      {/* Affichage du chargement */}
      {loading && <LoadingSpinner />}

      {/* Affichage des erreurs */}
      {error && <ErrorMessage message={error} onRetry={chargerProduits} />}

      {/* Liste des produits */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-xl text-gray-500">Aucun produit trouve</p>
              {(search || tagFiltre) && (
                <button onClick={viderFiltres} className="mt-4 text-blue-600 hover:underline">
                  Effacer les filtres
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {products.length} produit{products.length > 1 ? "s" : ""} trouve{products.length > 1 ? "s" : ""}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((produit) => (
                  <Link
                    key={produit._id}
                    to={"/products/" + produit._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition"
                  >
                    {/* Image du produit */}
                    {produit.image && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={produit.image} 
                          alt={produit.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {produit.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {produit.description}
                      </p>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          {produit.price.toFixed(2)} €
                        </span>
                        <span className={produit.stock > 0 ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
                          {produit.stock > 0 ? produit.stock + " en stock" : "Rupture"}
                        </span>
                      </div>

                      {/* Afficher les tags */}
                      {produit.tags && produit.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {produit.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {produit.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                              +{produit.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsList