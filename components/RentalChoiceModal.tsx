'use client'

import { useState } from 'react'
import { X, Star, Gift, MessageCircle, Users, Zap } from 'lucide-react'
import { Vehicle } from '@/types'

interface RentalChoiceModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
  onRegisterChoice: () => void
  onWhatsAppChoice: () => void
}

export default function RentalChoiceModal({
  isOpen,
  onClose,
  vehicle,
  onRegisterChoice,
  onWhatsAppChoice
}: RentalChoiceModalProps) {
  if (!isOpen || !vehicle) return null

  const handleWhatsAppRedirect = () => {
    const message = `Olá! Gostaria de alugar o ${vehicle.name} - ${vehicle.description}. Localização: ${vehicle.location}. Preço: R$ ${vehicle.price}/hora`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    onWhatsAppChoice()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="mobile-modal bg-white overflow-y-auto safe-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b safe-top">
          <h2 className="mobile-text-lg font-bold text-gray-900">Como deseja prosseguir?</h2>
          <button
            onClick={onClose}
            className="p-3 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
            aria-label="Fechar modal"
          >
            <X size={24} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Vehicle Info */}
        <div className="p-4 sm:p-6 border-b bg-gray-50">
          <div className="mobile-flex-col gap-4">
            <div className="w-20 h-20 sm:w-16 sm:h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
              <span className="text-3xl sm:text-2xl">
                {vehicle.category === 'bikes' ? '🚴' : 
                 vehicle.category === 'scooter' ? '🛴' : 
                 vehicle.category === 'jetski' ? '🏄' : 
                 vehicle.category === 'boats' ? '⛵' : '🚗'}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 text-lg sm:text-base">{vehicle.name}</h3>
              <p className="text-gray-600 text-base sm:text-sm mt-1">{vehicle.location}</p>
              <p className="text-primary font-bold text-xl sm:text-base mt-2">R$ {vehicle.price}/hora</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-4 sm:p-6 space-y-4 pb-8">
          {/* Register Option */}
          <div className="mobile-card border-2 border-primary rounded-xl bg-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
              <div className="w-14 h-14 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <Star className="text-white" size={24} />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-gray-900 mb-3 text-lg sm:text-base">Cadastrar e Ganhar Pontos</h3>
                <p className="text-gray-600 text-base sm:text-sm">
                  Faça seu cadastro rápido e entre no programa de fidelidade Ponto X
                </p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-2 mb-6">
              <div className="flex items-center gap-3 sm:gap-2 text-base sm:text-sm text-gray-700 justify-center sm:justify-start">
                <Gift size={20} className="text-primary sm:w-4 sm:h-4" />
                <span>100 pontos de boas-vindas</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-2 text-base sm:text-sm text-gray-700 justify-center sm:justify-start">
                <Zap size={20} className="text-primary sm:w-4 sm:h-4" />
                <span>Pontos a cada check-in em pontos turísticos</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-2 text-base sm:text-sm text-gray-700 justify-center sm:justify-start">
                <Users size={20} className="text-primary sm:w-4 sm:h-4" />
                <span>Sistema de níveis e recompensas</span>
              </div>
            </div>

            <button
              onClick={() => {
                onRegisterChoice()
                onClose()
              }}
              className="w-full bg-primary text-white py-4 sm:py-3 rounded-xl sm:rounded-lg font-semibold hover:bg-primary-600 transition-colors text-lg sm:text-base touch-target"
            >
              Cadastrar e Ganhar Pontos
            </button>
          </div>

          {/* WhatsApp Option */}
          <div className="mobile-card border rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
              <div className="w-14 h-14 sm:w-10 sm:h-10 bg-green-500 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-gray-900 mb-3 text-lg sm:text-base">Contato Direto</h3>
                <p className="text-gray-600 text-base sm:text-sm">
                  Prefere falar diretamente conosco? Vá direto ao WhatsApp
                </p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppRedirect}
              className="w-full bg-green-500 text-white py-4 sm:py-3 rounded-xl sm:rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-3 sm:gap-2 text-lg sm:text-base touch-target"
            >
              <MessageCircle size={24} className="sm:w-5 sm:h-5" />
              Ir para WhatsApp
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 text-center">
          <p className="text-sm sm:text-xs text-gray-500">
            O cadastro é gratuito e você pode cancelar a qualquer momento
          </p>
        </div>
      </div>
    </div>
  )
}