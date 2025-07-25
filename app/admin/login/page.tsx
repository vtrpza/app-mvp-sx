'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple authentication for MVP
    if (credentials.username === 'admin' && credentials.password === 'sx2024admin') {
      // Set admin session
      localStorage.setItem('sx_admin_session', JSON.stringify({
        authenticated: true,
        user: 'admin',
        loginTime: new Date().toISOString()
      }))
      
      router.push('/admin/dashboard')
    } else {
      setError('Credenciais inválidas. Tente admin / sx2024admin')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-100 mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">SX Locadora - Painel Administrativo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="admin"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-3 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary btn-ripple hover-glow py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Entrando...
              </>
            ) : (
              <>
                <Shield size={20} />
                Entrar no Admin
              </>
            )}
          </button>
        </form>

        {/* Dev Info */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-500 text-center">
            <strong>Credenciais de Desenvolvimento:</strong><br />
            Usuário: admin<br />
            Senha: sx2024admin
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            Sistema SX Locadora v1.0 - MVP
          </p>
        </div>
      </div>
    </div>
  )
}