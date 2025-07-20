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
  Target
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'

interface DashboardStats {
  totalUsers: number
  totalPoints: number
  totalSpots: number
  todayCheckins: number
  newUsersThisWeek: number
  averagePointsPerUser: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPoints: 0,
    totalSpots: 0,
    todayCheckins: 0,
    newUsersThisWeek: 0,
    averagePointsPerUser: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
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
        
        // Calculate stats
        const totalUsers = users.length
        const totalPoints = users.reduce((sum: number, user: any) => sum + (user.points || 0), 0)
        const averagePointsPerUser = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0
        
        // Mock some additional stats for demonstration
        const todayCheckins = Math.floor(Math.random() * 25) + 5
        const newUsersThisWeek = Math.floor(Math.random() * 15) + 3
        
        setStats({
          totalUsers,
          totalPoints,
          totalSpots: spots.length,
          todayCheckins,
          newUsersThisWeek,
          averagePointsPerUser
        })

        // Recent activity (last 10 transactions)
        setRecentActivity(transactions.slice(-10).reverse())
        
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
        <p className="text-gray-600">Visão geral do sistema SX Locações</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.change}</p>
                </div>
                <div className={`${card.color} rounded-lg p-3`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
            <Target className="text-gray-400" size={20} />
          </div>
          
          <div className="space-y-3">
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Users className="text-blue-500" size={20} />
              <div>
                <p className="font-medium text-gray-900">Gerenciar Usuários</p>
                <p className="text-sm text-gray-500">Visualizar e editar usuários</p>
              </div>
            </a>
            
            <a
              href="/admin/tourist-spots"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MapPin className="text-green-500" size={20} />
              <div>
                <p className="font-medium text-gray-900">Pontos Turísticos</p>
                <p className="text-sm text-gray-500">Adicionar novos pontos</p>
              </div>
            </a>
            
            <a
              href="/admin/points"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Star className="text-yellow-500" size={20} />
              <div>
                <p className="font-medium text-gray-900">Sistema de Pontos</p>
                <p className="text-sm text-gray-500">Configurar regras e níveis</p>
              </div>
            </a>
            
            <a
              href="/admin/analytics"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="text-purple-500" size={20} />
              <div>
                <p className="font-medium text-gray-900">Ver Analytics</p>
                <p className="text-sm text-gray-500">Relatórios detalhados</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <Award size={32} />
          <div>
            <h3 className="text-lg font-semibold">Bem-vindo ao Admin Dashboard!</h3>
            <p className="text-primary-100">
              Gerencie usuários, pontos turísticos e o sistema de fidelidade Ponto X de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}