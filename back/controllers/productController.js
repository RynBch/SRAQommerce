import Product from "../models/Product.js"

// Creer un nouveau produit
export const createProduct = async (req, res, next) => {
  try {
    const data = req.body
    
    // on cree le produit avec les infos du formulaire
    const newProduct = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      tags: data.tags || [],
      image: data.image || "",
      seller: req.user._id
    })
    
    await newProduct.save()
    
    res.status(201).json({
      success: true,
      message: "Produit cree avec succes",
      product: newProduct
    })
  } catch (err) {
    next(err)
  }
}

// Recuperer tous les produits avec filtres
export const getProducts = async (req, res, next) => {
  try {
    const { q, tag, category, page, limit } = req.query
    
    // filtre de recherche
    let filtre = {}
    
    // recherche par nom ou description avec regex
    if (q) {
      filtre.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }
    if (tag) {
      filtre.tags = tag
    }
    if (category) {
      filtre.category = category
    }
    
    // pagination
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const skip = (pageNum - 1) * limitNum
    
    // requete avec populate pour avoir les infos du vendeur
    const products = await Product.find(filtre)
      .populate("seller", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
    
    const total = await Product.countDocuments(filtre)
    
    res.json({
      success: true,
      products: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (err) {
    next(err)
  }
}

// Recuperer un produit par son ID
export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id
    
    const product = await Product.findById(productId)
      .populate("seller", "username email")
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable"
      })
    }
    
    res.json({
      success: true,
      product: product
    })
  } catch (err) {
    next(err)
  }
}

// Modifier un produit
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    
    // on cherche le produit
    const product = await Product.findById(productId)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable"
      })
    }
    
    // verifier que c'est bien le vendeur qui modifie
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas le droit de modifier ce produit"
      })
    }
    
    // mise a jour des champs
    const data = req.body
    
    if (data.name) product.name = data.name
    if (data.description) product.description = data.description
    if (data.price !== undefined) product.price = data.price
    if (data.stock !== undefined) product.stock = data.stock
    if (data.category) product.category = data.category
    if (data.tags) product.tags = data.tags
    if (data.image !== undefined) product.image = data.image
    
    await product.save()
    
    res.json({
      success: true,
      message: "Produit modifie avec succes",
      product: product
    })
  } catch (err) {
    next(err)
  }
}

// Supprimer un produit
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    
    const product = await Product.findById(productId)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable"
      })
    }
    
    // verifier que c'est le bon vendeur
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas le droit de supprimer ce produit"
      })
    }
    
    await product.deleteOne()
    
    res.json({
      success: true,
      message: "Produit supprime"
    })
  } catch (err) {
    next(err)
  }
}

// Recuperer mes produits (vendeur connecte)
export const getMyProducts = async (req, res, next) => {
  try {
    const mesProduits = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
    
    res.json({
      success: true,
      products: mesProduits
    })
  } catch (err) {
    next(err)
  }
}