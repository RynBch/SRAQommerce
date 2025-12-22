import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    const user = await User.findById(decoded.userId).select("-passwordHash")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid.",
      })
    }


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
    if (!req.user) {
        return res.status(401).json({ 
            message: 'Vous devez etre connecte' 
        });
    }
    
    if (req.user.role !== 'customer') {
        return res.status(403).json({ 
            message: 'Acces refuse. Seuls les clients peuvent faire ca.' 
        });
    }

    next();
};