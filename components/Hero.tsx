'use client'

import { useState, useCallback, useMemo } from 'react'
import { Play, MapPin, Clock, Shield, Star } from 'lucide-react'

interface HeroProps {
  stats?: {
    scooters: number
    availability: string
    rating: number
    cities: number
  }
}

const defaultStats = {
  scooters: 500,
  availability: '24h',
  rating: 5,
  cities: 15
}

export default function Hero({ stats = defaultStats }: HeroProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  
  // ✅ Memoized callback for performance
  const playVideo = useCallback(() => setIsVideoPlaying(true), [])
  
  // ✅ Memoized stats for performance
  const quickStats = useMemo(() => [
    { value: `${stats.scooters}+`, label: 'Patinetes' },
    { value: stats.availability, label: 'Disponível' },
    { value: `${stats.rating}★`, label: 'Avaliação' },
    { value: stats.cities, label: 'Cidades' }
  ], [stats])

  return (
    <main>
      <section 
        id="home" 
        className="relative min-h-screen pt-16 gradient-bg overflow-hidden"
        role="banner"
        aria-label="Apresentação principal - SX Locações"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Content */}
            <div className="text-white space-y-8 animate-fade-in" role="main">
              <header className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="sr-only">SX Locações - </span>
                  Mobilidade
                  <br />
                  <span className="text-yellow-300">Urbana</span>
                  <br />
                  Sustentável
                </h1>
                
                <p className="text-lg md:text-xl text-white/90 max-w-lg">
                  Alugue patinetes, bikes e veículos recreativos de forma rápida e segura. 
                  Explore a cidade com liberdade e sustentabilidade.
                </p>
              </header>

              {/* ✅ Accessible statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="region" aria-label="Estatísticas do serviço">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold" aria-label={`${stat.value} ${stat.label}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* ✅ Accessible action buttons */}
              <div className="flex flex-col sm:flex-row gap-4" role="group" aria-label="Ações principais">
                <button 
                  className="btn-primary"
                  aria-label="Iniciar processo de aluguel"
                >
                  Alugar Agora
                </button>
                <button 
                  onClick={playVideo}
                  className="btn-outline"
                  aria-label="Assistir vídeo explicativo sobre como funciona"
                >
                  <Play size={20} aria-hidden="true" />
                  Como Funciona
                </button>
              </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="text-yellow-300" size={20} />
                <span className="text-sm">Seguro e Confiável</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-300" size={20} />
                <span className="text-sm">Disponível 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-300" size={20} />
                <span className="text-sm">Avaliado 5★</span>
              </div>
            </div>
          </div>

          {/* ✅ Accessible visual content */}
          <div className="relative animate-slide-up" role="complementary" aria-label="Demonstração visual do aplicativo">
            {!isVideoPlaying ? (
              <div className="relative">
                {/* Mock App Screenshot */}
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                    <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                    <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                        <div className="p-6 pt-8 h-full">
                            {/* Mock App Interface */}
                            <div className="space-y-6">
                                <header className="text-center">
                                    <h2 className="text-lg font-semibold text-gray-800">Encontre Patinetes</h2>
                                    <p className="text-sm text-gray-600">Próximos a você</p>
                                </header>
                                
                                {/* Mock Map */}
                                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center" role="img" aria-label="Mapa mostrando localização de patinetes">
                                    <MapPin className="text-primary" size={48} aria-hidden="true" />
                                </div>
                                
                                {/* Mock Scooter List */}
                                <div className="space-y-3" role="list" aria-label="Lista de patinetes disponíveis">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" role="listitem">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-full" aria-hidden="true"></div>
                                            <div>
                                                <div className="text-sm font-medium">SX-001</div>
                                                <div className="text-xs text-gray-600">50m de distância</div>
                                            </div>
                                        </div>
                                        <button className="text-primary text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm px-2 py-1">
                                            Reservar
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" role="listitem">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-full" aria-hidden="true"></div>
                                            <div>
                                                <div className="text-sm font-medium">SX-002</div>
                                                <div className="text-xs text-gray-600">120m de distância</div>
                                            </div>
                                        </div>
                                        <button className="text-primary text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm px-2 py-1">
                                            Reservar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">🚀</span>
                </div>
              </div>
            ) : (
              <div className="relative mx-auto w-80 h-[600px] bg-black rounded-3xl shadow-2xl overflow-hidden">
                {/* Mock Video Player */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <Play size={48} className="mx-auto mb-4" />
                    <p>Vídeo: Como usar a SX Locações</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* ✅ Accessible scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce" role="button" aria-label="Rolar para baixo para ver mais conteúdo">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>
    </main>
  )
}
