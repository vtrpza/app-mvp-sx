'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  MapPin, 
  Star, 
  TrendingUp, 
  Calendar,
  Award,
  Activity,
  Target,
  UserPlus
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import { getReferralLeaderboard } from '@/lib/referral-utils'

interface DashboardStats {
  totalUsers: number
  totalPoints: number
  totalSpots: number
  todayCheckins: number
  newUsersThisWeek: number
  averagePointsPerUser: number
  totalReferrals: number
  referralsThisWeek: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPoints: 0,
    totalSpots: 0,
    todayCheckins: 0,
    newUsersThisWeek: 0,
    averagePointsPerUser: 0,
    totalReferrals: 0,
    referralsThisWeek: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [referralLeaderboard, setReferralLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load users
        const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
        
        // Load tourist spots
        const spots = await mockDatabase.touristSpots.getAll()
        
        // Load points transactions
        const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
        
        // Load referrals
        const referrals = JSON.parse(localStorage.getItem('sx_referrals') || '[]')
        
        // Calculate stats
        const totalUsers = users.length
        const totalPoints = users.reduce((sum: number, user: any) => sum + (user.points || 0), 0)
        const averagePointsPerUser = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0
        
        // Referral stats
        const totalReferrals = referrals.length
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const referralsThisWeek = referrals.filter((r: any) => new Date(r.createdAt) >= oneWeekAgo).length
        
        // Mock some additional stats for demonstration
        const todayCheckins = Math.floor(Math.random() * 25) + 5
        const newUsersThisWeek = Math.floor(Math.random() * 15) + 3
        
        setStats({
          totalUsers,
          totalPoints,
          totalSpots: spots.length,
          todayCheckins,
          newUsersThisWeek,
          averagePointsPerUser,
          totalReferrals,
          referralsThisWeek
        })

        // Recent activity (last 10 transactions)
        setRecentActivity(transactions.slice(-10).reverse())
        
        // Get referral leaderboard
        const leaderboard = getReferralLeaderboard(5)
        setReferralLeaderboard(leaderboard)
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.newUsersThisWeek} esta semana`
    },
    {
      title: 'Pontos Distribuídos',
      value: stats.totalPoints.toLocaleString(),
      icon: Star,
      color: 'bg-yellow-500',
      change: `${stats.averagePointsPerUser} pontos/usuário`
    },
    {
      title: 'Pontos Turísticos',
      value: stats.totalSpots.toString(),
      icon: MapPin,
      color: 'bg-green-500',
      change: 'Ativos no sistema'
    },
    {
      title: 'Check-ins Hoje',
      value: stats.todayCheckins.toString(),
      icon: Activity,
      color: 'bg-purple-500',
      change: 'Engajamento diário'
    },
    {
      title: 'Total de Indicações',
      value: stats.totalReferrals.toString(),
      icon: UserPlus,
      color: 'bg-indigo-500',
      change: `+${stats.referralsThisWeek} esta semana`
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema SX Locadora</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{card.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{card.change}</p>
                </div>
                <div className={`${card.color} rounded-lg p-2 sm:p-3 flex-shrink-0 ml-3`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Atividade Recente</h2>
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-medium text-sm">
                    <span>+{activity.points}</span>
                    <Star size={12} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity size={48} className="mb-2 text-gray-300" />
              <p>Nenhuma atividade recente</p>
            </div>
          )}
        </div>

        {/* Referral Leaderboard */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Top Indicadores</h2>
            <UserPlus className="text-gray-400" size={20} />
          </div>
          
          {referralLeaderboard.length > 0 ? (
            <div className="space-y-3">
              {referralLeaderboard.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.referralCount} indicações</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {user.pointsEarned} pts
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserPlus size={48} className="mb-2 text-gray-300" />
              <p>Nenhuma indicação ainda</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Ações Rápidas</h2>
            <Target className="text-gray-400" size={20} />
          </div>
          
          <div className="space-y-3">
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-target"
            >
              <Users className="text-blue-500 flex-shrink-0" size={20} />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Gerenciar Usuários</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Visualizar e editar usuários</p>
              </div>
            </a>
            
            <a
              href="/admin/tourist-spots"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-target"
            >
              <MapPin className="text-green-500 flex-shrink-0" size={20} />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Pontos Turísticos</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Adicionar novos pontos</p>
              </div>
            </a>
            
            <a
              href="/admin/points"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-target"
            >
              <Star className="text-yellow-500 flex-shrink-0" size={20} />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Sistema de Pontos</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Configurar regras e níveis</p>
              </div>
            </a>
            
            <a
              href="/referrals"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-target"
            >
              <UserPlus className="text-indigo-500 flex-shrink-0" size={20} />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Indicações</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Sistema de referências</p>
              </div>
            </a>
            
            <a
              href="/admin/analytics"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-target"
            >
              <TrendingUp className="text-purple-500 flex-shrink-0" size={20} />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Ver Analytics</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Relatórios detalhados</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Award size={24} className="sm:w-8 sm:h-8 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-0">Bem-vindo ao Admin Dashboard!</h3>
            <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
              Gerencie usuários, pontos turísticos e o sistema de fidelidade Ponto X de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}