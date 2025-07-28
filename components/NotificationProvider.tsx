'use client'

import { createContext, useContext, ReactNode } from 'react'
import NotificationSystem, { useNotifications } from './NotificationSystem'

type NotificationContextType = ReturnType<typeof useNotifications>

const NotificationContext = createContext<NotificationContextType | null>(null)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const notificationSystem = useNotifications()

  return (
    <NotificationContext.Provider value={notificationSystem}>
      {children}
      <NotificationSystem
        notifications={notificationSystem.notifications}
        onRemove={notificationSystem.removeNotification}
        position="top-right"
      />
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}

// Re-export the hook for direct use
export { useNotifications }