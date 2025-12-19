import express from "express"
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from "../controllers/productController.js"
import { auth, isSeller } from "../middlewares/auth.js"
import { validate } from "../validators/productValidator.js"
import { productSchema, productUpdateSchema } from "../validators/productValidator.js"

const router = express.Router()

// Public routes
router.get("/", getProducts) // GET /api/products - Get all active products with filters
router.get("/:id", getProductById) // GET /api/products/:id - Get single product

// Protected routes (require authentication + seller role)
router.get("/my/products", auth, isSeller, getMyProducts) // moved before :id route to avoid conflict
router.post("/", auth, isSeller, validate(productSchema), createProduct) // POST /api/products - Create product (seller only)
router.patch("/:id", auth, isSeller, validate(productUpdateSchema), updateProduct) // PATCH /api/products/:id - Update product
router.delete("/:id", auth, isSeller, deleteProduct) // DELETE /api/products/:id - Delete product

export default router
