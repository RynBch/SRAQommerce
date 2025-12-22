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

//  liste des produits
router.get("/", getProducts)

// id - detail d'un produit
router.get("/:id", getProductById)

                     // --- Routes pv ---

//  mes produits

router.get("/my/products", auth, isSeller, getMyProducts)

// creer un produit
router.post("/", auth, isSeller, validate(productSchema), createProduct)

// id - modifier un produit
router.patch("/:id", auth, isSeller, validate(productUpdateSchema), updateProduct)

// id - supprimer un produit
router.delete("/:id", auth, isSeller, deleteProduct)

export default router