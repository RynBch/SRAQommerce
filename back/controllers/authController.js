import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" })
}

// Register new user
export const register = async (req, res, next) => {
  try {
    const { email, username, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      email,
      username,
      passwordHash,
      role: role || "customer",
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get current user profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash")

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}
