import { useState, useEffect } from "react"
import { ordersAPI } from "../services/api"
import { productsAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import { compile } from "ejs"



function MyOrders() {
  // states pour stocker les donnees
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  // charger les commandes au demarrage et quand les filtres changent
  useEffect(() => {
    loadOrders()
  }, [search])

  // fonction pour recuperer les commandes depuis l'API
  async function loadOrders() {
    setLoading(true)
    setError("")
    
    try {
      // preparer les parametres de recherche
      let params = {}
      if (search !== "") {
        params.q = search
      }
      
      const reponse = await ordersAPI.getMyOrders()
      setOrders(reponse.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Toutes les commandes</h1>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher une Commande
            </label>
            <input
              type="text"
              placeholder="Rechercher par nom ou description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Afficher les filtres actifs */}
        {(search) && (
          <div className="mt-4 flex items-center gap-2">
            {search && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Recherche: {search}
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
      {error && <ErrorMessage message={error} onRetry={loadOrders} />}

      {/* Liste des orders */}
      {!loading && !error && (
        <>
          {orders === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-xl text-gray-500">Aucune Commande trouve</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {orders.length} Commande{orders.length > 1 ? "s" : ""} trouvée{orders.length > 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.map((commande) => (
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Voici votre commande du {commande.createdAt}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {commande.status}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        Les produits de la commandes : 
                      </p>
                      
                      {//inserer ici
                      commande.productArray.map((products) => (
                        <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
                        {products}
                        </div>
                      ))
                      }
                      
                      </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default MyOrders