import mongoose from "mongoose"

// Schema pour les produits de la boutique
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: ""
  },
  // reference vers le vendeur (User)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true })

// index pour la recherche texte
productSchema.index({ name: "text", description: "text" })
productSchema.index({ category: 1 })

const Product = mongoose.model("Product", productSchema)

export default Product