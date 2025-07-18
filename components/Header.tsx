'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, User, MapPin, Bell } from 'lucide-react'

interface HeaderProps {
  user?: {
    id: string
    name: string
    avatar?: string
  }
  onLogin?: () => void
  onLogout?: () => void
}

export default function Header({ user, onLogin, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // ✅ Memoized callbacks for performance
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])
  const handleLogin = useCallback(() => onLogin?.(), [onLogin])
  const handleLogout = useCallback(() => {
    onLogout?.()
    setIsMenuOpen(false) // Close menu on logout
  }, [onLogout])
  
  // ✅ Memoized computed values
  const isLoggedIn = useMemo(() => !!user, [user])
  
  // ✅ Memoized navigation items
  const navigationItems = useMemo(() => [
    { href: '#home', label: 'Início' },
    { href: '#marketplace', label: 'Marketplace' },
    { href: '#guide', label: 'Guia Turístico' },
    { href: '#about', label: 'Sobre' }
  ], [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${hasScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`} role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ✅ Semantic logo with accessibility */}
          <Link href="/" className="flex items-center" aria-label="SX Locações - Página inicial">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white text-xl">
              SX
            </div>
            <span className={`ml-2 text-xl font-bold ${hasScrolled ? 'text-gray-900' : 'text-white'}`}>Locações</span>
          </Link>

          {/* ✅ Accessible desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegação principal">
            {navigationItems.map(item => (
              <a 
                key={item.href}
                href={item.href} 
                className={`${hasScrolled ? 'text-gray-700' : 'text-white'} hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm px-2 py-1`}
                aria-label={`Ir para ${item.label}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button className={`p-2 ${hasScrolled ? 'text-gray-600' : 'text-white'} hover:text-primary transition-colors`}>
                  <Bell size={20} />
                </button>
                <button className={`p-2 ${hasScrolled ? 'text-gray-600' : 'text-white'} hover:text-primary transition-colors`}>
                  <MapPin size={20} />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className={`text-sm ${hasScrolled ? 'text-gray-700' : 'text-white'}`}>João Silva</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className={`text-sm ${hasScrolled ? 'text-gray-600' : 'text-white'} hover:text-primary transition-colors`}
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleLogin}
                  className={`${hasScrolled ? 'text-primary' : 'text-white'} hover:text-primary-600 transition-colors font-semibold`}
                >
                  Entrar
                </button>
                <button className="btn-primary">
                  Cadastrar
                </button>
              </div>
            )}
          </div>

          {/* ✅ Accessible mobile menu button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 ${hasScrolled ? 'text-gray-600' : 'text-white'} hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm`}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ✅ Accessible mobile menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-white border-t border-gray-100 py-4 z-50"
            role="navigation"
            aria-label="Menu móvel"
          >
            <nav className="flex flex-col space-y-4">
              {navigationItems.map(item => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="text-black hover:text-primary transition-colors px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={toggleMenu}
                  aria-label={`Ir para ${item.label}`}
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-gray-200" />
              {isLoggedIn ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm text-black">{user?.name || 'Usuário'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left text-black hover:text-primary transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-3">
                  <button 
                    onClick={handleLogin}
                    className="w-full text-left text-primary hover:text-primary-600 transition-colors"
                  >
                    Entrar
                  </button>
                  <button className="w-full btn-primary">
                    Cadastrar
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
