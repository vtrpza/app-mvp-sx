'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Star, 
  Trophy, 
  MapPin, 
  Users, 
  Flame, 
  Gift, 
  TrendingUp, 
  ArrowLeft,
  Calendar,
  Filter,
  Clock,
  Award
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import AuthGuard, { useAuth } from '@/components/AuthGuard'

interface Transaction {
  id: string
  userId: string
  points: number
  reason: string
  description: string
  timestamp: string
}

function PointsHistoryContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filterReason, setFilterReason] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (user) {
      loadTransactions()
      loadStats()
    }
  }, [user])

  useEffect(() => {
    filterTransactions()
  }, [transactions, filterReason, timeFilter])

  const loadTransactions = async () => {
    if (!user) return

    try {
      const history = await mockDatabase.gamification.getPointsHistory(user.id)
      setTransactions(history.reverse()) // Most recent first
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    if (!user) return

    try {
      const userStats = await mockDatabase.gamification.getUserStats(user.id)
      setStats(userStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    // Filter by reason
    if (filterReason !== 'all') {
      filtered = filtered.filter(t => t.reason === filterReason)
    }

    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date()
      let timeLimit: Date

      switch (timeFilter) {
        case 'week':
          timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          timeLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'year':
          timeLimit = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          timeLimit = new Date(0)
      }

      filtered = filtered.filter(t => new Date(t.timestamp) >= timeLimit)
    }

    setFilteredTransactions(filtered)
  }

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'check-in': return <MapPin size={16} className="text-blue-500" />
      case 'achievement': return <Trophy size={16} className="text-yellow-500" />
      case 'streak': return <Flame size={16} className="text-orange-500" />
      case 'referral': return <Users size={16} className="text-purple-500" />
      case 'registration': return <Star size={16} className="text-green-500" />
      case 'redemption': return <Gift size={16} className="text-red-500" />
      case 'review': return <Award size={16} className="text-pink-500" />
      default: return <Star size={16} className="text-gray-500" />
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'check-in': return 'bg-blue-100 text-blue-800'
      case 'achievement': return 'bg-yellow-100 text-yellow-800'
      case 'streak': return 'bg-orange-100 text-orange-800'
      case 'referral': return 'bg-purple-100 text-purple-800'
      case 'registration': return 'bg-green-100 text-green-800'
      case 'redemption': return 'bg-red-100 text-red-800'
      case 'review': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getReasonName = (reason: string) => {
    switch (reason) {
      case 'check-in': return 'Check-in'
      case 'achievement': return 'Conquista'
      case 'streak': return 'Sequência'
      case 'referral': return 'Indicação'
      case 'registration': return 'Cadastro'
      case 'redemption': return 'Resgate'
      case 'review': return 'Avaliação'
      default: return reason
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) + ' (hoje)'
    } else if (diffInHours < 48) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) + ' (ontem)'
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const reasonTypes = ['all', ...Array.from(new Set(transactions.map(t => t.reason)))]
  const totalPoints = filteredTransactions.reduce((sum, t) => sum + t.points, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Histórico de Pontos</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Total: {user?.points} pontos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.stats.pointsThisWeek}</div>
                  <div className="text-sm text-gray-600">Esta Semana</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.stats.pointsThisMonth}</div>
                  <div className="text-sm text-gray-600">Este Mês</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.stats.currentStreak}</div>
                  <div className="text-sm text-gray-600">Sequência Atual</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.stats.totalTransactions}</div>
                  <div className="text-sm text-gray-600">Total de Atividades</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="all">Todas as atividades</option>
              {reasonTypes.filter(reason => reason !== 'all').map(reason => (
                <option key={reason} value={reason}>
                  {getReasonName(reason)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="all">Todo o período</option>
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="year">Último ano</option>
            </select>
          </div>
          
          {(filterReason !== 'all' || timeFilter !== 'all') && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-800 rounded-lg text-sm">
              <Star className="w-4 h-4" />
              <span>
                {totalPoints > 0 ? `+${totalPoints}` : totalPoints} pontos no período
              </span>
            </div>
          )}
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Transações ({filteredTransactions.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getReasonIcon(transaction.reason)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {transaction.description}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(transaction.reason)}`}>
                            {getReasonName(transaction.reason)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      <span className={`font-bold text-lg ${
                        transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </span>
                      <Star size={16} className="text-yellow-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Clock size={64} className="text-gray-300 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterReason !== 'all' || timeFilter !== 'all' 
                ? 'Nenhuma transação encontrada' 
                : 'Nenhuma transação ainda'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {filterReason !== 'all' || timeFilter !== 'all' 
                ? 'Tente ajustar os filtros para ver mais resultados.' 
                : 'Comece a usar o sistema para ver seu histórico aqui!'
              }
            </p>
            {filterReason !== 'all' || timeFilter !== 'all' ? (
              <button
                onClick={() => {
                  setFilterReason('all')
                  setTimeFilter('all')
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={() => router.push('/tourist-spots')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Fazer Check-in
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PointsHistoryPage() {
  return (
    <AuthGuard>
      <PointsHistoryContent />
    </AuthGuard>
  )
}