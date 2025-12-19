"use client"

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700 mt-1">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          Veuillez reessayer
        </button>
      )}
    </div>
  )
}
