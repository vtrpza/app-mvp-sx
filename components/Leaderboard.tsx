'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Clock, 
  Calendar,
  Star,
  Users,
  Flame,
  Target,
  Award,
  ChevronDown,
  Filter
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import { PerformantStorage, PerfMonitor, useMemoizedCalculation } from '@/lib/performance-utils'

interface LeaderboardUser {
  rank: number
  userId: string
  name: string
  points: number
  totalPoints: number
  level: string
  avatar?: string
  achievements: number
}

// Memoized timeframes configuration
const TIMEFRAMES = [
  { id: 'all', name: 'Todo Tempo', icon: Trophy },
  { id: 'week', name: 'Esta Semana', icon: Calendar },
  { id: 'month', name: 'Este Mês', icon: Clock },
  { id: 'year', name: 'Este Ano', icon: TrendingUp }
] as const

// Memoized user rank component
const UserRankDisplay = memo(({ 
  currentUserRank, 
  currentUser 
}: { 
  currentUserRank?: number
  currentUser: any 
}) => {
  if (!currentUserRank || !currentUser) return null

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-primary/20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Target size={20} />
          <span>Sua Posição: #{currentUserRank}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Star size={16} className="text-yellow-500" />
          <span>{currentUser?.points?.toLocaleString() || 0} pontos</span>
        </div>
      </div>
    </div>
  )
})

UserRankDisplay.displayName = 'UserRankDisplay'

// Memoized podium component
const PodiumDisplay = memo(({ 
  leaderboard, 
  getLevelColor, 
  getLevelIcon 
}: { 
  leaderboard: LeaderboardUser[]
  getLevelColor: (level: string) => string
  getLevelIcon: (level: string) => string
}) => {
  if (leaderboard.length < 3) return null

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-b border-gray-200">
      <div className="flex justify-center items-end gap-8">
        {/* 2nd Place */}
        <PodiumPlace 
          user={leaderboard[1]} 
          position={2} 
          getLevelColor={getLevelColor}
          getLevelIcon={getLevelIcon}
        />

        {/* 1st Place */}
        <PodiumPlace 
          user={leaderboard[0]} 
          position={1} 
          getLevelColor={getLevelColor}
          getLevelIcon={getLevelIcon}
          isFirst
        />

        {/* 3rd Place */}
        <PodiumPlace 
          user={leaderboard[2]} 
          position={3} 
          getLevelColor={getLevelColor}
          getLevelIcon={getLevelIcon}
        />
      </div>
    </div>
  )
})

PodiumDisplay.displayName = 'PodiumDisplay'

// Memoized individual podium place
const PodiumPlace = memo(({ 
  user, 
  position, 
  getLevelColor, 
  getLevelIcon, 
  isFirst = false 
}: {
  user: LeaderboardUser
  position: number
  getLevelColor: (level: string) => string
  getLevelIcon: (level: string) => string
  isFirst?: boolean
}) => {
  const getPositionIcon = () => {
    switch (position) {
      case 1: return <Crown className="text-yellow-500" size={isFirst ? 24 : 20} />
      case 2: return <Medal className="text-gray-500" size={20} />
      case 3: return <Award className="text-orange-500" size={20} />
      default: return null
    }
  }

  const getPositionStyles = () => {
    switch (position) {
      case 1: return {
        container: 'text-center transform scale-110',
        avatar: 'w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl',
        iconPos: 'absolute -top-3 -right-1',
        badge: 'absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold',
        name: 'font-bold text-lg text-gray-900',
        points: 'text-lg font-bold text-primary mt-1'
      }
      case 2: return {
        container: 'text-center',
        avatar: 'w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg',
        iconPos: 'absolute -top-2 -right-2',
        name: 'font-semibold text-gray-900',
        points: 'text-sm text-gray-600 mt-1'
      }
      case 3: return {
        container: 'text-center',
        avatar: 'w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg',
        iconPos: 'absolute -top-2 -right-2',
        name: 'font-semibold text-gray-900',
        points: 'text-sm text-gray-600 mt-1'
      }
      default: return {}
    }
  }

  const styles = getPositionStyles()

  return (
    <div className={styles.container}>
      <div className="relative mb-3">
        <div className={styles.avatar}>
          {user.name.charAt(0)}
        </div>
        <div className={styles.iconPos}>
          {getPositionIcon()}
        </div>
        {isFirst && (
          <div className={styles.badge}>
            👑 #1
          </div>
        )}
      </div>
      <div className={styles.name}>{user.name}</div>
      <div className={`inline-flex items-center gap-1 px-${isFirst ? '3' : '2'} py-1 rounded-full text-${isFirst ? 'sm' : 'xs'} font-medium mt-1 ${getLevelColor(user.level)}`}>
        <span>{getLevelIcon(user.level)}</span>
        {user.level}
      </div>
      <div className={styles.points}>{user.points.toLocaleString()} pts</div>
    </div>
  )
})

PodiumPlace.displayName = 'PodiumPlace'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [timeframe, setTimeframe] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Memoized data loading function
  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      
      // Try to get cached data first
      const cacheKey = `leaderboard_${timeframe}`
      const cachedData = PerformantStorage.get<{ leaderboard: LeaderboardUser[]; user: any }>(cacheKey, 30000) // 30 second cache

      if (cachedData) {
        setLeaderboard(cachedData.leaderboard)
        setCurrentUser(cachedData.user)
        setLoading(false)
        return
      }

      // Get current user
      const user = JSON.parse(localStorage.getItem('sx_current_user') || 'null')
      setCurrentUser(user)
      
      // Load leaderboard data with performance monitoring
      const data = await PerfMonitor.measureAsync('leaderboard-load', async () => {
        return await mockDatabase.gamification.getLeaderboard(timeframe, 50)
      })
      
      setLeaderboard(data)
      
      // Cache the result
      PerformantStorage.set(cacheKey, { leaderboard: data, user })
      
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }, [timeframe])

  useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  // Memoized helper functions
  const getRankIcon = useMemoizedCalculation(() => {
    const rankIconFn = (rank: number) => {
      switch (rank) {
        case 1:
          return <Crown className="text-yellow-500" size={24} />
        case 2:
          return <Medal className="text-gray-500" size={24} />
        case 3:
          return <Award className="text-orange-500" size={24} />
        default:
          return <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">{rank}</div>
      }
    }
    return rankIconFn
  }, [])

  const getLevelColor = useMemoizedCalculation(() => (level: string) => {
    switch (level) {
      case 'Bronze': return 'text-orange-600 bg-orange-100'
      case 'Silver': return 'text-gray-600 bg-gray-100'
      case 'Gold': return 'text-yellow-600 bg-yellow-100'
      case 'Platinum': return 'text-purple-600 bg-purple-100'
      case 'Diamond': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }, [])

  const getLevelIcon = useMemoizedCalculation(() => (level: string) => {
    switch (level) {
      case 'Bronze': return '🥉'
      case 'Silver': return '🥈'
      case 'Gold': return '🥇'
      case 'Platinum': return '💎'
      case 'Diamond': return '💠'
      default: return '⭐'
    }
  }, [])

  // Memoized current user rank calculation
  const currentUserRank = useMemo(() => 
    leaderboard.find(u => u.userId === currentUser?.id)?.rank,
    [leaderboard, currentUser?.id]
  )

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="text-primary" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ranking Ponto X</h2>
              <p className="text-gray-600">Compete com outros usuários e suba no ranking!</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} />
            <span className="font-medium">{TIMEFRAMES.find(t => t.id === timeframe)?.name}</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-white rounded-lg border border-gray-200">
            {TIMEFRAMES.map((tf) => {
              const Icon = tf.icon
              return (
                <button
                  key={tf.id}
                  onClick={() => {
                    setTimeframe(tf.id)
                    setShowFilters(false)
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    timeframe === tf.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{tf.name}</span>
                </button>
              )
            })}
          </div>
        )}
        
        {/* Current User Position */}
        <UserRankDisplay 
          currentUserRank={currentUserRank}
          currentUser={currentUser}
        />
      </div>

      {/* Top 3 Podium */}
      <PodiumDisplay 
        leaderboard={leaderboard}
        getLevelColor={getLevelColor}
        getLevelIcon={getLevelIcon}
      />

      {/* Full Leaderboard */}
      <div className="p-6">
        <div className="space-y-2">
          {leaderboard.map((user) => (
            <div key={user.userId} className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-gray-50 ${
              user.userId === currentUser?.id 
                ? 'bg-primary/5 border-2 border-primary/20 ring-2 ring-primary/10' 
                : 'border border-gray-100'
            }`}>
              {/* Rank */}
              <div className="flex-shrink-0">
                {getRankIcon(user.rank)}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center font-semibold text-primary">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                      {user.userId === currentUser?.id && (
                        <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">Você</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                        <span>{getLevelIcon(user.level)}</span>
                        {user.level}
                      </span>
                      {user.achievements > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Trophy size={12} />
                          {user.achievements} conquistas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {timeframe === 'all' ? 'pontos totais' : `pts ${TIMEFRAMES.find(t => t.id === timeframe)?.name.toLowerCase()}`}
                </div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-600">Seja o primeiro a participar do ranking!</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {leaderboard.length} usuários
            </span>
            <span className="flex items-center gap-1">
              <Flame size={14} />
              Atualizado em tempo real
            </span>
          </div>
          <div className="text-xs">
            Período: {TIMEFRAMES.find(t => t.id === timeframe)?.name}
          </div>
        </div>
      </div>
    </div>
  )
}