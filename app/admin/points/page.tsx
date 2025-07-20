'use client'

import { useState, useEffect } from 'react'
import { 
  Star, 
  Settings, 
  Users, 
  TrendingUp, 
  Gift,
  Plus,
  Minus,
  Search,
  Filter,
  Award
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'

interface User {
  id: string
  name: string
  email: string
  points: number
  level: string
  createdAt: string
}

interface PointsConfig {
  levels: {
    Bronze: number
    Silver: number
    Gold: number
    Platinum: number
  }
  actions: {
    register: number
    checkin: number
    referral: number
    review: number
  }
}

export default function PointsAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<PointsConfig>({
    levels: {
      Bronze: 0,
      Silver: 500,
      Gold: 1500,
      Platinum: 3000
    },
    actions: {
      register: 100,
      checkin: 50,
      referral: 200,
      review: 25
    }
  })
  const [showConfig, setShowConfig] = useState(false)
  const [pointsToAdd, setPointsToAdd] = useState<Record<string, number>>({})
  const [reasonToAdd, setReasonToAdd] = useState<Record<string, string>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load users from localStorage
      const usersData = JSON.parse(localStorage.getItem('sx_users') || '[]')
      setUsers(usersData)

      // Load points config
      const savedConfig = localStorage.getItem('sx_points_config')
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = () => {
    localStorage.setItem('sx_points_config', JSON.stringify(config))
    alert('Configurações salvas com sucesso!')
    setShowConfig(false)
  }

  const addPointsToUser = async (userId: string) => {
    const points = pointsToAdd[userId] || 0
    const reason = reasonToAdd[userId] || 'Ajuste manual'

    if (points === 0) {
      alert('Informe a quantidade de pontos')
      return
    }

    try {
      await mockDatabase.gamification.addPoints(userId, points, 'manual', reason)
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          const newPoints = user.points + points
          return {
            ...user,
            points: newPoints,
            level: mockDatabase.gamification.calculateLevel(newPoints)
          }
        }
        return user
      })
      setUsers(updatedUsers)

      // Update localStorage
      localStorage.setItem('sx_users', JSON.stringify(updatedUsers))

      // Clear form
      setPointsToAdd(prev => ({ ...prev, [userId]: 0 }))
      setReasonToAdd(prev => ({ ...prev, [userId]: '' }))

      alert(`${points > 0 ? 'Adicionados' : 'Removidos'} ${Math.abs(points)} pontos para ${users.find(u => u.id === userId)?.name}`)
    } catch (error) {
      console.error('Error adding points:', error)
      alert('Erro ao adicionar pontos')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || user.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const stats = {
    totalUsers: users.length,
    totalPoints: users.reduce((sum, user) => sum + user.points, 0),
    averagePoints: users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.points, 0) / users.length) : 0,
    levelDistribution: {
      Bronze: users.filter(u => u.level === 'Bronze').length,
      Silver: users.filter(u => u.level === 'Silver').length,
      Gold: users.filter(u => u.level === 'Gold').length,
      Platinum: users.filter(u => u.level === 'Platinum').length,
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Pontos</h1>
          <p className="text-gray-600">Gerencie pontos e configurações do Ponto X</p>
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Settings size={20} />
          Configurações
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pontos Distribuídos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
            </div>
            <Star className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média por Usuário</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averagePoints}</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Gold+</p>
              <p className="text-2xl font-bold text-gray-900">{stats.levelDistribution.Gold + stats.levelDistribution.Platinum}</p>
            </div>
            <Award className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Level Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Nível</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.levelDistribution).map(([level, count]) => (
            <div key={level} className="text-center p-4 rounded-lg bg-gray-50">
              <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${
                level === 'Bronze' ? 'bg-orange-100' :
                level === 'Silver' ? 'bg-gray-100' :
                level === 'Gold' ? 'bg-yellow-100' : 'bg-purple-100'
              }`}>
                <Award className={`${
                  level === 'Bronze' ? 'text-orange-600' :
                  level === 'Silver' ? 'text-gray-600' :
                  level === 'Gold' ? 'text-yellow-600' : 'text-purple-600'
                }`} size={24} />
              </div>
              <p className="font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600">{level}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos os níveis</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Usuário</th>
                  <th className="text-left p-4 font-medium text-gray-900">Pontos</th>
                  <th className="text-left p-4 font-medium text-gray-900">Nível</th>
                  <th className="text-left p-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={16} />
                        <span className="font-bold text-gray-900">{user.points}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        user.level === 'Bronze' ? 'bg-orange-100 text-orange-700' :
                        user.level === 'Silver' ? 'bg-gray-100 text-gray-700' :
                        user.level === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {user.level}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Pontos"
                          value={pointsToAdd[user.id] || ''}
                          onChange={(e) => setPointsToAdd(prev => ({ 
                            ...prev, 
                            [user.id]: parseInt(e.target.value) || 0 
                          }))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Motivo"
                          value={reasonToAdd[user.id] || ''}
                          onChange={(e) => setReasonToAdd(prev => ({ 
                            ...prev, 
                            [user.id]: e.target.value 
                          }))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => addPointsToUser(user.id)}
                          className="p-1 bg-primary text-white rounded hover:bg-primary-600 transition-colors"
                          title="Adicionar/Remover pontos"
                        >
                          <Gift size={16} />
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
            <Users className="text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {/* Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Configurações do Sistema</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Levels Config */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pontos por Nível</h3>
                <div className="space-y-3">
                  {Object.entries(config.levels).map(([level, points]) => (
                    <div key={level} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">{level}</label>
                      <input
                        type="number"
                        min="0"
                        value={points}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          levels: { ...prev.levels, [level]: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Config */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pontos por Ação</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Cadastro</label>
                    <input
                      type="number"
                      min="0"
                      value={config.actions.register}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        actions: { ...prev.actions, register: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Check-in</label>
                    <input
                      type="number"
                      min="0"
                      value={config.actions.checkin}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        actions: { ...prev.actions, checkin: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Indicação</label>
                    <input
                      type="number"
                      min="0"
                      value={config.actions.referral}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        actions: { ...prev.actions, referral: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Avaliação</label>
                    <input
                      type="number"
                      min="0"
                      value={config.actions.review}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        actions: { ...prev.actions, review: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveConfig}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}