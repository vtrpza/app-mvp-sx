'use client'

import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-blue-600" size={48} />
          </div>
          
          <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Página não encontrada
          </h1>
          
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida para outro local.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-3 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Home size={20} />
            Ir para Início
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Voltar à Página Anterior
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Páginas populares:
          </p>
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="block text-sm text-primary hover:text-primary-600 transition-colors"
            >
              Dashboard do Usuário
            </Link>
            <Link
              href="/admin/login"
              className="block text-sm text-primary hover:text-primary-600 transition-colors"
            >
              Painel Administrativo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}