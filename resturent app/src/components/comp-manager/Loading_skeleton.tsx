import type React from "react"

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 rounded-lg flex flex-col items-center justify-center p-6 animate-pulse"
          >
            <div className="w-full h-4 bg-gray-300 rounded mb-4"></div>
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoadingSkeleton