'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Lock, Eye, EyeOff, Star } from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import type { User as UserType, RegisterForm, LoginForm } from '@/types'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('sx_current_user')
    if (currentUser) {
      router.push('/dashboard')
    }
  }, [router])

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    if (!registerForm.acceptTerms) {
      setError('Você deve aceitar os termos e condições')
      setLoading(false)
      return
    }

    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('sx_users') || '[]')
      const userExists = existingUsers.find((u: UserType) => u.email === registerForm.email)
      
      if (userExists) {
        setError('Email já cadastrado')
        setLoading(false)
        return
      }

      // Create new user
      const newUser: UserType = {
        id: Math.random().toString(36),
        email: registerForm.email,
        name: registerForm.name,
        phone: registerForm.phone,
        points: 100, // Welcome bonus
        level: 'Bronze',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save user
      existingUsers.push(newUser)
      localStorage.setItem('sx_users', JSON.stringify(existingUsers))
      localStorage.setItem('sx_current_user', JSON.stringify(newUser))

      // Add welcome points transaction
      const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
      transactions.push({
        id: Math.random().toString(36),
        userId: newUser.id,
        points: 100,
        reason: 'registration',
        description: 'Bônus de boas-vindas - Registro no Ponto X',
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('sx_points_transactions', JSON.stringify(transactions))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simple mock authentication
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      const user = users.find((u: UserType) => u.email === loginForm.email)
      
      if (!user) {
        setError('Email não encontrado')
        setLoading(false)
        return
      }

      // Save current user
      localStorage.setItem('sx_current_user', JSON.stringify(user))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Entrar no' : 'Cadastre-se no'} Ponto X
          </h1>
          <p className="text-gray-600 text-sm">
            {isLogin 
              ? 'Acesse sua conta e continue acumulando pontos' 
              : 'Crie sua conta e ganhe 100 pontos de bônus!'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Lembrar de mim
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="João Silva"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  required
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite novamente sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={registerForm.acceptTerms}
                onChange={(e) => setRegisterForm({ ...registerForm, acceptTerms: e.target.checked })}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                Eu aceito os{' '}
                <a href="#" className="text-green-600 hover:text-green-700 underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-green-600 hover:text-green-700 underline">
                  Política de Privacidade
                </a>
              </label>
            </div>

            {/* Points bonus highlight */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-semibold">Ganhe 100 pontos de bônus!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Ao se cadastrar você ganha 100 pontos no Ponto X e já inicia no nível Bronze.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        )}

        {/* Toggle between login/register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Voltar ao início
          </button>
        </div>
      </div>
    </div>
  )
}