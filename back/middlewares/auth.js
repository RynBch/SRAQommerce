import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Middleware to verify JWT token
export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-passwordHash")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid.",
      })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      })
    }
    res.status(401).json({
      success: false,
      message: "Invalid token. Authorization denied.",
    })
  }
}

// Middleware to check if user is a seller
export const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Seller role required.",
    })
  }
  next()
}
export const isClient = (req, res, next) => {
    // On verifie si l'utilisateur est connecte
    if (!req.user) {
        return res.status(401).json({ 
            message: 'Vous devez etre connecte' 
        });
    }
    
    // On verifie si c'est un vendeur
    if (req.user.role !== 'customer') {
        return res.status(403).json({ 
            message: 'Acces refuse. Seuls les clients peuvent faire ca.' 
        });
    }
    
    // Si tout est ok, on continue
    next();
};