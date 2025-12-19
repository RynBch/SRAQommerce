import Product from "../models/Product.js"

/**
 * Create new product (seller only)
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, tags, image } = req.body

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      tags: tags || [],
      image,
      seller: req.user._id,
    })

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all products (public)
 * GET /api/products?q=&tag=&page=&limit=
 */
export const getProducts = async (req, res, next) => {
  try {
    const { q, tag, page = 1, limit = 10 } = req.query

    const query = {}

    if (q) {
      query.$text = { $search: q }
    }

    if (tag) {
      query.tags = tag
    }

    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skip = (pageNumber - 1) * limitNumber

    const products = await Product.find(query)
      .populate("seller", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get single product by ID (public)
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "username email")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      product,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update product (seller only)
 * PATCH /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      })
    }

    // Update allowed fields
    const { name, description, price, stock, category, tags, image } = req.body

    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (stock !== undefined) product.stock = stock
    if (category !== undefined) product.category = category
    if (tags !== undefined) product.tags = tags
    if (image !== undefined) product.image = image

    await product.save()

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete product (seller only)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      })
    }

    await product.deleteOne()

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get products of current seller
 * GET /api/products/my/products
 */
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      products,
    })
  } catch (error) {
    next(error)
  }
}
