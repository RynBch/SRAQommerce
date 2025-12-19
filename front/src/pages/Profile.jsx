"use client"

import { useAuth } from "../context/AuthContext"

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Username</label>
            <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Account Type</label>
            <p className="mt-1">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === "seller" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {user?.role === "seller" ? "Seller" : "Customer"}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Member Since</label>
            <p className="mt-1 text-lg text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
