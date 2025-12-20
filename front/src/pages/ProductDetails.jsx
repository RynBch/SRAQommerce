import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { productsAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"

function ProductDetails() {
  // recuperer l'id depuis l'url
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // states
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [suppression, setSuppression] = useState(false)

  // charger le produit au demarrage
  useEffect(() => {
    chargerProduit()
  }, [id])

  async function chargerProduit() {
    setLoading(true)
    setError("")

    try {
      const reponse = await productsAPI.getById(id)
      setProduct(reponse.data.product)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // fonction pour supprimer le produit
  async function supprimerProduit() {
    // demander confirmation
    if (!window.confirm("Etes-vous sur de vouloir supprimer ce produit ?")) {
      return
    }

    setSuppression(true)
    try {
      await productsAPI.delete(id)
      alert("Produit supprime avec succes")
      navigate("/my-products")
    } catch (err) {
      alert("Erreur: " + err.message)
    } finally {
      setSuppression(false)
    }
  }

  // verifier si l'utilisateur est le proprietaire
  let estProprietaire = false
  if (user && product && product.seller) {
    if (product.seller._id === user.id) {
      estProprietaire = true
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

  // affichage en cas d'erreur
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  // si le produit n'existe pas
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-500">Produit introuvable</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Lien retour */}
      <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Retour aux produits
      </Link>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Image du produit */}
        {product.image && (
          <div className="h-64 md:h-96 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* En-tete avec nom et boutons */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.seller && (
                <p className="text-sm text-gray-500">
                  Vendu par <span className="font-medium">{product.seller.username}</span>
                </p>
              )}
            </div>

            {/* Boutons edit/delete si proprietaire */}
            {estProprietaire && (
              <div className="flex gap-2">
                <Link
                  to={"/products/" + product._id + "/edit"}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Modifier
                </Link>
                <button
                  onClick={supprimerProduit}
                  disabled={suppression}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  {suppression ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            )}
          </div>

          {/* Prix */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-blue-600">
              {product.price.toFixed(2)} €
            </span>
          </div>

          {/* Categorie */}
          {product.category && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Categorie</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {product.category}
              </span>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Disponibilite</h2>
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                {product.stock} en stock
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                Rupture de stock
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-6">
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

          {/* Dates */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Cree le: {new Date(product.createdAt).toLocaleDateString("fr-FR")}</p>
            <p>Modifie le: {new Date(product.updatedAt).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails