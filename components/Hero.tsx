'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { ArrowRight, Play, MapPin, Clock, Star, Zap, Users, Award, ChevronDown, User, X } from 'lucide-react'
import { useScrollAnimation, useCountUpAnimation } from '@/hooks/useScrollAnimation'

interface HeroProps {
  stats?: {
    scooters: number
    availability: string
    rating: number
    cities: number
    users: number
  }
}

const defaultStats = {
  scooters: 500,
  availability: '24h',
  rating: 4.9,
  cities: 15,
  users: 2500
}

export default function Hero({ stats = defaultStats }: HeroProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation()
  
  const words = ['Inteligente', 'Sustentável', 'Conectada', 'Inovadora']
  
  // Animated counters
  const animatedScooters = useCountUpAnimation(stats.scooters, statsVisible, 2000)
  const animatedUsers = useCountUpAnimation(stats.users, statsVisible, 2500)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  const playVideo = useCallback(() => setIsVideoPlaying(true), [])
  
  const quickStats = useMemo(() => [
    { 
      value: `${animatedScooters}+`, 
      label: 'Veículos',
      icon: MapPin,
      color: 'text-blue-400'
    },
    { 
      value: stats.availability, 
      label: 'Disponível',
      icon: Clock,
      color: 'text-green-400'
    },
    { 
      value: `${stats.rating}★`, 
      label: 'Avaliação',
      icon: Star,
      color: 'text-yellow-400'
    },
    { 
      value: `${animatedUsers}+`, 
      label: 'Usuários',
      icon: Users,
      color: 'text-purple-400'
    }
  ], [animatedScooters, animatedUsers, stats.availability, stats.rating])

  const scrollToSection = useCallback(() => {
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <main>
      <section 
        id="home" 
        className="relative min-h-screen gradient-bg-hero overflow-hidden"
        role="banner"
        aria-label="Apresentação principal - SX Locações"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-20" aria-hidden="true"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-40 w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen pt-20 pb-8">
            
            {/* Content Side */}
            <div className="text-white space-y-6 lg:space-y-8 animate-slide-right px-4 lg:px-0" role="main">
              
              {/* Main Headline */}
              <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in">
                  <Award className="text-yellow-400" size={16} />
                  <span className="text-sm font-medium">Sistema Ponto X Disponível</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
                  <span className="sr-only">SX Locações - </span>
                  Mobilidade Urbana
                  <br />
                  <span 
                    className="text-yellow-300 transition-all duration-500 inline-block"
                    key={currentWord}
                  >
                    {words[currentWord]}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed animate-slide-up animate-stagger-1 text-center lg:text-left">
                  Descubra a cidade de forma <strong className="text-yellow-200">sustentável</strong> e <strong className="text-yellow-200">inteligente</strong>. 
                  Alugue veículos, ganhe pontos e explore pontos turísticos únicos.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-stagger-2 px-4 lg:px-0">
                <button 
                  className="btn-primary btn-ripple hover-glow group w-full sm:w-auto text-lg py-4 px-8"
                  onClick={scrollToSection}
                  aria-label="Explorar veículos disponíveis"
                >
                  Explorar Veículos
                  <ArrowRight size={20} className="group-hover:translate-x-1 group-hover:animate-heartbeat transition-all duration-300" />
                </button>
                
                <button 
                  className="btn-secondary hover-lift group focus-ring w-full sm:w-auto text-lg py-4 px-8"
                  onClick={playVideo}
                  aria-label="Assistir vídeo explicativo"
                >
                  <Play size={20} className="group-hover:scale-110 group-hover:animate-pulse transition-all duration-300" />
                  Como Funciona
                </button>
              </div>

              {/* Stats Grid */}
              <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-6 lg:pt-8 animate-slide-up animate-stagger-3 px-4 lg:px-0" role="region" aria-label="Estatísticas do serviço">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div 
                      key={index} 
                      className="group cursor-pointer interactive-card hover-tilt"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105 hover-glow">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`${stat.color} transition-all duration-300 group-hover:animate-wiggle`} size={20} />
                          <div className="text-2xl font-bold group-hover:animate-rubber-band" aria-label={`${stat.value} ${stat.label}`}>
                            {stat.value}
                          </div>
                        </div>
                        <div className="text-sm text-white font-medium">{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-slide-up animate-stagger-4 px-4 lg:px-0 text-center lg:text-left">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full border-2 border-white flex items-center justify-center animate-glow">
                      <User size={18} className="text-white" />
                    </div>
                  ))}
                </div>
                <div className="text-white">
                  <div className="font-bold text-lg">2500+ usuários ativos</div>
                  <div className="text-sm text-white">Já estão usando o Ponto X</div>
                </div>
              </div>
            </div>

            {/* Visual Side */}
            <div className="relative animate-slide-up animate-stagger-2 px-4 lg:px-0 order-first lg:order-last w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
              
              {/* Main Visual Container */}
              <div className="relative">
                
                {/* Glassmorphism Card */}
                <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/20 shadow-2xl w-full">
                  
                  {/* Mock App Interface */}
                  <div className="bg-white/95 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                          <Zap className="text-white" size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-800 text-sm sm:text-base">SX Locações</div>
                          <div className="text-xs sm:text-sm text-neutral-600">Bem-vindo de volta!</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full">
                        <Star className="text-yellow-500 fill-current" size={12} />
                        <span className="font-bold text-neutral-800 text-sm">2,450</span>
                      </div>
                    </div>
                    
                    {/* Map Mockup */}
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="text-xs sm:text-sm font-medium text-neutral-700">Veículos Próximos</div>
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">3 disponíveis</div>
                        </div>
                        <div className="space-y-2">
                          {['Patinete Elétrico', 'Bike Urbana', 'E-Scooter Pro'].map((vehicle, i) => (
                            <div key={i} className="flex items-center justify-between p-2 sm:p-3 bg-white/80 rounded-lg">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                  <MapPin size={12} className="text-primary" />
                                </div>
                                <div>
                                  <div className="text-xs sm:text-sm font-medium text-neutral-800">{vehicle}</div>
                                  <div className="text-xs text-neutral-600">2 min • 150m</div>
                                </div>
                              </div>
                              <div className="text-xs sm:text-sm font-bold text-primary">R$ 5/h</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] btn-ripple hover-glow animate-glow">
                      Alugar Agora
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse-soft"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-green-400/20 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
            <button 
              onClick={scrollToSection}
              className="flex flex-col items-center gap-2 text-white hover:text-yellow-200 transition-colors"
              aria-label="Rolar para baixo"
            >
              <span className="text-sm font-medium">Explorar</span>
              <ChevronDown size={24} />
            </button>
          </div>
        </div>

        {/* Video Modal */}
        {isVideoPlaying && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                aria-label="Fechar vídeo"
              >
                <X size={32} />
              </button>
              <div className="aspect-video bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600">Vídeo explicativo em breve</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}