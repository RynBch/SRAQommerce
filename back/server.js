import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import { errorHandler, notFound } from "./middlewares/errorHandler.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get("/", (req, res) => {
  res.json({ message: "MERN E-commerce API is running" })
})

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
