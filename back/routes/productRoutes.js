import express from "express"
import { auth, isSeller } from "../middlewares/auth.js"
import { validate, productSchema, productUpdateSchema } from "../validators/productValidator.js"
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
} from "../controllers/productController.js"

const router = express.Router()

// --- Routes publiques ---

// GET /api/products - liste des produits
router.get("/", getProducts)

// GET /api/products/:id - detail d'un produit
router.get("/:id", getProductById)

// --- Routes protegees (il faut etre connecte et vendeur) ---

// GET /api/products/my/products - mes produits
// important: cette route doit etre avant /:id sinon "my" sera pris comme un id
router.get("/my/products", auth, isSeller, getMyProducts)

// POST /api/products - creer un produit
router.post("/", auth, isSeller, validate(productSchema), createProduct)

// PATCH /api/products/:id - modifier un produit
router.patch("/:id", auth, isSeller, validate(productUpdateSchema), updateProduct)

// DELETE /api/products/:id - supprimer un produit
router.delete("/:id", auth, isSeller, deleteProduct)

export default router