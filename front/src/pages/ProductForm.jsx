import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { productsAPI } from "../services/api"

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // si on a un id, c'est qu'on est en mode edition
  const modeEdition = id ? true : false

  // donnees du formulaire
  const [nom, setNom] = useState("")
  const [description, setDescription] = useState("")
  const [prix, setPrix] = useState("")
  const [stock, setStock] = useState("")
  const [categorie, setCategorie] = useState("")
  const [tags, setTags] = useState("")
  const [image, setImage] = useState("")
  
  // etats
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // charger les donnees du produit si on est en mode edition
  useEffect(() => {
    if (modeEdition) {
      chargerProduit()
    }
  }, [id])

  async function chargerProduit() {
    try {
      const reponse = await productsAPI.getById(id)
      const prod = reponse.data.product
      
      setNom(prod.name)
      setDescription(prod.description)
      setPrix(prod.price.toString())
      setStock(prod.stock.toString())
      setCategorie(prod.category || "")
      setTags(prod.tags ? prod.tags.join(", ") : "")
      setImage(prod.image || "")
    } catch (err) {
      setError(err.message)
    }
  }

  // soumission du formulaire
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // validation simple
    if (nom.trim() === "") {
      setError("Le nom du produit est obligatoire")
      setLoading(false)
      return
    }

    if (parseFloat(prix) <= 0) {
      setError("Le prix doit etre superieur a 0")
      setLoading(false)
      return
    }

    if (parseInt(stock) < 0) {
      setError("Le stock ne peut pas etre negatif")
      setLoading(false)
      return
    }

    if (categorie.trim() === "") {
      setError("La categorie est obligatoire")
      setLoading(false)
      return
    }

    try {
      // preparer les donnees
      let tagsArray = []
      if (tags.trim() !== "") {
        tagsArray = tags.split(",").map(t => t.trim()).filter(t => t !== "")
      }

      const donnees = {
        name: nom,
        description: description,
        price: parseFloat(prix),
        stock: parseInt(stock),
        category: categorie,
        tags: tagsArray,
        image: image
      }

      if (modeEdition) {
        // modifier le produit existant
        await productsAPI.update(id, donnees)
        setSuccess("Produit modifie avec succes!")
        setTimeout(() => {
          navigate("/products/" + id)
        }, 1500)
      } else {
        // creer un nouveau produit
        const reponse = await productsAPI.create(donnees)
        setSuccess("Produit cree avec succes!")
        setTimeout(() => {
          navigate("/products/" + reponse.data.product._id)
        }, 1500)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {modeEdition ? "Modifier le produit" : "Creer un nouveau produit"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Message de succes */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Nom du produit */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit *
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Prix et Stock */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categorie */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categorie *
          </label>
          <input
            type="text"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            required
            placeholder="ex: Electronique, Vetements, Maison..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de l'image
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://exemple.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Apercu de l'image */}
          {image && (
            <div className="mt-2">
              <img 
                src={image} 
                alt="Apercu" 
                className="h-32 object-cover rounded"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (separes par des virgules)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="promo, nouveau, populaire"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Exemple: electronique, smartphone, promo
          </p>
        </div>

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : (modeEdition ? "Modifier" : "Creer")}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm