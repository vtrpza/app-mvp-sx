'use client'

import { useState, useEffect } from 'react'
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Mail, 
  MessageSquare, 
  QrCode,
  Trophy,
  Users,
  Gift,
  Star,
  TrendingUp,
  Crown
} from 'lucide-react'
import { useNotificationContext } from '@/components/NotificationProvider'
import { User, ReferralStats, ReferralLeaderboard } from '@/types'
import {
  getReferralStats,
  getReferralLeaderboard,
  getReferredUsers,
  generateWhatsAppShareLink,
  generateSMSShareLink,
  generateEmailShareLink,
  copyReferralCodeToClipboard,
  generateQRCodeDataUrl
} from '@/lib/referral-utils'

export default function ReferralsPage() {
  const notifications = useNotificationContext()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<ReferralLeaderboard[]>([])
  const [referredUsers, setReferredUsers] = useState<User[]>([])
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeUrl, setQRCodeUrl] = useState('')

  useEffect(() => {
    // Get current user
    const user = JSON.parse(localStorage.getItem('sx_current_user') || 'null')
    if (user) {
      setCurrentUser(user)
      
      // Get user's referral statistics
      const stats = getReferralStats(user.id)
      setReferralStats(stats)
      
      // Get referred users
      const referred = getReferredUsers(user.id)
      setReferredUsers(referred)
    }
    
    // Get leaderboard
    const board = getReferralLeaderboard(10)
    setLeaderboard(board)
  }, [])

  const handleCopyCode = async () => {
    if (!currentUser?.referralCode) return
    
    const success = await copyReferralCodeToClipboard(currentUser.referralCode)
    if (success) {
      notifications.showSuccess(
        'Código copiado!',
        'Link de indicação copiado para a área de transferência'
      )
    } else {
      notifications.showError(
        'Erro ao copiar',
        'Não foi possível copiar o código'
      )
    }
  }

  const handleWhatsAppShare = () => {
    if (!currentUser?.referralCode) return
    
    const whatsappUrl = generateWhatsAppShareLink(currentUser.referralCode, currentUser.name)
    window.open(whatsappUrl, '_blank')
  }

  const handleSMSShare = () => {
    if (!currentUser?.referralCode) return
    
    const smsUrl = generateSMSShareLink(currentUser.referralCode)
    window.location.href = smsUrl
  }

  const handleEmailShare = () => {
    if (!currentUser?.referralCode) return
    
    const emailUrl = generateEmailShareLink(currentUser.referralCode, currentUser.name)
    window.location.href = emailUrl
  }

  const handleShowQRCode = () => {
    if (!currentUser?.referralCode) return
    
    const qrUrl = generateQRCodeDataUrl(currentUser.referralCode)
    setQRCodeUrl(qrUrl)
    setShowQRCode(true)
  }

  const getUserRank = (): number => {
    if (!currentUser) return 0
    const userInLeaderboard = leaderboard.find(item => item.userId === currentUser.id)
    return userInLeaderboard?.rank || 0
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar as indicações.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Users className="mx-auto mb-4" size={48} />
            <h1 className="text-3xl font-bold mb-2">Programa de Indicações</h1>
            <p className="text-primary-100">
              Indique amigos e ganhe 200 pontos para cada pessoa que se cadastrar!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Referral Code Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu Código de Indicação</h2>
            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <div className="text-3xl font-mono font-bold text-primary mb-2">
                {currentUser.referralCode}
              </div>
              <p className="text-sm text-gray-600">
                Compartilhe este código com seus amigos
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <MessageCircle className="text-green-600" size={24} />
              <span className="text-sm font-medium text-green-700">WhatsApp</span>
            </button>

            <button
              onClick={handleSMSShare}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <MessageSquare className="text-blue-600" size={24} />
              <span className="text-sm font-medium text-blue-700">SMS</span>
            </button>

            <button
              onClick={handleEmailShare}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Mail className="text-purple-600" size={24} />
              <span className="text-sm font-medium text-purple-700">Email</span>
            </button>

            <button
              onClick={handleShowQRCode}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <QrCode className="text-gray-600" size={24} />
              <span className="text-sm font-medium text-gray-700">QR Code</span>
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <Copy size={20} />
            Copiar Link de Indicação
          </button>
        </div>

        {/* Statistics */}
        {referralStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Users className="text-primary mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold text-gray-900">{referralStats.totalReferred}</div>
              <div className="text-sm text-gray-600">Total Indicados</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <TrendingUp className="text-green-600 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold text-gray-900">{referralStats.successfulReferrals}</div>
              <div className="text-sm text-gray-600">Cadastros Completos</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Star className="text-yellow-500 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold text-gray-900">{referralStats.totalPointsEarned}</div>
              <div className="text-sm text-gray-600">Pontos Ganhos</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Trophy className="text-purple-600 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold text-gray-900">#{getUserRank() || '--'}</div>
              <div className="text-sm text-gray-600">Posição no Ranking</div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Referred Users */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={24} />
              Seus Indicados ({referredUsers.length})
            </h3>
            
            {referredUsers.length > 0 ? (
              <div className="space-y-4">
                {referredUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">
                        Cadastrado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">+200 pontos</div>
                      <div className="text-xs text-gray-500">Indicação</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600 mb-2">Nenhuma indicação ainda</p>
                <p className="text-sm text-gray-500">
                  Compartilhe seu código e comece a ganhar pontos!
                </p>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={24} />
              Ranking de Indicações
            </h3>
            
            {leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((item, index) => (
                  <div 
                    key={item.userId} 
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      item.userId === currentUser.id 
                        ? 'bg-primary-50 border-2 border-primary-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index === 0 ? <Crown size={16} /> : item.rank}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        item.userId === currentUser.id ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {item.name}
                        {item.userId === currentUser.id && ' (Você)'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.referralCount} indicações • {item.pointsEarned} pontos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">Ranking ainda não disponível</p>
              </div>
            )}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Como Funciona</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="text-blue-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Compartilhe</h4>
              <p className="text-sm text-gray-600">
                Envie seu código de indicação para amigos e familiares
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Eles se Cadastram</h4>
              <p className="text-sm text-gray-600">
                Seus amigos usam seu código ao se cadastrar na plataforma
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-purple-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Vocês Ganham</h4>
              <p className="text-sm text-gray-600">
                Você ganha 200 pontos e eles ganham 100 pontos de boas-vindas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">QR Code de Indicação</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code de Indicação" 
                  className="mx-auto w-48 h-48"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Mostre este QR Code para seus amigos escanearem
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button
                  onClick={handleCopyCode}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600"
                >
                  Copiar Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}