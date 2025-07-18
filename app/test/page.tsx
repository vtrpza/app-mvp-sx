export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Tailwind CSS v4 Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Custom Colors Test
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-primary text-white p-4 rounded text-center">
              Primary
            </div>
            <div className="bg-secondary text-white p-4 rounded text-center">
              Secondary
            </div>
            <div className="bg-accent text-gray-800 p-4 rounded text-center">
              Accent
            </div>
          </div>
          
          <div className="flex gap-4 mb-4">
            <button className="btn-primary">
              Primary Button
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
            <button className="btn-outline">
              Outline Button
            </button>
          </div>
          
          <div className="gradient-bg text-white p-4 rounded mb-4">
            <h3 className="text-lg font-semibold">Gradient Background</h3>
            <p>This should have a gradient from primary to secondary colors.</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Card Component</h3>
            <p className="text-gray-600">
              This is a card with custom styling. It should have a white background,
              rounded corners, and a shadow.
            </p>
          </div>
        </div>
        
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h3 className="text-primary-800 font-semibold mb-2">Color Variants</h3>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">Primary 100</span>
            <span className="bg-primary-200 text-primary-800 px-2 py-1 rounded text-sm">Primary 200</span>
            <span className="bg-primary-300 text-primary-800 px-2 py-1 rounded text-sm">Primary 300</span>
            <span className="bg-primary-400 text-white px-2 py-1 rounded text-sm">Primary 400</span>
            <span className="bg-primary-500 text-white px-2 py-1 rounded text-sm">Primary 500</span>
            <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm">Primary 600</span>
          </div>
        </div>
      </div>
    </div>
  )
}