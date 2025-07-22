import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="text-white animate-spin" size={32} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Carregando...
        </h2>
        <p className="text-gray-600">
          Preparando sua experiência SX Locações
        </p>
      </div>
    </div>
  )
}