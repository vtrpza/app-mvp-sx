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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Como deseja prosseguir?</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Vehicle Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">
                {vehicle.type === 'bike' ? '🚴' : 
                 vehicle.type === 'scooter' ? '🛴' : 
                 vehicle.type === 'jetski' ? '🏄' : 
                 vehicle.type === 'boat' ? '⛵' : '🚗'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
              <p className="text-gray-600 text-sm">{vehicle.location}</p>
              <p className="text-primary font-bold">R$ {vehicle.price}/hora</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {/* Register Option */}
          <div className="border-2 border-primary rounded-xl p-6 bg-primary/5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Cadastrar e Ganhar Pontos</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Faça seu cadastro rápido e entre no programa de fidelidade Ponto X
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Gift size={16} className="text-primary" />
                <span>100 pontos de boas-vindas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Zap size={16} className="text-primary" />
                <span>Pontos a cada check-in em pontos turísticos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users size={16} className="text-primary" />
                <span>Sistema de níveis e recompensas</span>
              </div>
            </div>

            <button
              onClick={() => {
                onRegisterChoice()
                onClose()
              }}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Cadastrar e Ganhar Pontos
            </button>
          </div>

          {/* WhatsApp Option */}
          <div className="border rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Contato Direto</h3>
                <p className="text-gray-600 text-sm">
                  Prefere falar diretamente conosco? Vá direto ao WhatsApp
                </p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppRedirect}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Ir para WhatsApp
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            O cadastro é gratuito e você pode cancelar a qualquer momento
          </p>
        </div>
      </div>
    </div>
  )
}