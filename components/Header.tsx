'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, MapPin, Bell, Star } from 'lucide-react'

interface HeaderProps {
  user?: {
    id: string
    name: string
    avatar?: string
    points?: number
    level?: string
  }
  onLogin?: () => void
  onLogout?: () => void
}

export default function Header({ user, onLogin, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])
  const handleLogin = useCallback(() => onLogin?.(), [onLogin])
  const handleLogout = useCallback(() => {
    onLogout?.()
    setIsMenuOpen(false)
  }, [onLogout])
  
  const isLoggedIn = useMemo(() => !!user, [user])
  
  const navigationItems = useMemo(() => [
    { href: '#home', label: 'Início' },
    { href: '#marketplace', label: 'Veículos' },
    { href: '#guide', label: 'Pontos Turísticos' },
    { href: '#about', label: 'Ponto X' }
  ], [])

  const headerClasses = useMemo(() => {
    const base = 'fixed top-0 w-full z-50 transition-all duration-500 ease-out'
    if (hasScrolled) {
      return `${base} glass-header border-b border-white/10 h-16`
    }
    return `${base} bg-transparent h-20`
  }, [hasScrolled])

  const logoClasses = useMemo(() => {
    if (hasScrolled) {
      return 'h-8 w-auto transition-all duration-300'
    }
    return 'h-10 w-auto transition-all duration-300'
  }, [hasScrolled])

  const textClasses = useMemo(() => {
    if (hasScrolled) {
      return 'text-neutral-900'
    }
    return 'text-white'
  }, [hasScrolled])

  return (
    <header className={headerClasses} role="banner">
      <div className="container-custom">
        <div className="flex items-center justify-between h-full">
          {/* Premium Logo */}
          <Link 
            href="/" 
            className="flex items-center group" 
            aria-label="SX Locações - Mobilidade Urbana Inteligente"
          >
            <div className="relative">
              <Image
                src="/assets/logo-2.jpg"
                alt="SX Locações"
                width={120}
                height={40}
                className={logoClasses}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Navegação principal">
            {navigationItems.map((item, index) => (
              <a 
                key={item.href}
                href={item.href} 
                className={`relative font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg px-3 py-2 group ${textClasses}`}
                aria-label={`Navegar para ${item.label}`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Points Display */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover-lift interactive-card">
                  <Star className="text-yellow-400 fill-current animate-heartbeat" size={16} />
                  <span className={`text-sm font-semibold ${textClasses}`}>
                    {user?.points || 0}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full badge-bounce ${
                    user?.level === 'Platinum' ? 'bg-purple-500/20 text-purple-300' :
                    user?.level === 'Gold' ? 'bg-yellow-500/20 text-yellow-300' :
                    user?.level === 'Silver' ? 'bg-gray-500/20 text-gray-300' :
                    'bg-orange-500/20 text-orange-300'
                  }`}>
                    {user?.level || 'Bronze'}
                  </span>
                </div>

                {/* Notifications */}
                <button 
                  className={`p-2 rounded-lg focus-ring hover-lift animate-wiggle ${textClasses}`}
                  aria-label="Notificações"
                >
                  <Bell size={20} className="hover:animate-wiggle" />
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover-lift interactive-card">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
                    <User size={16} className="text-white" />
                  </div>
                  <span className={`text-sm font-medium ${textClasses}`}>
                    {user?.name?.split(' ')[0] || 'Usuário'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className={`text-xs opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110 focus-ring px-2 py-1 rounded ${textClasses}`}
                    aria-label="Sair da conta"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleLogin}
                  className={`font-medium focus-ring hover-lift px-4 py-2 rounded-lg ${textClasses}`}
                >
                  Entrar
                </button>
                <button className="btn-primary btn-ripple hover-glow">
                  Cadastrar
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden p-3 rounded-xl hover-lift focus-ring transition-all duration-300 ${textClasses}`}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 top-3' : 'top-1'
              }`}></span>
              <span className={`absolute block w-6 h-0.5 bg-current transition-all duration-300 top-3 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`absolute block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 top-3' : 'top-5'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-500 overflow-hidden z-50 ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass-card mx-4 my-4 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-lg">
            <nav className="p-6 space-y-3" role="navigation" aria-label="Menu móvel">
              {navigationItems.map((item, index) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="block text-neutral-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-primary/10 hover:text-primary focus-ring hover-lift animate-slide-up text-lg"
                  onClick={toggleMenu}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                </a>
              ))}
              
              <hr className="border-neutral-200/50" />
              
              {isLoggedIn ? (
                <div className="space-y-4">
                  {/* Mobile Points Display */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-lg">{user?.name}</p>
                          <p className="text-sm text-neutral-600 font-medium">{user?.level || 'Bronze'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 p-3 bg-white/60 rounded-xl">
                      <Star className="text-yellow-500 fill-current animate-heartbeat" size={20} />
                      <span className="font-bold text-neutral-900 text-xl">{user?.points || 0}</span>
                      <span className="text-neutral-600 font-medium">pontos</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-neutral-100 text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 py-4 px-6 rounded-2xl font-semibold text-lg hover-lift focus-ring"
                  >
                    Sair da Conta
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button 
                    onClick={handleLogin}
                    className="w-full text-primary font-semibold py-4 px-6 rounded-2xl hover:bg-primary/10 transition-all duration-300 text-lg hover-lift focus-ring border-2 border-primary/20"
                  >
                    Entrar na Conta
                  </button>
                  <button 
                    className="w-full btn-primary btn-ripple hover-glow justify-center text-lg py-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Criar Conta
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}