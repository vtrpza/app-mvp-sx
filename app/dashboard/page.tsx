'use client'

import { useState, useEffect } from 'react'
import { 
  Star, 
  Trophy, 
  TrendingUp, 
  Target, 
  Gift, 
  MapPin, 
  Calendar, 
  Zap,
  Award,
  Users,
  Clock,
  Crown,
  Flame,
  CheckCircle,
  ArrowRight,
  BarChart3,
  LogOut,
  Settings,
  Home,
  Percent,
  Clock2,
  Shield,
  HeadphonesIcon,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import UserPointsDisplay from '@/components/UserPointsDisplay'
import AuthGuard, { useAuth } from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'
import { useNotificationContext } from '@/components/NotificationProvider'

interface UserStats {
  user: {
    id: string
    name: string
    email: string
    points: number
    level: string
    levelInfo: any
    nextLevel: any
    progressToNext: number
  }
  stats: {
    totalTransactions: number
    totalCheckins: number
    achievementsUnlocked: number
    totalAchievements: number
    currentStreak: number
    longestStreak: number
    pointsThisWeek: number
    pointsThisMonth: number
  }
  recent: {
    transactions: any[]
    checkins: any[]
    achievements: any[]
  }
}

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { showReward, showError, showSuccess } = useNotificationContext()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [allRewards, setAllRewards] = useState<any[]>([])
  const [recentRedemptions, setRecentRedemptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showRedeemModal, setShowRedeemModal] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return

      try {
        // Load comprehensive user stats
        const stats = await mockDatabase.gamification.getUserStats(user.id)
        setUserStats(stats)

        // Load leaderboard
        const leaderboardData = await mockDatabase.gamification.getLeaderboard('all', 10)
        setLeaderboard(leaderboardData)

        // Load available achievements
        setAchievements(mockDatabase.gamification.achievements)

        // Load available rewards
        const availableRewards = await mockDatabase.gamification.getAvailableRewards(user.id)
        setRewards(availableRewards)

        // Load all rewards for comparison
        const allRewardsList = [
          { id: 'discount_5', name: '5% Desconto', description: 'Desconto em próximo aluguel', cost: 100, type: 'discount', category: 'desconto' },
          { id: 'discount_10', name: '10% Desconto', description: 'Desconto em próximo aluguel', cost: 200, type: 'discount', category: 'desconto' },
          { id: 'free_30min', name: '30min Grátis', description: 'Tempo livre de aluguel', cost: 150, type: 'time', category: 'tempo' },
          { id: 'premium_access', name: 'Acesso Premium', description: 'Veículos premium por 1 dia', cost: 300, type: 'access', category: 'acesso' },
          { id: 'vip_support', name: 'Suporte VIP', description: 'Atendimento prioritário por 1 mês', cost: 500, type: 'support', category: 'suporte' }
        ]
        setAllRewards(allRewardsList)

        // Load recent redemptions
        const redemptions = JSON.parse(localStorage.getItem('sx_redemptions') || '[]')
        const userRedemptions = redemptions
          .filter((r: any) => r.userId === user.id)
          .sort((a: any, b: any) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
          .slice(0, 3)
        setRecentRedemptions(userRedemptions)

      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user])

  const handleRedeemReward = async (rewardId: string) => {
    if (!user) return
    
    setShowRedeemModal(null)

    try {
      const result = await mockDatabase.gamification.redeemReward(user.id, rewardId)
      if (result.success && result.redemption) {
        showReward(result.redemption.rewardName, result.redemption.cost + ' pontos utilizados')
        
        // Reload dashboard data without full page reload
        const loadDashboard = async () => {
          const stats = await mockDatabase.gamification.getUserStats(user.id)
          setUserStats(stats)
          const availableRewards = await mockDatabase.gamification.getAvailableRewards(user.id)
          setRewards(availableRewards)
          
          // Update recent redemptions
          const redemptions = JSON.parse(localStorage.getItem('sx_redemptions') || '[]')
          const userRedemptions = redemptions
            .filter((r: any) => r.userId === user.id)
            .sort((a: any, b: any) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
            .slice(0, 3)
          setRecentRedemptions(userRedemptions)
        }
        
        await loadDashboard()
      } else {
        showError('Erro', result.error || 'Não foi possível resgatar a recompensa')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      showError('Erro', 'Ocorreu um erro ao resgatar a recompensa')
    }
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
      case 'discount': return 'text-green-600 bg-green-100'
      case 'time': return 'text-blue-600 bg-blue-100'
      case 'access': return 'text-purple-600 bg-purple-100'
      case 'support': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getProgressToReward = (userPoints: number, rewardCost: number) => {
    return Math.min(100, (userPoints / rewardCost) * 100)
  }

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'achievements', name: 'Conquistas', icon: Trophy },
    { id: 'leaderboard', name: 'Ranking', icon: Users },
    { id: 'rewards', name: 'Recompensas', icon: Gift }
  ]

  if (loading || !userStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => router.push('/')}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                <Star className="text-white" size={20} />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Ponto X Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Bem-vindo, {user?.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:block">
                <UserPointsDisplay 
                  points={user?.points || 0}
                  level={user?.level || 'Bronze'}
                  showDetails={true}
                />
              </div>
              
              {/* Mobile Points Display */}
              <div className="sm:hidden">
                <UserPointsDisplay 
                  points={user?.points || 0}
                  level={user?.level || 'Bronze'}
                  showDetails={false}
                />
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Voltar ao início"
                >
                  <Home size={18} className="sm:w-5 sm:h-5" />
                </button>
                
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level Progress Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Crown size={24} className="text-yellow-300 flex-shrink-0 sm:w-8 sm:h-8" />
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold">Nível {userStats.user.level}</h2>
                <p className="text-primary-100 text-sm sm:text-base">
                  {userStats.user.nextLevel 
                    ? `${userStats.user.nextLevel.min - userStats.user.points} pontos para ${userStats.user.nextLevel.name}`
                    : 'Nível máximo alcançado!'
                  }
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="text-2xl sm:text-3xl font-bold">{userStats.user.points.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-primary-100">pontos totais</div>
            </div>
          </div>
          
          {userStats.user.nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{userStats.user.levelInfo.name}</span>
                <span>{userStats.user.nextLevel.name}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${Math.max(5, userStats.user.progressToNext)}%` }}
                />
              </div>
              <div className="text-right text-sm">
                {Math.round(userStats.user.progressToNext)}% completo
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden xs:inline sm:inline">{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Flame className="text-orange-500 flex-shrink-0" size={18} />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.stats.currentStreak}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Sequência Atual</div>
                </div>
                
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <MapPin className="text-blue-500 flex-shrink-0" size={18} />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.stats.totalCheckins}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Check-ins</div>
                </div>
                
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Trophy className="text-yellow-500 flex-shrink-0" size={18} />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.stats.achievementsUnlocked}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Conquistas</div>
                </div>
                
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <TrendingUp className="text-green-500 flex-shrink-0" size={18} />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{userStats.stats.pointsThisWeek}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Esta Semana</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
                </div>
                <div className="p-6">
                  {userStats.recent.transactions.length > 0 ? (
                    <div className="space-y-3">
                      {userStats.recent.transactions.map((transaction, index) => (
                        <div key={transaction.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {transaction.reason === 'check-in' && <MapPin size={16} className="text-primary" />}
                              {transaction.reason === 'achievement' && <Trophy size={16} className="text-yellow-500" />}
                              {transaction.reason === 'streak' && <Flame size={16} className="text-orange-500" />}
                              {transaction.reason === 'referral' && <Users size={16} className="text-blue-500" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{transaction.description}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(transaction.timestamp).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <span>+{transaction.points}</span>
                            <Star size={14} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Target size={48} className="text-gray-300 mb-3" />
                      <p>Nenhuma atividade recente</p>
                      <p className="text-sm">Comece a usar o sistema para ver suas atividades aqui!</p>
                    </div>
                  )}
                  
                  {/* View All History Link */}
                  {userStats.recent.transactions.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <button
                        onClick={() => router.push('/points-history')}
                        className="w-full text-center text-green-600 hover:text-green-700 font-medium text-sm flex items-center justify-center gap-2 py-2"
                      >
                        Ver histórico completo
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Level Info & Benefits */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefícios do Nível</h3>
                <div className="space-y-3">
                  {userStats.user.levelInfo?.perks?.map((perk: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/tourist-spots')}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="text-green-600" size={20} />
                      <span className="font-medium text-gray-900">Pontos Turísticos</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('rewards')}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Gift className="text-primary" size={20} />
                      <span className="font-medium text-gray-900">Ver Recompensas</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('leaderboard')}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="text-blue-600" size={20} />
                      <span className="font-medium text-gray-900">Ver Ranking</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = userStats.user.levelInfo && 
                userStats.recent.achievements.some((a: any) => a.id === achievement.id)
              
              return (
                <div key={achievement.id} className={`bg-white rounded-xl border-2 p-6 transition-all ${
                  isUnlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`text-3xl p-3 rounded-xl ${
                      isUnlocked ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isUnlocked ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        {achievement.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm font-medium">{achievement.points} pontos</span>
                      </div>
                    </div>
                    {isUnlocked && (
                      <CheckCircle className="text-green-500" size={24} />
                    )}
                  </div>
                  <p className={`text-sm ${
                    isUnlocked ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ranking Geral</h3>
              <p className="text-sm text-gray-600">Os usuários com mais pontos no Ponto X</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={user.userId} className={`flex items-center gap-4 p-4 rounded-lg ${
                    user.userId === userStats.user.id ? 'bg-primary/5 border-2 border-primary/20' : 'bg-gray-50'
                  }`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      index < 3 
                        ? index === 0 ? 'bg-yellow-100 text-yellow-700' 
                          : index === 1 ? 'bg-gray-100 text-gray-700'
                          : 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">
                        Nível {user.level} • {user.achievements} conquistas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{user.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">pontos</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Rewards Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Suas Recompensas</h2>
                <p className="text-gray-600">Resgate recompensas incríveis com seus pontos</p>
              </div>
              <button
                onClick={() => router.push('/rewards')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Ver Todas
                <ExternalLink size={16} />
              </button>
            </div>

            {/* User Points Summary */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Star className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{userStats.user.points.toLocaleString()}</h3>
                  <p className="text-gray-600">pontos disponíveis</p>
                </div>
              </div>
            </div>

            {/* Recently Redeemed Section */}
            {recentRedemptions.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recentemente Resgatadas</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {recentRedemptions.map((redemption, index) => (
                      <div key={redemption.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Gift className="text-green-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{redemption.rewardName}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(redemption.redeemedAt).toLocaleDateString('pt-BR')} • {redemption.cost} pontos utilizados
                          </p>
                        </div>
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Ativo
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Available Rewards */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recompensas Disponíveis</h3>
                <p className="text-sm text-gray-600">Você pode resgatar estas recompensas agora</p>
              </div>
              <div className="p-6">
                {rewards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rewards.map((reward) => {
                      const RewardIcon = getRewardIcon(reward.type)
                      const colorClass = getRewardColor(reward.type)
                      
                      return (
                        <div key={reward.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                              <RewardIcon size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Star className="text-yellow-500" size={16} />
                                  <span className="font-medium text-gray-900">{reward.cost} pontos</span>
                                </div>
                                <button
                                  onClick={() => setShowRedeemModal(reward.id)}
                                  className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                  Resgatar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gift size={64} className="text-gray-300 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma recompensa disponível</h3>
                    <p className="text-gray-600">Continue ganhando pontos para desbloquear recompensas!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress to Next Rewards */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Próximas Recompensas</h3>
                <p className="text-sm text-gray-600">Continue ganhando pontos para desbloquear</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {allRewards
                    .filter(reward => reward.cost > userStats.user.points)
                    .sort((a, b) => a.cost - b.cost)
                    .slice(0, 3)
                    .map((reward) => {
                      const RewardIcon = getRewardIcon(reward.type)
                      const colorClass = getRewardColor(reward.type)
                      const progress = getProgressToReward(userStats.user.points, reward.cost)
                      const pointsNeeded = reward.cost - userStats.user.points
                      
                      return (
                        <div key={reward.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass} opacity-60`}>
                              <RewardIcon size={16} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{reward.name}</h4>
                              <p className="text-sm text-gray-600">{reward.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="text-yellow-500" size={14} />
                                <span className="font-medium text-gray-900">{reward.cost}</span>
                              </div>
                              <p className="text-xs text-gray-500">Faltam {pointsNeeded}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>{userStats.user.points.toLocaleString()} / {reward.cost.toLocaleString()} pontos</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2 transition-all duration-500"
                                style={{ width: `${Math.max(5, progress)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Redemption Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            {(() => {
              const reward = rewards.find(r => r.id === showRedeemModal) || allRewards.find(r => r.id === showRedeemModal)
              if (!reward) return null
              
              const RewardIcon = getRewardIcon(reward.type)
              const colorClass = getRewardColor(reward.type)
              const canAfford = userStats.user.points >= reward.cost
              
              return (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${colorClass}`}>
                      <RewardIcon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Confirmar Resgate</h3>
                    <p className="text-sm sm:text-base text-gray-600">Você deseja resgatar esta recompensa?</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{reward.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">{reward.description}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={14} />
                        <span className="font-medium text-gray-900 text-sm">{reward.cost} pontos</span>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="text-xs sm:text-sm text-gray-600">Seus pontos: {userStats.user.points.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          Restará: {(userStats.user.points - reward.cost).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {!canAfford && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                      <p className="text-sm text-red-700">
                        Você não possui pontos suficientes para esta recompensa.
                        Faltam {(reward.cost - userStats.user.points).toLocaleString()} pontos.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowRedeemModal(null)}
                      className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={!canAfford}
                      className="flex-1 px-4 py-2.5 sm:py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}

export default function UserDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}