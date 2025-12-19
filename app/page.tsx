"use client"

import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    // Redirect to the actual React app documentation
    window.location.href = "/README.md"
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">MERN E-commerce Platform</h1>

        <div className="prose max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            This is a full-stack MERN (MongoDB + Express + React + Node.js) e-commerce application.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Backend Setup</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
                  cd server
                  <br />
                  npm install
                  <br /># Create .env file (see server/.env.example)
                  <br />
                  npm run dev
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Frontend Setup</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
                  cd client
                  <br />
                  npm install
                  <br /># Create .env file (see client/.env.example)
                  <br />
                  npm run dev
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Project Structure</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend (Port 5000)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Express + MongoDB</li>
                  <li>JWT Authentication</li>
                  <li>RESTful API</li>
                  <li>Joi Validation</li>
                  <li>Role-based Access</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend (Port 5173)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>React 18 + Vite</li>
                  <li>React Router v6</li>
                  <li>Tailwind CSS</li>
                  <li>Axios + Interceptors</li>
                  <li>Context API</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Features</h3>
            <ul className="list-disc list-inside text-green-800 space-y-1">
              <li>User Authentication (Customer & Seller roles)</li>
              <li>Product CRUD with validation</li>
              <li>Search & filter by tags</li>
              <li>Protected routes</li>
              <li>Auto-logout on token expiration</li>
              <li>Responsive UI</li>
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-gray-700">
              For complete documentation, API endpoints, and setup instructions, please check the{" "}
              <a href="/README.md" className="text-primary hover:underline font-semibold">
                README.md
              </a>{" "}
              file.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
