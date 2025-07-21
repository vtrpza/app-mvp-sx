'use client'

import { useState } from 'react'
import { X, Star, Gift, Check, AlertCircle } from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'

interface QuickRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
}

export default function QuickRegisterModal({
  isOpen,
  onClose,
  onSuccess
}: QuickRegisterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'É necessário aceitar os termos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser = await mockDatabase.users.create({
        ...formData,
        points: 100, // Pontos de boas-vindas
        level: 'Bronze',
        createdAt: new Date().toISOString()
      })

      // Salvar no localStorage
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      users.push(newUser)
      localStorage.setItem('sx_users', JSON.stringify(users))
      localStorage.setItem('sx_current_user', JSON.stringify(newUser))

      onSuccess(newUser)
      onClose()
    } catch (error) {
      console.error('Erro no cadastro:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="mobile-modal bg-white overflow-y-auto safe-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b safe-top">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h2 className="mobile-text-lg font-bold text-gray-900">Cadastro Rápido</h2>
              <p className="text-sm text-gray-600">Entre no programa Ponto X</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
            aria-label="Fechar modal"
          >
            <X size={24} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Benefits */}
        <div className="p-4 sm:p-6 bg-primary/5 border-b">
          <h3 className="font-semibold text-gray-900 mb-4 text-center sm:text-left mobile-text-lg">Você vai ganhar:</h3>
          <div className="space-y-3 sm:space-y-2">
            <div className="flex items-center gap-3 sm:gap-2 text-base sm:text-sm justify-center sm:justify-start">
              <Gift className="text-primary" size={20} />
              <span>100 pontos de boas-vindas</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-2 text-base sm:text-sm justify-center sm:justify-start">
              <Star className="text-primary" size={20} />
              <span>Nível Bronze no programa de fidelidade</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-2 text-base sm:text-sm justify-center sm:justify-start">
              <Check className="text-primary" size={20} />
              <span>Pontos a cada check-in e indicação</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-4 pb-8">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-base sm:text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`mobile-input border focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm sm:text-xs mt-2 sm:mt-1 flex items-center gap-2 sm:gap-1">
                <AlertCircle size={16} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-base sm:text-sm font-medium text-gray-700 mb-2">
              WhatsApp *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                phone: formatPhone(e.target.value) 
              }))}
              className={`mobile-input border focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm sm:text-xs mt-2 sm:mt-1 flex items-center gap-2 sm:gap-1">
                <AlertCircle size={16} />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-base sm:text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`mobile-input border focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm sm:text-xs mt-2 sm:mt-1 flex items-center gap-2 sm:gap-1">
                <AlertCircle size={16} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-4 sm:gap-3 touch-target">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                className="mt-1 w-5 h-5 sm:w-4 sm:h-4"
              />
              <span className="text-base sm:text-sm text-gray-700 leading-relaxed">
                Aceito os{' '}
                <a href="#" className="text-primary hover:underline font-medium">
                  termos de uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-primary hover:underline font-medium">
                  política de privacidade
                </a>
                , e desejo participar do programa de fidelidade Ponto X
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm sm:text-xs mt-2 sm:mt-1 flex items-center gap-2 sm:gap-1">
                <AlertCircle size={16} />
                {errors.acceptTerms}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 sm:py-3 rounded-xl sm:rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 sm:gap-2 text-lg sm:text-base touch-target"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                Cadastrando...
              </>
            ) : (
              <>
                <Star size={24} className="sm:w-5 sm:h-5" />
                Cadastrar e Ganhar 100 Pontos
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 text-center">
          <p className="text-sm sm:text-xs text-gray-500">
            Cadastro gratuito • Cancele quando quiser • Seus dados estão seguros
          </p>
        </div>
      </div>
    </div>
  )
}