import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import ProtectedRouteCustomer from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import ProductsList from "./pages/ProductsList"
import ProductDetails from "./pages/ProductDetails"
import ProductForm from "./pages/ProductForm"
import MyProducts from "./pages/MyProducts"
import MyOrders from "./pages/MyOrders"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute requireSeller>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute requireSeller>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-products"
              element={
                <ProtectedRoute requireSeller>
                  <MyProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute requireCusto>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
