'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-xl shadow-xl p-8 text-center border border-red-200">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-600" size={48} />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Erro Crítico do Sistema
              </h1>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Ocorreu um erro crítico na aplicação. Este tipo de erro é raro 
                e nossa equipe de desenvolvimento foi notificada automaticamente. 
                Estamos investigando e corrigindo o problema.
              </p>

              <div className="space-y-4 mb-8">
                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-3 bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
                >
                  <RefreshCw size={22} />
                  Reinicializar Aplicação
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Recarregar Página Completa
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-800 mb-2">
                  Se o problema persistir:
                </h3>
                <div className="text-sm text-red-700 space-y-2">
                  <p>• Aguarde alguns minutos e tente novamente</p>
                  <p>• Limpe o cache do seu navegador</p>
                  <p>• Entre em contato: <strong>suporte@sxlocacoes.com.br</strong></p>
                </div>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-red-600 hover:text-red-700 font-medium">
                    🚨 Debug Info (Development)
                  </summary>
                  <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs font-mono text-red-800 mb-2">
                      <strong>Message:</strong> {error.message}
                    </div>
                    {error.digest && (
                      <div className="text-xs font-mono text-red-700 mb-2">
                        <strong>Digest:</strong> {error.digest}
                      </div>
                    )}
                    <div className="text-xs font-mono text-red-700 overflow-auto max-h-40">
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap mt-1 bg-white p-2 rounded border">
                        {error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}