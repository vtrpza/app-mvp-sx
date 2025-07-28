'use client'

import { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react'
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Star, 
  Trophy, 
  Gift, 
  Zap,
  TrendingUp,
  Crown,
  Flame
} from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'levelup' | 'points' | 'reward'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  data?: any
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
}

export default function NotificationSystem({ 
  notifications, 
  onRemove, 
  position = 'top-right' 
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setVisibleNotifications(notifications)
  }, [notifications])

  const handleRemove = useCallback((id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id))
    setTimeout(() => onRemove(id), 300) // Delay for animation
  }, [onRemove])

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          handleRemove(notification.id)
        }, notification.duration)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications, handleRemove])

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'top-4 right-4'
    }
  }

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          textColor: 'text-green-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          textColor: 'text-red-700'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: AlertCircle,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700'
        }
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: Info,
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700'
        }
      case 'achievement':
        return {
          bg: 'bg-purple-50 border-purple-200',
          icon: Trophy,
          iconColor: 'text-purple-600',
          titleColor: 'text-purple-800',
          textColor: 'text-purple-700'
        }
      case 'levelup':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: Crown,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700'
        }
      case 'points':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: Star,
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          textColor: 'text-green-700'
        }
      case 'reward':
        return {
          bg: 'bg-indigo-50 border-indigo-200',
          icon: Gift,
          iconColor: 'text-indigo-600',
          titleColor: 'text-indigo-800',
          textColor: 'text-indigo-700'
        }
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: Info,
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          textColor: 'text-gray-700'
        }
    }
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-3 max-w-sm w-full`}>
      {visibleNotifications.map((notification) => {
        const styles = getNotificationStyles(notification.type)
        const Icon = styles.icon

        return (
          <div
            key={notification.id}
            className={`${styles.bg} border-2 rounded-xl shadow-lg p-4 transform transition-all duration-300 ease-in-out hover:scale-105`}
            style={{
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <Icon className={styles.iconColor} size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`${styles.titleColor} font-semibold text-sm leading-5`}>
                  {notification.title}
                </h4>
                <p className={`${styles.textColor} text-sm mt-1 leading-5`}>
                  {notification.message}
                </p>

                {/* Special content for different notification types */}
                {notification.type === 'points' && notification.data?.points && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-sm font-bold">+{notification.data.points}</span>
                    </div>
                    {notification.data.newTotal && (
                      <span className="text-xs text-gray-600">
                        Total: {notification.data.newTotal.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                {notification.type === 'levelup' && notification.data && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full">
                      <Crown size={14} className="text-yellow-500" />
                      <span className="text-sm font-bold">Nível {notification.data.newLevel}</span>
                    </div>
                  </div>
                )}

                {notification.type === 'achievement' && notification.data?.achievement && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg">{notification.data.achievement.icon}</span>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-sm font-bold">+{notification.data.achievement.points} pts</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {notification.action && (
                  <div className="mt-3">
                    <button
                      onClick={notification.action.onClick}
                      className="text-sm font-medium underline hover:no-underline transition-all"
                      style={{ color: styles.iconColor.replace('text-', '') }}
                    >
                      {notification.action.label}
                    </button>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => handleRemove(notification.id)}
                className={`${styles.iconColor} hover:bg-white/60 rounded-lg p-1 transition-colors flex-shrink-0`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress Bar for timed notifications */}
            {notification.duration && notification.duration > 0 && (
              <div className="mt-3 w-full bg-white/30 rounded-full h-1">
                <div
                  className="bg-white/60 h-1 rounded-full transition-all ease-linear"
                  style={{
                    width: '100%',
                    animation: `shrink ${notification.duration}ms linear forwards`
                  }}
                />
              </div>
            )}
          </div>
        )
      })}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000 // Default 5 seconds
    }
    
    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Predefined notification creators
  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration })
  }, [addNotification])

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration })
  }, [addNotification])

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration })
  }, [addNotification])

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration })
  }, [addNotification])

  const showAchievement = useCallback((achievement: any, duration?: number) => {
    return addNotification({
      type: 'achievement',
      title: 'Conquista Desbloqueada!',
      message: `Você desbloqueou: ${achievement.name}`,
      duration: duration ?? 7000, // Longer for achievements
      data: { achievement }
    })
  }, [addNotification])

  const showLevelUp = useCallback((oldLevel: string, newLevel: string, duration?: number) => {
    return addNotification({
      type: 'levelup',
      title: 'Level Up! 🎉',
      message: `Parabéns! Você subiu para o nível ${newLevel}!`,
      duration: duration ?? 7000,
      data: { oldLevel, newLevel }
    })
  }, [addNotification])

  const showPointsEarned = useCallback((points: number, description: string, newTotal?: number, duration?: number) => {
    return addNotification({
      type: 'points',
      title: 'Pontos Ganhos!',
      message: description,
      duration: duration ?? 4000,
      data: { points, newTotal }
    })
  }, [addNotification])

  const showReward = useCallback((rewardName: string, description: string, duration?: number) => {
    return addNotification({
      type: 'reward',
      title: 'Recompensa Resgatada!',
      message: `${rewardName}: ${description}`,
      duration: duration ?? 6000
    })
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAchievement,
    showLevelUp,
    showPointsEarned,
    showReward
  }
}