'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Plus, 
  Minus, 
  Star, 
  Award, 
  Calendar,
  Phone,
  Mail,
  Filter,
  Edit2,
  Trash2,
  TrendingUp,
  Eye
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  points: number
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  createdAt: string
  achievements?: any[]
  currentStreak?: number
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [showAddPoints, setShowAddPoints] = useState<string | null>(null)
  const [pointsAmount, setPointsAmount] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('sx_users') || '[]')
        
        // Enrich users with gamification data
        const enrichedUsers = await Promise.all(
          storedUsers.map(async (user: User) => {
            try {
              const streaks = await mockDatabase.gamification.getUserStreaks(user.id)
              return {
                ...user,
                currentStreak: streaks.current || 0,
                achievements: user.achievements || []
              }
            } catch (error) {
              console.error('Error loading user streaks:', error)
              return {
                ...user,
                currentStreak: 0,
                achievements: user.achievements || []
              }
            }
          })
        )
        
        setUsers(enrichedUsers)
        setFilteredUsers(enrichedUsers)
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = levelFilter === 'all' || user.level === levelFilter
      return matchesSearch && matchesLevel
    })

    setFilteredUsers(filtered)
  }, [users, searchTerm, levelFilter])

  const handleAddPoints = async (userId: string, points: number) => {
    try {
      const result = await mockDatabase.gamification.addPoints(
        userId, 
        points, 
        'manual_adjustment', 
        `Ajuste manual: ${points > 0 ? '+' : ''}${points} pontos`
      )

      if (result.success) {
        // Reload users with gamification data
        const storedUsers = JSON.parse(localStorage.getItem('sx_users') || '[]')
        const enrichedUsers = await Promise.all(
          storedUsers.map(async (user: User) => {
            try {
              const streaks = await mockDatabase.gamification.getUserStreaks(user.id)
              return {
                ...user,
                currentStreak: streaks.current || 0,
                achievements: user.achievements || []
              }
            } catch (error) {
              return {
                ...user,
                currentStreak: 0,
                achievements: user.achievements || []
              }
            }
          })
        )
        setUsers(enrichedUsers)
        setShowAddPoints(null)
        setPointsAmount('')
      }
    } catch (error) {
      console.error('Error adding points:', error)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Diamond': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Bronze': return '🥉'
      case 'Silver': return '🥈'
      case 'Gold': return '🥇'
      case 'Platinum': return '💎'
      case 'Diamond': return '💠'
      default: return '⭐'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie usuários e seus pontos no sistema</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
          <Users className="text-blue-600" size={20} />
          <span className="font-semibold text-blue-600">{users.length} usuários</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map(level => {
          const count = users.filter(u => u.level === level).length
          return (
            <div key={level} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{level}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
                <span className="text-2xl">{getLevelIcon(level)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div className="sm:w-48">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">Todos os níveis</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nível
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pontos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gamificação
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={14} className="text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(user.level)}`}>
                        <span>{getLevelIcon(user.level)}</span>
                        {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-400" size={16} />
                        <span className="text-sm font-semibold text-gray-900">
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Award size={12} className="text-purple-500" />
                          <span>{user.achievements?.length || 0} conquistas</span>
                        </div>
                        {user.currentStreak && user.currentStreak > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <TrendingUp size={12} className="text-orange-500" />
                            <span>{user.currentStreak} dias streak</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAddPoints(user.id)}
                          className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors"
                          title="Ajustar pontos"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || levelFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Nenhum usuário cadastrado ainda'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add Points Modal */}
      {showAddPoints && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajustar Pontos</h3>
            
            <div className="mb-4">
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de pontos (use números negativos para remover)
              </label>
              <input
                type="number"
                id="points"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                placeholder="Ex: 100 ou -50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddPoints(null)
                  setPointsAmount('')
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAddPoints(showAddPoints, parseInt(pointsAmount) || 0)}
                disabled={!pointsAmount}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}