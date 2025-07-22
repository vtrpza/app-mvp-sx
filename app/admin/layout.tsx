'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Star, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem('sx_admin_session')
    if (session) {
      try {
        const parsed = JSON.parse(session)
        if (parsed.authenticated) {
          setIsAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    } else if (pathname !== '/admin/login') {
      router.push('/admin/login')
    }
    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('sx_admin_session')
    router.push('/admin/login')
  }

  // Show login page without layout
  if (pathname === '/admin/login') {
    return children
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Usuários', href: '/admin/users', icon: Users },
    { name: 'Pontos Turísticos', href: '/admin/tourist-spots', icon: MapPin },
    { name: 'Sistema de Pontos', href: '/admin/points', icon: Star },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200 safe-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-8 sm:h-8 bg-primary rounded-xl sm:rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-sm">SX</span>
            </div>
            <span className="font-bold text-gray-900 mobile-text-lg">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-3 sm:p-1 text-gray-400 hover:text-gray-600 touch-target"
          >
            <X size={24} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 pb-8">
          <ul className="space-y-3 sm:space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`mobile-nav-item flex items-center gap-3 font-medium transition-colors touch-target ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} className="sm:w-[18px] sm:h-[18px]" />
                    {item.name}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="mobile-nav-item flex items-center gap-3 font-medium text-red-600 hover:bg-red-50 w-full transition-colors touch-target"
            >
              <LogOut size={20} className="sm:w-[18px] sm:h-[18px]" />
              Sair
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="admin-main-content flex-1 flex flex-col lg:pl-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 safe-top flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 sm:p-2 text-gray-400 hover:text-gray-600 touch-target"
            >
              <Menu size={24} className="sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <span className="text-base sm:text-sm text-gray-500">
                Logado como: <span className="font-medium text-gray-900">Admin</span>
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mobile-section safe-bottom flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}