'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error)
    } else {
      // In production, you might want to log to an error reporting service
      console.error('Error occurred:', error.message)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-600" size={40} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Algo deu errado
          </h1>
          
          <p className="text-gray-600 mb-8">
            Encontramos um problema inesperado. Nossa equipe foi notificada 
            automaticamente e estamos trabalhando para resolver isso o mais 
            rápido possível.
          </p>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <RefreshCw size={20} />
              Tentar Novamente
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Home size={20} />
              Voltar ao Início
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Se o problema persistir, entre em contato conosco:
            </p>
            <p className="text-sm font-medium text-primary mt-1">
              suporte@sxlocacoes.com.br
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                🔧 Detalhes Técnicos (Dev Mode)
              </summary>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-xs font-mono text-red-600 mb-2">
                  <strong>Error:</strong> {error.message}
                </div>
                {error.digest && (
                  <div className="text-xs font-mono text-gray-600 mb-2">
                    <strong>Digest:</strong> {error.digest}
                  </div>
                )}
                <div className="text-xs font-mono text-gray-600 overflow-auto max-h-40">
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}