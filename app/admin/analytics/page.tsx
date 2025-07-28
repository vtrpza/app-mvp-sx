'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Users, 
  MapPin, 
  Star, 
  TrendingUp, 
  Calendar,
  Award,
  Activity,
  Target,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Clock,
  Trophy,
  CheckCircle,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'

interface AnalyticsData {
  userStats: {
    total: number
    levelDistribution: Record<string, number>
    newThisWeek: number
    activeUsers: number
  }
  pointsStats: {
    totalDistributed: number
    averagePerUser: number
    totalTransactions: number
    topEarners: Array<{name: string, points: number}>
  }
  spotStats: {
    total: number
    mostPopular: Array<{name: string, checkins: number}>
    totalCheckins: number
    averagePerSpot: number
  }
  activityStats: {
    dailyRegistrations: Array<{date: string, count: number}>
    weeklyCheckins: Array<{week: string, count: number}>
    monthlyPoints: Array<{month: string, points: number}>
  }
  achievements: {
    totalUnlocked: number
    mostCommon: Array<{name: string, count: number}>
    unlockRate: number
  }
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
    points?: number
    user?: string
  }>
}

interface DateRange {
  start: string
  end: string
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [selectedMetrics, setSelectedMetrics] = useState({
    users: true,
    points: true,
    spots: true,
    activity: true
  })

  const loadAnalyticsData = useCallback(async () => {
    setLoading(true)
    try {
      // Load all data sources
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
      const spots = await mockDatabase.touristSpots.getAll()
      const checkins = JSON.parse(localStorage.getItem('sx_checkins') || '[]')

      // Filter by date range
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      
      const filteredTransactions = transactions.filter((t: any) => {
        const date = new Date(t.timestamp)
        return date >= startDate && date <= endDate
      })

      const filteredCheckins = checkins.filter((c: any) => {
        const date = new Date(c.timestamp)
        return date >= startDate && date <= endDate
      })

      // Calculate user stats
      const levelDistribution = users.reduce((acc: Record<string, number>, user: any) => {
        const level = user.level || 'Bronze'
        acc[level] = (acc[level] || 0) + 1
        return acc
      }, {})

      const newUsersInRange = users.filter((u: any) => {
        const date = new Date(u.createdAt || u.registeredAt || new Date())
        return date >= startDate && date <= endDate
      }).length

      const activeUsers = users.filter((u: any) => {
        const lastActivity = transactions.find((t: any) => t.userId === u.id)
        if (!lastActivity) return false
        const date = new Date(lastActivity.timestamp)
        return date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }).length

      // Calculate points stats
      const totalDistributed = filteredTransactions.reduce((sum: number, t: any) => sum + Math.max(0, t.points), 0)
      const averagePerUser = users.length > 0 ? Math.round(users.reduce((sum: number, u: any) => sum + (u.points || 0), 0) / users.length) : 0
      
      const topEarners = users
        .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
        .slice(0, 5)
        .map((u: any) => ({ name: u.name, points: u.points || 0 }))

      // Calculate spot stats
      const spotCheckins = spots.map((spot: any) => ({
        name: spot.name,
        checkins: filteredCheckins.filter((c: any) => c.locationId === spot.id).length
      })).sort((a: any, b: any) => b.checkins - a.checkins)

      const averagePerSpot = spots.length > 0 ? Math.round(filteredCheckins.length / spots.length) : 0

      // Calculate activity trends
      const dailyRegistrations = generateDailyData(users, 'createdAt', startDate, endDate)
      const weeklyCheckins = generateWeeklyData(filteredCheckins, 'timestamp')
      const monthlyPoints = generateMonthlyData(filteredTransactions, 'timestamp', 'points')

      // Calculate achievements
      const allAchievements = users.flatMap((u: any) => u.achievements || [])
      const achievementCounts = allAchievements.reduce((acc: Record<string, number>, a: any) => {
        acc[a.name] = (acc[a.name] || 0) + 1
        return acc
      }, {})

      const mostCommonAchievements = Object.entries(achievementCounts)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const unlockRate = users.length > 0 ? (allAchievements.length / (users.length * mockDatabase.gamification.achievements.length)) * 100 : 0

      // Recent activity
      const recentActivity = [
        ...filteredTransactions.slice(-10).map((t: any) => ({
          type: 'points',
          description: t.description,
          timestamp: t.timestamp,
          points: t.points,
          user: users.find((u: any) => u.id === t.userId)?.name
        })),
        ...filteredCheckins.slice(-5).map((c: any) => ({
          type: 'checkin',
          description: `Check-in em ${c.locationName}`,
          timestamp: c.timestamp,
          user: users.find((u: any) => u.id === c.userId)?.name
        })),
        ...users.filter((u: any) => {
          const date = new Date(u.createdAt || u.registeredAt || new Date())
          return date >= startDate && date <= endDate
        }).slice(-5).map((u: any) => ({
          type: 'registration',
          description: `Novo usuário registrado`,
          timestamp: u.createdAt || u.registeredAt || new Date().toISOString(),
          user: u.name
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15)

      setData({
        userStats: {
          total: users.length,
          levelDistribution,
          newThisWeek: newUsersInRange,
          activeUsers
        },
        pointsStats: {
          totalDistributed,
          averagePerUser,
          totalTransactions: filteredTransactions.length,
          topEarners
        },
        spotStats: {
          total: spots.length,
          mostPopular: spotCheckins.slice(0, 5),
          totalCheckins: filteredCheckins.length,
          averagePerSpot
        },
        activityStats: {
          dailyRegistrations,
          weeklyCheckins,
          monthlyPoints
        },
        achievements: {
          totalUnlocked: allAchievements.length,
          mostCommon: mostCommonAchievements,
          unlockRate: Math.round(unlockRate)
        },
        recentActivity
      })

    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    loadAnalyticsData()
  }, [loadAnalyticsData])

  const generateDailyData = (items: any[], dateField: string, start: Date, end: Date) => {
    const days = []
    const current = new Date(start)
    
    while (current <= end) {
      const dayStr = current.toISOString().split('T')[0]
      const count = items.filter((item: any) => {
        const itemDate = new Date(item[dateField] || new Date()).toISOString().split('T')[0]
        return itemDate === dayStr
      }).length
      
      days.push({
        date: dayStr,
        count
      })
      
      current.setDate(current.getDate() + 1)
    }
    
    return days.slice(-7) // Last 7 days
  }

  const generateWeeklyData = (items: any[], dateField: string) => {
    const weeks: Record<string, number> = {}
    
    items.forEach((item: any) => {
      const date = new Date(item[dateField])
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      weeks[weekKey] = (weeks[weekKey] || 0) + 1
    })
    
    return Object.entries(weeks)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-4) // Last 4 weeks
  }

  const generateMonthlyData = (items: any[], dateField: string, valueField?: string) => {
    const months: Record<string, number> = {}
    
    items.forEach((item: any) => {
      const date = new Date(item[dateField])
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (valueField) {
        months[monthKey] = (months[monthKey] || 0) + (item[valueField] || 0)
      } else {
        months[monthKey] = (months[monthKey] || 0) + 1
      }
    })
    
    return Object.entries(months)
      .map(([month, value]) => ({ month, points: value }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months
  }

  const exportToCsv = () => {
    if (!data) return

    const csvData = []
    
    if (selectedMetrics.users) {
      csvData.push('=== USUÁRIOS ===')
      csvData.push(`Total de Usuários,${data.userStats.total}`)
      csvData.push(`Novos esta Semana,${data.userStats.newThisWeek}`)
      csvData.push(`Usuários Ativos,${data.userStats.activeUsers}`)
      csvData.push('')
      csvData.push('Distribuição por Nível')
      Object.entries(data.userStats.levelDistribution).forEach(([level, count]) => {
        csvData.push(`${level},${count}`)
      })
      csvData.push('')
    }

    if (selectedMetrics.points) {
      csvData.push('=== PONTOS ===')
      csvData.push(`Total Distribuído,${data.pointsStats.totalDistributed}`)
      csvData.push(`Média por Usuário,${data.pointsStats.averagePerUser}`)
      csvData.push(`Total de Transações,${data.pointsStats.totalTransactions}`)
      csvData.push('')
      csvData.push('Top Usuários por Pontos')
      data.pointsStats.topEarners.forEach((user, index) => {
        csvData.push(`${index + 1}. ${user.name},${user.points}`)
      })
      csvData.push('')
    }

    if (selectedMetrics.spots) {
      csvData.push('=== PONTOS TURÍSTICOS ===')
      csvData.push(`Total de Pontos,${data.spotStats.total}`)
      csvData.push(`Total de Check-ins,${data.spotStats.totalCheckins}`)
      csvData.push(`Média por Ponto,${data.spotStats.averagePerSpot}`)
      csvData.push('')
      csvData.push('Pontos Mais Populares')
      data.spotStats.mostPopular.forEach((spot, index) => {
        csvData.push(`${index + 1}. ${spot.name},${spot.checkins}`)
      })
      csvData.push('')
    }

    const csvContent = csvData.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `analytics_${dateRange.start}_${dateRange.end}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const LevelChart = ({ distribution }: { distribution: Record<string, number> }) => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)
    const colors = {
      Bronze: '#cd7f32',
      Silver: '#c0c0c0', 
      Gold: '#ffd700',
      Platinum: '#e5e4e2',
      Diamond: '#b9f2ff'
    }

    return (
      <div className="space-y-3">
        {Object.entries(distribution).map(([level, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={level} className="flex items-center gap-3">
              <div className="w-16 text-sm text-gray-600">{level}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: colors[level as keyof typeof colors] || '#6b7280'
                  }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-gray-900">{count}</div>
              <div className="w-12 text-xs text-gray-500">{percentage.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    )
  }

  const BarChart = ({ data, title, valueKey = 'count' }: { data: any[], title: string, valueKey?: string }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]))
    
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-600 truncate">
              {item.name || item.date || item.week || item.month || `Item ${index + 1}`}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${maxValue > 0 ? (item[valueKey] / maxValue) * 100 : 0}%` }}
              />
            </div>
            <div className="w-12 text-sm font-medium text-gray-900">{item[valueKey]}</div>
          </div>
        ))}
      </div>
    )
  }

  const LineChart = ({ data, title, valueKey = 'count' }: { data: any[], title: string, valueKey?: string }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]))
    const points = data.map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100
      const y = maxValue > 0 ? 100 - ((item[valueKey] / maxValue) * 80) : 50
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="h-32 bg-gray-50 rounded-lg p-4 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              points={points}
            />
            {data.map((item, index) => {
              const x = (index / Math.max(data.length - 1, 1)) * 100
              const y = maxValue > 0 ? 100 - ((item[valueKey] / maxValue) * 80) : 50
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#059669"
                />
              )
            })}
          </svg>
          <div className="absolute bottom-2 left-2 text-xs text-gray-500">
            Min: {Math.min(...data.map(item => item[valueKey])).toLocaleString()}
          </div>
          <div className="absolute top-2 right-2 text-xs text-gray-500">
            Max: {maxValue.toLocaleString()}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <div>{item.date ? new Date(item.date).getDate() : item.week ? 'S' + (index + 1) : item.month || index + 1}</div>
              <div className="font-medium text-gray-900">{item[valueKey]}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

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

  if (!data) {
    return (
      <div className="text-center py-12">
        <Activity size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Erro ao carregar dados de analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Análise detalhada e inteligência de negócios</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date Range Filter */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Export Button */}
          <button
            onClick={exportToCsv}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{data.userStats.total.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp size={12} className="text-green-500" />
                <span className="text-xs text-green-600">+{data.userStats.newThisWeek} esta semana</span>
              </div>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pontos Distribuídos</p>
              <p className="text-2xl font-bold text-gray-900">{data.pointsStats.totalDistributed.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">{data.pointsStats.averagePerUser} média/usuário</span>
              </div>
            </div>
            <div className="bg-yellow-500 rounded-lg p-3">
              <Star className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check-ins Totais</p>
              <p className="text-2xl font-bold text-gray-900">{data.spotStats.totalCheckins.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">{data.spotStats.averagePerSpot} média/ponto</span>
              </div>
            </div>
            <div className="bg-green-500 rounded-lg p-3">
              <MapPin className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conquistas</p>
              <p className="text-2xl font-bold text-gray-900">{data.achievements.totalUnlocked.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <Trophy size={12} className="text-yellow-500" />
                <span className="text-xs text-yellow-600">{data.achievements.unlockRate}% taxa</span>
              </div>
            </div>
            <div className="bg-purple-500 rounded-lg p-3">
              <Award className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Level Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Distribuição por Nível</h3>
            <PieChart className="text-gray-400" size={20} />
          </div>
          <LevelChart distribution={data.userStats.levelDistribution} />
        </div>

        {/* Top Tourist Spots */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pontos Mais Populares</h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <BarChart data={data.spotStats.mostPopular} title="" valueKey="checkins" />
        </div>

        {/* Daily Registrations Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Registros Diários</h3>
            <LineChartIcon className="text-gray-400" size={20} />
          </div>
          <LineChart data={data.activityStats.dailyRegistrations} title="" valueKey="count" />
        </div>

        {/* Weekly Check-ins */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Check-ins Semanais</h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <BarChart data={data.activityStats.weeklyCheckins} title="" valueKey="count" />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Point Earners */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Usuários</h3>
            <Trophy className="text-gray-400" size={20} />
          </div>
          <div className="space-y-3">
            {data.pointsStats.topEarners.map((user, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-600 font-medium">
                  <span>{user.points.toLocaleString()}</span>
                  <Star size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Common Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conquistas Populares</h3>
            <Award className="text-gray-400" size={20} />
          </div>
          <div className="space-y-3">
            {data.achievements.mostCommon.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{achievement.name}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600 font-medium text-sm">
                  <span>{achievement.count}</span>
                  <CheckCircle size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Estatísticas Rápidas</h3>
            <Zap className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Usuários Ativos</span>
              <span className="font-bold text-gray-900">{data.userStats.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Transações de Pontos</span>
              <span className="font-bold text-gray-900">{data.pointsStats.totalTransactions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pontos Turísticos</span>
              <span className="font-bold text-gray-900">{data.spotStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de Conquistas</span>
              <span className="font-bold text-gray-900">{data.achievements.unlockRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
          <Activity className="text-gray-400" size={20} />
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {data.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'points' ? 'bg-yellow-500' :
                  activity.type === 'checkin' ? 'bg-green-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {activity.user && <span>{activity.user}</span>}
                    <span>•</span>
                    <span>
                      {new Date(activity.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {activity.points && activity.points > 0 && (
                <div className="flex items-center gap-1 text-green-600 font-medium text-sm">
                  <span>+{activity.points}</span>
                  <Star size={12} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {data.recentActivity.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity size={48} className="text-gray-300 mb-2" />
            <p>Nenhuma atividade recente no período selecionado</p>
          </div>
        )}
      </div>

      {/* Export Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configuração de Exportação</h3>
          <Filter className="text-gray-400" size={20} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(selectedMetrics).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSelectedMetrics(prev => ({ ...prev, [key]: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 capitalize">
                {key === 'spots' ? 'Pontos Turísticos' : 
                 key === 'points' ? 'Pontos' :
                 key === 'activity' ? 'Atividade' : 'Usuários'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}