'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  Leaf, 
  Star,
  Camera,
  Coffee,
  Mountain,
  Building,
  Waves
} from 'lucide-react'

// ✅ TypeScript interfaces for better type safety
interface Attraction {
  id: number
  name: string
  type: string
  icon: React.ElementType
  distance: string
  time: string
  cost: string
  sustainableCost: string
  rating: number
  description: string
  suggestedTransport: string
  image: string
}

interface TransportOption {
  id: string
  name: string
  icon: string
  eco: number
  cost: number
}

interface TouristGuideProps {
  attractions?: Attraction[]
  transportOptions?: TransportOption[]
  onGetDirections?: (attraction: Attraction) => Promise<void>
  onCheckIn?: (attraction: Attraction) => Promise<void>
}

const defaultAttractions: Attraction[] = [
  {
    id: 1,
    name: 'Parque Ibirapuera',
    type: 'Parque',
    icon: Mountain,
    distance: '1.2 km',
    time: '15 min',
    cost: 'R$ 3,50',
    sustainableCost: 'R$ 2,10',
    rating: 4.8,
    description: 'Maior parque urbano da cidade',
    suggestedTransport: 'Bike elétrica',
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    name: 'Mercado Municipal',
    type: 'Gastronomia',
    icon: Coffee,
    distance: '2.5 km',
    time: '25 min',
    cost: 'R$ 8,00',
    sustainableCost: 'R$ 4,50',
    rating: 4.6,
    description: 'Gastronomia tradicional paulistana',
    suggestedTransport: 'Patinete elétrico',
    image: '/api/placeholder/300/200'
  },
  {
    id: 3,
    name: 'Museu de Arte Moderna',
    type: 'Cultura',
    icon: Building,
    distance: '3.1 km',
    time: '30 min',
    cost: 'R$ 12,00',
    sustainableCost: 'R$ 6,20',
    rating: 4.7,
    description: 'Arte contemporânea brasileira',
    suggestedTransport: 'Bike + Metrô',
    image: '/api/placeholder/300/200'
  },
  {
    id: 4,
    name: 'Praia de Copacabana',
    type: 'Praia',
    icon: Waves,
    distance: '15 km',
    time: '45 min',
    cost: 'R$ 25,00',
    sustainableCost: 'R$ 12,50',
    rating: 4.9,
    description: 'Praia mais famosa do Brasil',
    suggestedTransport: 'Bike elétrica + VLT',
    image: '/api/placeholder/300/200'
  }
]

const defaultTransportOptions: TransportOption[] = [
  { id: 'walking', name: 'Caminhada', icon: '🚶', eco: 100, cost: 0 },
  { id: 'bike', name: 'Bike', icon: '🚴', eco: 95, cost: 5 },
  { id: 'scooter', name: 'Patinete', icon: '🛴', eco: 90, cost: 8 },
  { id: 'public', name: 'Transporte Público', icon: '🚌', eco: 85, cost: 4 },
  { id: 'taxi', name: 'Táxi', icon: '🚕', eco: 30, cost: 15 }
]

export default function TouristGuide({ 
  attractions = defaultAttractions, 
  transportOptions = defaultTransportOptions,
  onGetDirections,
  onCheckIn
}: TouristGuideProps) {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [selectedTransport, setSelectedTransport] = useState('bike')
  const [routeMode, setRouteMode] = useState<'fastest' | 'cheapest' | 'sustainable'>('sustainable')

  // ✅ Memoized selected transport option
  const selectedTransportOption = useMemo(() => 
    transportOptions.find(t => t.id === selectedTransport),
    [transportOptions, selectedTransport]
  )

  // ✅ Memoized route mode options
  const routeModeOptions = useMemo(() => [
    { id: 'fastest', label: 'Mais Rápida', icon: Clock },
    { id: 'cheapest', label: 'Mais Barata', icon: DollarSign },
    { id: 'sustainable', label: 'Mais Sustentável', icon: Leaf }
  ], [])

  // ✅ Secure directions handler
  const handleGetDirections = useCallback(async (attraction: Attraction) => {
    try {
      if (onGetDirections) {
        await onGetDirections(attraction)
      } else {
        // ✅ Fallback for demo/development
        alert(`Iniciando navegação para ${attraction.name} via ${attraction.suggestedTransport}`)
      }
    } catch (error) {
      console.error('Navigation failed:', error)
      alert('Erro ao iniciar navegação. Tente novamente.')
    }
  }, [onGetDirections])

  // ✅ Secure check-in handler
  const handleCheckIn = useCallback(async (attraction: Attraction) => {
    try {
      if (onCheckIn) {
        await onCheckIn(attraction)
      } else {
        // ✅ Fallback for demo/development
        alert(`Check-in realizado em ${attraction.name}! +50 pontos XP`)
      }
    } catch (error) {
      console.error('Check-in failed:', error)
      alert('Erro no check-in. Tente novamente.')
    }
  }, [onCheckIn])

  // ✅ Route mode selection handler
  const handleRouteMode = useCallback((mode: 'fastest' | 'cheapest' | 'sustainable') => {
    setRouteMode(mode)
  }, [])

  // ✅ Transport selection handler
  const handleTransportSelect = useCallback((transportId: string) => {
    setSelectedTransport(transportId)
  }, [])

  return (
    <section id="guide" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" role="region" aria-labelledby="guide-heading">
      <div className="container-custom">
        <header className="text-center mb-16">
          <h2 id="guide-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-gradient">Guia Turístico</span> Digital
          </h2>
          <p className="text-lg text-gray-600 text-center">
            Descubra os melhores pontos turísticos com rotas otimizadas e sustentáveis
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 animate-on-scroll">
          {/* ✅ Accessible route options sidebar */}
          <aside className="lg:col-span-1" role="complementary" aria-label="Opções de rota">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Tipo de Rota</h3>
              
              {/* ✅ Accessible route mode selection */}
              <fieldset className="space-y-3 mb-6">
                <legend className="sr-only">Selecione o tipo de rota</legend>
                {routeModeOptions.map(option => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleRouteMode(option.id as 'fastest' | 'cheapest' | 'sustainable')}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        routeMode === option.id
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-pressed={routeMode === option.id}
                      aria-label={`Selecionar rota ${option.label.toLowerCase()}`}
                    >
                      <Icon size={20} aria-hidden="true" />
                      {option.label}
                    </button>
                  )
                })}
              </fieldset>

              {/* ✅ Accessible transport options */}
              <h4 className="font-medium text-gray-900 mb-3">Transporte</h4>
              <fieldset className="space-y-2">
                <legend className="sr-only">Selecione o meio de transporte</legend>
                {transportOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleTransportSelect(option.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      selectedTransport === option.id
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-pressed={selectedTransport === option.id}
                    aria-label={`Selecionar ${option.name}, custa R$ ${option.cost}, ${option.eco}% ecológico`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden="true">{option.icon}</span>
                      <span className="text-sm">{option.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs">R$ {option.cost}</div>
                      <div className="text-xs opacity-75">{option.eco}% eco</div>
                    </div>
                  </button>
                ))}
              </fieldset>

              {/* ✅ Accessible sustainability score */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg" role="status" aria-live="polite">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="text-green-600" size={16} aria-hidden="true" />
                  <span className="text-sm font-medium text-green-800">Impacto Ambiental</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={selectedTransportOption?.eco || 0}>
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedTransportOption?.eco || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {selectedTransportOption?.eco || 0}% sustentável
                </p>
              </div>
            </div>
          </aside>

          {/* ✅ Accessible attractions grid */}
          <main className="lg:col-span-2" role="main" aria-label="Pontos turísticos">
            <div className="grid md:grid-cols-2 gap-6" role="list">
              {attractions.map(attraction => {
                const Icon = attraction.icon
                return (
                  <article 
                    key={attraction.id} 
                    className="card"
                    role="listitem"
                  >
                    {/* ✅ Accessible attraction image */}
                    <div className="h-48 bg-gray-200 relative" role="img" aria-label={`Imagem de ${attraction.name}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Icon size={48} className="text-primary" aria-hidden="true" />
                      </div>
                      
                      {/* ✅ Accessible rating */}
                      <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="text-yellow-400 fill-current" size={14} aria-hidden="true" />
                        <span className="text-sm font-medium" aria-label={`Avaliação: ${attraction.rating} de 5 estrelas`}>
                          {attraction.rating}
                        </span>
                      </div>
                      
                      {/* ✅ Accessible type badge */}
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium" aria-label={`Categoria: ${attraction.type}`}>
                        {attraction.type}
                      </div>
                    </div>

                    {/* ✅ Accessible attraction info */}
                    <div className="p-6">
                      <header className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{attraction.name}</h3>
                        <p className="text-gray-600 text-sm">{attraction.description}</p>
                      </header>
                      
                      {/* ✅ Accessible distance & time */}
                      <div className="flex items-center gap-4 mb-4" role="group" aria-label="Informações de distância e tempo">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={16} aria-hidden="true" />
                          <span aria-label={`Distância: ${attraction.distance}`}>{attraction.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock size={16} aria-hidden="true" />
                          <span aria-label={`Tempo estimado: ${attraction.time}`}>{attraction.time}</span>
                        </div>
                      </div>

                      {/* ✅ Accessible costs */}
                      <div className="grid grid-cols-2 gap-4 mb-4" role="group" aria-label="Comparação de custos">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Custo Normal</div>
                          <div className="font-semibold text-gray-900" aria-label={`Custo normal: ${attraction.cost}`}>
                            {attraction.cost}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-600">Sustentável</div>
                          <div className="font-semibold text-green-700" aria-label={`Custo sustentável: ${attraction.sustainableCost}`}>
                            {attraction.sustainableCost}
                          </div>
                        </div>
                      </div>

                      {/* ✅ Accessible suggested transport */}
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg" role="complementary" aria-label="Sugestão de transporte">
                        <div className="text-sm text-blue-600 mb-1">Transporte sugerido:</div>
                        <div className="font-medium text-blue-800">{attraction.suggestedTransport}</div>
                      </div>

                      {/* ✅ Accessible actions */}
                      <div className="flex gap-2" role="group" aria-label="Ações disponíveis">
                        <button
                          onClick={() => handleGetDirections(attraction)}
                          className="flex-1 btn-primary"
                          aria-label={`Obter direções para ${attraction.name}`}
                        >
                          <Navigation size={16} className="inline mr-2" aria-hidden="true" />
                          Ir Agora
                        </button>
                        <button
                          onClick={() => handleCheckIn(attraction)}
                          className="btn-outline"
                          aria-label={`Fazer check-in em ${attraction.name}`}
                        >
                          <Camera size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* ✅ Accessible route summary */}
            <aside className="mt-8 bg-white rounded-xl p-6 shadow-lg" role="complementary" aria-labelledby="route-summary-heading">
              <h3 id="route-summary-heading" className="font-semibold text-gray-900 mb-4">Resumo da Rota</h3>
              <div className="grid md:grid-cols-4 gap-4" role="group" aria-label="Estatísticas da rota">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary" aria-label="4 pontos turísticos">4</div>
                  <div className="text-sm text-gray-600">Pontos Turísticos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary" aria-label="22 quilômetros de distância total">22 km</div>
                  <div className="text-sm text-gray-600">Distância Total</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary" aria-label="1 hora e 55 minutos de tempo estimado">1h 55min</div>
                  <div className="text-sm text-gray-600">Tempo Estimado</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600" aria-label="R$ 25,30 de economia sustentável">R$ 25,30</div>
                  <div className="text-sm text-green-600">Economia Sustentável</div>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </section>
  )
}