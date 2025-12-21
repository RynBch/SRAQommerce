import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(` MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(" MongoDB Connection Error:", error)
    process.exit(1) // Arrête le serveur si la DB n’est pas accessible
  }
}

export default connectDB
