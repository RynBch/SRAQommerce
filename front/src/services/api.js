import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle errors and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    // Extract error message
    const message =
      error.response?.data?.message || error.response?.data?.errors?.[0] || error.message || "An error occurred"

    return Promise.reject(new Error(message))
  },
)

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
}

// Products API
export const productsAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get("/products/my/products"),
}
export const ordersAPI = {
  getOrdersAll: (params) => api.get("/orders/", { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get(`/orders/my-orders`),
  createOrder: (data) => api.post("/orders/", data),
  updateOrder: (id, data) => api.patch(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`), 
}






export default api
