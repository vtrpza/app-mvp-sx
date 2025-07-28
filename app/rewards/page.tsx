'use client'

import { useState, useEffect } from 'react'
import { 
  Star, 
  Gift, 
  Filter, 
  Search, 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock2, 
  Percent, 
  Shield, 
  HeadphonesIcon,
  Trophy,
  TrendingUp,
  History,
  Eye,
  X
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import UserPointsDisplay from '@/components/UserPointsDisplay'
import AuthGuard, { useAuth } from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'
import { useNotificationContext } from '@/components/NotificationProvider'

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  type: string
  category: string
  expiresInDays?: number
  availableUntil?: string
  instructions?: string
}

interface Redemption {
  id: string
  userId: string
  rewardId: string
  rewardName: string
  cost: number
  redeemedAt: string
  status: 'active' | 'used' | 'expired'
  expiresAt?: string
  code?: string
}

function RewardsContent() {
  const { user } = useAuth()
  const router = useRouter()
  const { showReward, showError, showSuccess } = useNotificationContext()
  
  const [userPoints, setUserPoints] = useState(0)
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([])
  const [allRewards, setAllRewards] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('cost-asc')
  const [activeTab, setActiveTab] = useState('available')
  const [showRedeemModal, setShowRedeemModal] = useState<string | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState<Redemption | null>(null)

  useEffect(() => {
    const loadRewardsData = async () => {
      if (!user) return

      try {
        // Load user points
        const userStats = await mockDatabase.gamification.getUserStats(user.id)
        if (userStats) {
          setUserPoints(userStats.user.points)
        }

        // Load available rewards
        const available = await mockDatabase.gamification.getAvailableRewards(user.id)
        setAvailableRewards(available)

        // Load all rewards with extended data
        const allRewardsList: Reward[] = [
          { 
            id: 'discount_5', 
            name: '5% Desconto', 
            description: 'Desconto de 5% em seu próximo aluguel de veículo', 
            cost: 100, 
            type: 'discount', 
            category: 'desconto',
            expiresInDays: 30,
            instructions: 'Apresente este código no momento do aluguel. Válido apenas uma vez.'
          },
          { 
            id: 'discount_10', 
            name: '10% Desconto', 
            description: 'Desconto de 10% em seu próximo aluguel de veículo', 
            cost: 200, 
            type: 'discount', 
            category: 'desconto',
            expiresInDays: 30,
            instructions: 'Apresente este código no momento do aluguel. Válido apenas uma vez.'
          },
          { 
            id: 'discount_15', 
            name: '15% Desconto', 
            description: 'Desconto de 15% em seu próximo aluguel de veículo', 
            cost: 350, 
            type: 'discount', 
            category: 'desconto',
            expiresInDays: 30,
            instructions: 'Apresente este código no momento do aluguel. Válido apenas uma vez.'
          },
          { 
            id: 'free_30min', 
            name: '30min Grátis', 
            description: '30 minutos gratuitos de tempo de aluguel', 
            cost: 150, 
            type: 'time', 
            category: 'tempo',
            expiresInDays: 60,
            instructions: 'Tempo será automaticamente creditado em sua próxima locação.'
          },
          { 
            id: 'free_1hour', 
            name: '1 Hora Grátis', 
            description: '1 hora gratuita de tempo de aluguel', 
            cost: 300, 
            type: 'time', 
            category: 'tempo',
            expiresInDays: 60,
            instructions: 'Tempo será automaticamente creditado em sua próxima locação.'
          },
          { 
            id: 'premium_access', 
            name: 'Acesso Premium', 
            description: 'Acesso a veículos premium por 1 dia', 
            cost: 300, 
            type: 'access', 
            category: 'acesso',
            expiresInDays: 7,
            instructions: 'Acesso liberado por 24 horas a partir da ativação.'
          },
          { 
            id: 'premium_access_week', 
            name: 'Acesso Premium - Semana', 
            description: 'Acesso a veículos premium por 1 semana', 
            cost: 800, 
            type: 'access', 
            category: 'acesso',
            expiresInDays: 14,
            instructions: 'Acesso liberado por 7 dias a partir da ativação.'
          },
          { 
            id: 'vip_support', 
            name: 'Suporte VIP', 
            description: 'Atendimento prioritário por 1 mês', 
            cost: 500, 
            type: 'support', 
            category: 'suporte',
            expiresInDays: 3,
            instructions: 'Entre em contato informando seu código VIP para atendimento prioritário.'
          },
          { 
            id: 'priority_booking', 
            name: 'Reserva Prioritária', 
            description: 'Prioridade na reserva de veículos por 1 mês', 
            cost: 400, 
            type: 'support', 
            category: 'suporte',
            expiresInDays: 3,
            instructions: 'Sua reserva terá prioridade sobre outros usuários do mesmo nível.'
          }
        ]
        setAllRewards(allRewardsList)

        // Load redemption history
        const redemptionHistory = JSON.parse(localStorage.getItem('sx_redemptions') || '[]')
        const userRedemptions = redemptionHistory
          .filter((r: any) => r.userId === user.id)
          .map((r: any) => ({
            ...r,
            status: getRedemptionStatus(r),
            code: r.code || generateRedemptionCode(r.rewardId)
          }))
          .sort((a: any, b: any) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
        setRedemptions(userRedemptions)

      } catch (error) {
        console.error('Error loading rewards data:', error)
        showError('Erro', 'Não foi possível carregar as recompensas')
      } finally {
        setLoading(false)
      }
    }

    loadRewardsData()
  }, [user, showError])

  const getRedemptionStatus = (redemption: any): 'active' | 'used' | 'expired' => {
    const redeemedDate = new Date(redemption.redeemedAt)
    const expiryDate = new Date(redeemedDate.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days default
    
    if (new Date() > expiryDate) {
      return 'expired'
    }
    
    return redemption.status || 'active'
  }

  const generateRedemptionCode = (rewardId: string): string => {
    const prefix = rewardId.toUpperCase().substring(0, 3)
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}${suffix}`
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return Percent
      case 'time': return Clock2
      case 'access': return Shield
      case 'support': return HeadphonesIcon
      default: return Gift
    }
  }

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'discount': return 'text-green-600 bg-green-100 border-green-200'
      case 'time': return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'access': return 'text-purple-600 bg-purple-100 border-purple-200'
      case 'support': return 'text-orange-600 bg-orange-100 border-orange-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Ativo</span>
      case 'used':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Usado</span>
      case 'expired':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Expirado</span>
      default:
        return null
    }
  }

  const handleRedeemReward = async (rewardId: string) => {
    if (!user) return
    
    setShowRedeemModal(null)

    try {
      const result = await mockDatabase.gamification.redeemReward(user.id, rewardId)
      if (result.success && result.redemption) {
        showReward(result.redemption.rewardName, `${result.redemption.cost} pontos utilizados`)
        
        // Reload data
        const userStats = await mockDatabase.gamification.getUserStats(user.id)
        if (userStats) {
          setUserPoints(userStats.user.points)
        }
        const available = await mockDatabase.gamification.getAvailableRewards(user.id)
        setAvailableRewards(available)
        
        // Update redemption history
        const redemptionHistory = JSON.parse(localStorage.getItem('sx_redemptions') || '[]')
        const userRedemptions = redemptionHistory
          .filter((r: any) => r.userId === user.id)
          .map((r: any) => ({
            ...r,
            status: getRedemptionStatus(r),
            code: r.code || generateRedemptionCode(r.rewardId)
          }))
          .sort((a: any, b: any) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
        setRedemptions(userRedemptions)
        
      } else {
        showError('Erro', result.error || 'Não foi possível resgatar a recompensa')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      showError('Erro', 'Ocorreu um erro ao resgatar a recompensa')
    }
  }

  const filteredRewards = allRewards
    .filter(reward => {
      if (activeTab === 'available' && userPoints < reward.cost) return false
      if (activeTab === 'all' && userPoints < reward.cost && selectedCategory !== 'all') return false
      
      const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reward.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'cost-asc': return a.cost - b.cost
        case 'cost-desc': return b.cost - a.cost
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })

  const categories = [
    { id: 'all', name: 'Todas', count: allRewards.length },
    { id: 'desconto', name: 'Descontos', count: allRewards.filter(r => r.category === 'desconto').length },
    { id: 'tempo', name: 'Tempo Grátis', count: allRewards.filter(r => r.category === 'tempo').length },
    { id: 'acesso', name: 'Acesso Premium', count: allRewards.filter(r => r.category === 'acesso').length },
    { id: 'suporte', name: 'Suporte VIP', count: allRewards.filter(r => r.category === 'suporte').length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="text-gray-600" size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Recompensas</h1>
                <p className="text-sm text-gray-600">Resgate recompensas incríveis com seus pontos</p>
              </div>
            </div>
            
            <UserPointsDisplay 
              points={userPoints}
              level={user?.level || 'Bronze'}
              showDetails={true}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Points Summary Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{userPoints.toLocaleString()}</h2>
                <p className="text-primary-100">pontos disponíveis</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{availableRewards.length}</p>
              <p className="text-sm text-primary-100">recompensas disponíveis</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
          {[
            { id: 'available', name: 'Disponíveis', icon: Gift },
            { id: 'all', name: 'Todas', icon: Trophy },
            { id: 'history', name: 'Histórico', icon: History }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Filters and Search */}
        {(activeTab === 'available' || activeTab === 'all') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar recompensas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="lg:w-48">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="cost-asc">Menor preço</option>
                  <option value="cost-desc">Maior preço</option>
                  <option value="name">Nome A-Z</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {(activeTab === 'available' || activeTab === 'all') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.length > 0 ? (
              filteredRewards.map((reward) => {
                const RewardIcon = getRewardIcon(reward.type)
                const colorClass = getRewardColor(reward.type)
                const canAfford = userPoints >= reward.cost
                
                return (
                  <div key={reward.id} className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                    canAfford ? 'border-gray-200 hover:border-primary/30' : 'border-gray-100 opacity-60'
                  }`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${colorClass}`}>
                        <RewardIcon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{reward.name}</h3>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {reward.expiresInDays && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>Expira em {reward.expiresInDays} dias</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-500" size={18} />
                          <span className="text-lg font-bold text-gray-900">{reward.cost}</span>
                          <span className="text-sm text-gray-600">pontos</span>
                        </div>
                        
                        <button
                          onClick={() => setShowRedeemModal(reward.id)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            canAfford
                              ? 'bg-primary text-white hover:bg-primary/90'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Resgatar' : 'Pontos Insuficientes'}
                        </button>
                      </div>
                      
                      {!canAfford && (
                        <div className="text-xs text-gray-500">
                          Faltam {(reward.cost - userPoints).toLocaleString()} pontos
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <Gift size={64} className="text-gray-300 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'Nenhuma recompensa encontrada' : 'Nenhuma recompensa disponível'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Tente ajustar os filtros de busca' : 'Continue ganhando pontos para desbloquear recompensas!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Resgates</h3>
              <p className="text-sm text-gray-600">Suas recompensas resgatadas e seus status</p>
            </div>
            <div className="p-6">
              {redemptions.length > 0 ? (
                <div className="space-y-4">
                  {redemptions.map((redemption) => {
                    const reward = allRewards.find(r => r.id === redemption.rewardId)
                    const RewardIcon = reward ? getRewardIcon(reward.type) : Gift
                    const colorClass = reward ? getRewardColor(reward.type) : 'text-gray-600 bg-gray-100 border-gray-200'
                    
                    return (
                      <div key={redemption.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${colorClass}`}>
                          <RewardIcon size={20} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-gray-900">{redemption.rewardName}</h4>
                            {getStatusBadge(redemption.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{new Date(redemption.redeemedAt).toLocaleDateString('pt-BR')}</span>
                            <span>•</span>
                            <span>{redemption.cost} pontos utilizados</span>
                            {redemption.code && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {redemption.code}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {redemption.status === 'active' && (
                          <button
                            onClick={() => setShowDetailsModal(redemption)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                          >
                            <Eye size={14} />
                            Ver Detalhes
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History size={64} className="text-gray-300 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum resgate realizado</h3>
                  <p className="text-gray-600">Quando você resgatar recompensas, elas aparecerão aqui</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Redemption Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {(() => {
              const reward = allRewards.find(r => r.id === showRedeemModal)
              if (!reward) return null
              
              const RewardIcon = getRewardIcon(reward.type)
              const colorClass = getRewardColor(reward.type)
              const canAfford = userPoints >= reward.cost
              
              return (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 border-2 ${colorClass}`}>
                      <RewardIcon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Resgate</h3>
                    <p className="text-gray-600">Você deseja resgatar esta recompensa?</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-1">{reward.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    
                    {reward.instructions && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Como usar:</p>
                        <p className="text-xs text-gray-600">{reward.instructions}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="font-medium text-gray-900">{reward.cost} pontos</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Seus pontos: {userPoints.toLocaleString()}</p>
                        <p className="text-sm font-medium text-gray-900">
                          Restará: {(userPoints - reward.cost).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {!canAfford && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                      <p className="text-sm text-red-700">
                        Você não possui pontos suficientes para esta recompensa.
                        Faltam {(reward.cost - userPoints).toLocaleString()} pontos.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRedeemModal(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={!canAfford}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {canAfford ? 'Confirmar Resgate' : 'Pontos Insuficientes'}
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Redemption Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {(() => {
              const reward = allRewards.find(r => r.id === showDetailsModal.rewardId)
              if (!reward) return null
              
              const RewardIcon = getRewardIcon(reward.type)
              const colorClass = getRewardColor(reward.type)
              
              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Detalhes da Recompensa</h3>
                    <button
                      onClick={() => setShowDetailsModal(null)}
                      className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 border-2 ${colorClass}`}>
                      <RewardIcon size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{showDetailsModal.rewardName}</h4>
                    {getStatusBadge(showDetailsModal.status)}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Código de Resgate</h5>
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <span className="font-mono text-lg font-bold text-primary">{showDetailsModal.code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(showDetailsModal.code || '')
                            showSuccess('Copiado!', 'Código copiado para a área de transferência')
                          }}
                          className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Informações</h5>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Resgatado em:</span>
                          <span>{new Date(showDetailsModal.redeemedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pontos utilizados:</span>
                          <span>{showDetailsModal.cost}</span>
                        </div>
                      </div>
                    </div>
                    
                    {reward.instructions && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900 mb-2">Como usar</h5>
                        <p className="text-sm text-blue-800">{reward.instructions}</p>
                      </div>
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RewardsPage() {
  return (
    <AuthGuard>
      <RewardsContent />
    </AuthGuard>
  )
}