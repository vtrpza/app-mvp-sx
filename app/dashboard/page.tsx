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
  BarChart3
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import UserPointsDisplay from '@/components/UserPointsDisplay'

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

export default function UserDashboard() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('sx_current_user') || 'null')
        if (!currentUser) {
          // Create a mock user for demo purposes
          const mockUser = {
            id: 'demo-user',
            name: 'João Silva',
            email: 'joao@example.com',
            points: 1250,
            level: 'Silver',
            achievements: [
              {
                id: 'first_rental',
                name: 'Primeiro Aluguel',
                description: 'Complete seu primeiro aluguel',
                icon: '🚲',
                unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              }
            ]
          }
          localStorage.setItem('sx_current_user', JSON.stringify(mockUser))
          
          // Add to users list
          const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
          if (!users.find((u: any) => u.id === mockUser.id)) {
            users.push(mockUser)
            localStorage.setItem('sx_users', JSON.stringify(users))
          }
        }

        const user = currentUser || JSON.parse(localStorage.getItem('sx_current_user') || 'null')
        if (!user) return

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

      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleRedeemReward = async (rewardId: string) => {
    const user = JSON.parse(localStorage.getItem('sx_current_user') || 'null')
    if (!user) return

    try {
      const result = await mockDatabase.gamification.redeemReward(user.id, rewardId)
      if (result.success) {
        // Reload dashboard
        window.location.reload()
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ponto X Dashboard</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {userStats.user.name}!</p>
              </div>
            </div>
            <UserPointsDisplay 
              points={userStats.user.points}
              level={userStats.user.level}
              showDetails={true}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level Progress Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crown size={32} className="text-yellow-300" />
              <div>
                <h2 className="text-2xl font-bold">Nível {userStats.user.level}</h2>
                <p className="text-primary-100">
                  {userStats.user.nextLevel 
                    ? `${userStats.user.nextLevel.min - userStats.user.points} pontos para ${userStats.user.nextLevel.name}`
                    : 'Nível máximo alcançado!'
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userStats.user.points.toLocaleString()}</div>
              <div className="text-sm text-primary-100">pontos totais</div>
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
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
          {tabs.map((tab) => {
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="text-orange-500" size={20} />
                    <span className="text-2xl font-bold text-gray-900">{userStats.stats.currentStreak}</span>
                  </div>
                  <div className="text-sm text-gray-600">Sequência Atual</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="text-blue-500" size={20} />
                    <span className="text-2xl font-bold text-gray-900">{userStats.stats.totalCheckins}</span>
                  </div>
                  <div className="text-sm text-gray-600">Check-ins</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="text-yellow-500" size={20} />
                    <span className="text-2xl font-bold text-gray-900">{userStats.stats.achievementsUnlocked}</span>
                  </div>
                  <div className="text-sm text-gray-600">Conquistas</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="text-green-500" size={20} />
                    <span className="text-2xl font-bold text-gray-900">{userStats.stats.pointsThisWeek}</span>
                  </div>
                  <div className="text-sm text-gray-600">Esta Semana</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.length > 0 ? (
              rewards.map((reward) => (
                <div key={reward.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Gift className="text-primary" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500" size={16} />
                      <span className="font-medium text-gray-900">{reward.cost} pontos</span>
                    </div>
                    <button
                      onClick={() => handleRedeemReward(reward.id)}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                      Resgatar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Gift size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma recompensa disponível</h3>
                <p className="text-gray-600">Continue ganhando pontos para desbloquear recompensas!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}