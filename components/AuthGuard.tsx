'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function AuthGuard({ children, redirectTo = '/auth' }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem('sx_current_user')
        if (currentUser) {
          const userData = JSON.parse(currentUser)
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        router.push(redirectTo)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sx_current_user' && !e.newValue) {
        router.push(redirectTo)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Router.push will handle the redirect
  }

  return <>{children}</>
}

// Hook for accessing current user
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem('sx_current_user')
        if (currentUser) {
          setUser(JSON.parse(currentUser))
        }
      } catch (error) {
        console.error('Error getting current user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sx_current_user') {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue))
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const logout = () => {
    localStorage.removeItem('sx_current_user')
    setUser(null)
    window.location.href = '/auth'
  }

  const updateUser = (userData: User) => {
    localStorage.setItem('sx_current_user', JSON.stringify(userData))
    setUser(userData)
    
    // Also update in users list
    const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
    const userIndex = users.findIndex((u: User) => u.id === userData.id)
    if (userIndex !== -1) {
      users[userIndex] = userData
      localStorage.setItem('sx_users', JSON.stringify(users))
    }
  }

  return {
    user,
    loading,
    logout,
    updateUser,
    isAuthenticated: !!user
  }
}