import express from "express"
import { register, login, getMe } from "../controllers/authController.js"
import { validate } from "../validators/authValidator.js"
import { registerSchema, loginSchema } from "../validators/authValidator.js"
import { auth } from "../middlewares/auth.js"

const router = express.Router()

// POST /api/auth/register - Register new user
router.post("/register", validate(registerSchema), register)

// POST /api/auth/login - Login user
router.post("/login", validate(loginSchema), login)

// GET /api/auth/me - Get current user (protected)
router.get("/me", auth, getMe)

export default router
