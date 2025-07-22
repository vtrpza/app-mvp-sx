'use client'

import { useState, useEffect } from 'react'
import { Star, Trophy, Gift, TrendingUp } from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'

interface UserPointsDisplayProps {
  userId?: string
  compact?: boolean
  points?: number
  level?: string
  showDetails?: boolean
}

export default function UserPointsDisplay({ 
  userId, 
  compact = false, 
  points: propPoints, 
  level: propLevel, 
  showDetails = true 
}: UserPointsDisplayProps) {
  const [userPoints, setUserPoints] = useState<any>(null)
  const [pointsHistory, setPointsHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If points and level are provided as props, use them directly
    if (propPoints !== undefined && propLevel) {
      setUserPoints({ points: propPoints, level: propLevel })
      setLoading(false)
      return
    }

    const loadUserData = async () => {
      let currentUserId = userId
      
      if (!currentUserId) {
        // Try to get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('sx_current_user') || 'null')
        if (!currentUser) {
          setLoading(false)
          return
        }
        currentUserId = currentUser.id
      }

      if (!currentUserId) {
        setLoading(false)
        return
      }

      try {
        const [points, history] = await Promise.all([
          mockDatabase.gamification.getUserPoints(currentUserId),
          mockDatabase.gamification.getPointsHistory(currentUserId)
        ])

        setUserPoints(points)
        setPointsHistory(history.slice(-5)) // Last 5 transactions
      } catch (error) {
        console.error('Error loading user points:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [userId, propPoints, propLevel])

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg h-20 w-full"></div>
    )
  }

  if (!userPoints) {
    return null
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'text-orange-600 bg-orange-100'
      case 'Silver': return 'text-gray-600 bg-gray-100'
      case 'Gold': return 'text-yellow-600 bg-yellow-100'
      case 'Platinum': return 'text-purple-600 bg-purple-100'
      case 'Diamond': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getNextLevel = (currentLevel: string, points: number) => {
    const levels = [
      { name: 'Bronze', min: 0 },
      { name: 'Silver', min: 500 },
      { name: 'Gold', min: 1500 },
      { name: 'Platinum', min: 3000 },
      { name: 'Diamond', min: 10000 }
    ]

    const currentIndex = levels.findIndex(l => l.name === currentLevel)
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1]
      const pointsNeeded = nextLevel.min - points
      return { name: nextLevel.name, pointsNeeded }
    }
    return null
  }

  const nextLevel = getNextLevel(userPoints.level, userPoints.points)

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border">
        <div className="flex items-center gap-2">
          <Star className="text-primary" size={16} />
          <span className="font-bold text-gray-900">{userPoints.points}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(userPoints.level)}`}>
          {userPoints.level}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Seus Pontos X</h3>
        <Trophy className="text-primary" size={24} />
      </div>

      {/* Points and Level */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Star className="text-primary" size={20} />
            <span className="text-2xl font-bold text-gray-900">{userPoints.points}</span>
          </div>
          <p className="text-sm text-gray-600">Pontos Totais</p>
        </div>
        
        <div className="text-center">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-1 ${getLevelColor(userPoints.level)}`}>
            {userPoints.level}
          </div>
          <p className="text-sm text-gray-600">Nível Atual</p>
        </div>
      </div>

      {/* Progress to Next Level */}
      {showDetails && nextLevel && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Próximo nível: {nextLevel.name}</span>
            <span className="text-gray-600">{nextLevel.pointsNeeded} pontos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.max(0, Math.min(100, (1 - nextLevel.pointsNeeded / (nextLevel.pointsNeeded + 100)) * 100))}%` 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {showDetails && pointsHistory.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Atividades Recentes
          </h4>
          <div className="space-y-2">
            {pointsHistory.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 bg-white rounded-lg text-sm">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold">
                  <span>+{transaction.points}</span>
                  <Star size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {showDetails && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <Gift className="text-primary" size={20} />
            <div>
              <p className="font-medium text-gray-900">Ganhe mais pontos!</p>
              <p className="text-sm text-gray-600">Faça check-in em pontos turísticos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}