'use client'

import { useState, useCallback, useMemo, useTransition } from 'react'
import { 
  Bike, 
  Waves, 
  Ship, 
  Car, 
  Filter, 
  Search, 
  Star,
  MapPin,
  Clock,
  Shield,
  CreditCard
} from 'lucide-react'
import RentalChoiceModal from './RentalChoiceModal'
import QuickRegisterModal from './QuickRegisterModal'
import { Vehicle } from '@/types'

// ✅ Input validation utilities
const sanitizeSearchTerm = (term: string): string => {
  return term.replace(/[<>]/g, '').trim().slice(0, 50)
}

const validateVehicleData = (vehicle: any): boolean => {
  return vehicle && 
         typeof vehicle.id === 'number' && 
         typeof vehicle.name === 'string' && 
         typeof vehicle.price === 'number' &&
         vehicle.price > 0
}

interface MarketplaceProps {
  vehicles?: typeof mockVehicles
  onRent?: (vehicleId: number) => Promise<void>
}

const categories = [
  { id: 'bikes', name: 'Bikes', icon: Bike, color: 'bg-blue-100 text-blue-600' },
  { id: 'jetski', name: 'Jet Ski', icon: Waves, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'boats', name: 'Lanchas', icon: Ship, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'others', name: 'Outros', icon: Car, color: 'bg-purple-100 text-purple-600' }
]

const mockVehicles = [
  {
    id: 1,
    category: 'bikes',
    name: 'Bike Elétrica Urbana',
    description: 'Perfeita para cidade, autonomia 40km',
    price: 15,
    rating: 4.8,
    image: '/api/placeholder/300/200',
    location: 'Centro - SP',
    available: true,
    requirements: ['Idade mínima: 18 anos', 'Documento com foto'],
    features: ['Elétrica', 'GPS', 'Antifurto']
  },
  {
    id: 2,
    category: 'jetski',
    name: 'Jet Ski Yamaha VX',
    description: 'Diversão garantida nas águas',
    price: 120,
    rating: 4.9,
    image: '/api/placeholder/300/200',
    location: 'Guarujá - SP',
    available: true,
    requirements: ['CNH Náutica', 'Idade mínima: 21 anos', 'Seguro obrigatório'],
    features: ['1100cc', 'GPS Aquático', 'Colete salva-vidas']
  },
  {
    id: 3,
    category: 'boats',
    name: 'Lancha Focker 215',
    description: 'Para até 8 pessoas, ideal para família',
    price: 300,
    rating: 4.7,
    image: '/api/placeholder/300/200',
    location: 'Angra dos Reis - RJ',
    available: false,
    requirements: ['Habilitação Náutica', 'Idade mínima: 25 anos', 'Caução'],
    features: ['8 pessoas', 'Churrasqueira', 'Som Bluetooth']
  },
  {
    id: 4,
    category: 'bikes',
    name: 'Mountain Bike Pro',
    description: 'Para trilhas e aventuras',
    price: 25,
    rating: 4.6,
    image: '/api/placeholder/300/200',
    location: 'Campos do Jordão - SP',
    available: true,
    requirements: ['Idade mínima: 16 anos', 'Documento com foto'],
    features: ['21 marchas', 'Suspensão', 'Capacete incluso']
  }
]

export default function Marketplace({ vehicles = mockVehicles, onRent }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()
  const [selectedVehicle, setSelectedVehicle] = useState<typeof mockVehicles[0] | null>(null)
  const [showChoiceModal, setShowChoiceModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // ✅ Memoized and optimized filtering
  const filteredVehicles = useMemo(() => {
    if (!vehicles.length) return []
    
    const sanitizedSearch = sanitizeSearchTerm(searchTerm.toLowerCase())
    
    return vehicles.filter(vehicle => {
      if (!validateVehicleData(vehicle)) return false
      
      const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory
      const matchesSearch = !sanitizedSearch || 
        vehicle.name.toLowerCase().includes(sanitizedSearch) ||
        vehicle.description.toLowerCase().includes(sanitizedSearch)
      
      return matchesCategory && matchesSearch
    })
  }, [vehicles, selectedCategory, searchTerm])
  
  // ✅ Secure search handler
  const handleSearch = useCallback((value: string) => {
    startTransition(() => {
      setSearchTerm(sanitizeSearchTerm(value))
    })
  }, [])
  
  // ✅ Secure rental handler
  const handleRent = useCallback(async (vehicle: typeof mockVehicles[0]) => {
    if (!validateVehicleData(vehicle) || !vehicle.available) {
      console.error('Invalid vehicle data or unavailable')
      return
    }
    
    setSelectedVehicle(vehicle)
    setShowChoiceModal(true)
  }, [])

  const handleRegisterChoice = useCallback(() => {
    setShowChoiceModal(false)
    setShowRegisterModal(true)
  }, [])

  const handleWhatsAppChoice = useCallback(() => {
    // Analytics tracking could go here
    console.log('User chose WhatsApp direct contact')
  }, [])

  const handleRegistrationSuccess = useCallback((user: any) => {
    setCurrentUser(user)
    setShowRegisterModal(false)
    // Show success message or redirect
    alert(`Parabéns ${user.name}! Você ganhou 100 pontos de boas-vindas!`)
  }, [])

  return (
    <section id="marketplace" className="section-padding bg-white" role="region" aria-labelledby="marketplace-heading">
      <div className="container-custom">
        <header className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6">
            <CreditCard className="text-primary" size={16} />
            <span className="text-sm font-medium text-primary">Marketplace Premium</span>
          </div>
          <h2 id="marketplace-heading" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 text-balance">
            Veículos <span className="text-gradient">Recreativos</span> para Todos
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto text-balance">
            Explore nossa seleção premium de veículos com segurança garantida e processo simplificado
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8 animate-slide-up animate-stagger-1">
          {/* Premium Filters Sidebar */}
          <aside className="lg:col-span-1" role="complementary" aria-label="Filtros de busca">
            <div className="card sticky top-24">
              <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                Filtros
              </h3>
              
              {/* Premium Search */}
              <div className="mb-8">
                <label htmlFor="vehicle-search" className="sr-only">
                  Buscar veículos
                </label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={20} aria-hidden="true" />
                  <input
                    id="vehicle-search"
                    type="text"
                    placeholder="Buscar veículos..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-neutral-50 focus:bg-white"
                    aria-describedby="search-help"
                  />
                  <div id="search-help" className="sr-only">
                    Digite para buscar veículos por nome ou descrição
                  </div>
                </div>
              </div>

              {/* Premium Categories */}
              <fieldset className="space-y-3 mb-8">
                <legend className="sr-only">Categorias de veículos</legend>
                
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 group ${
                    selectedCategory === 'all' 
                      ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg scale-[1.02]' 
                      : 'text-neutral-700 hover:bg-primary/5 hover:scale-[1.02]'
                  }`}
                  aria-pressed={selectedCategory === 'all'}
                >
                  <div className={`p-2 rounded-xl transition-all ${
                    selectedCategory === 'all' 
                      ? 'bg-white/20' 
                      : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                    <Filter size={20} aria-hidden="true" />
                  </div>
                  <span className="font-medium">Todos</span>
                  {selectedCategory === 'all' && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
                
                {categories.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 group ${
                        selectedCategory === category.id 
                          ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg scale-[1.02]' 
                          : 'text-neutral-700 hover:bg-primary/5 hover:scale-[1.02]'
                      }`}
                      aria-pressed={selectedCategory === category.id}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`p-2 rounded-xl transition-all ${
                        selectedCategory === category.id 
                          ? 'bg-white/20' 
                          : 'bg-primary/10 group-hover:bg-primary/20'
                      }`}>
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                      {selectedCategory === category.id && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </fieldset>

              {/* Premium Info Card */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Shield className="text-primary" size={18} />
                  </div>
                  <span className="font-bold text-neutral-900">Segurança Premium</span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Veículos verificados, seguro obrigatório e suporte 24h garantido
                </p>
              </div>
            </div>
          </aside>

          {/* Premium Vehicles Grid */}
          <main className="lg:col-span-3 animate-slide-up animate-stagger-2" role="main" aria-label="Lista de veículos">
            {isPending && (
              <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" aria-label="Carregando veículos"></div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-8" role="list">
              {filteredVehicles.map((vehicle, index) => (
                <article 
                  key={vehicle.id} 
                  className="card-vehicle group"
                  role="listitem"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Premium Vehicle Image */}
                  <div className="h-56 bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                        {vehicle.category === 'bikes' ? '🚴' : 
                         vehicle.category === 'jetski' ? '🏄' : 
                         vehicle.category === 'boats' ? '⛵' : '🚗'}
                      </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Premium Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-2 rounded-full text-xs font-bold backdrop-blur-sm border ${
                      vehicle.available 
                        ? 'bg-green-100/90 text-green-700 border-green-200' 
                        : 'bg-red-100/90 text-red-700 border-red-200'
                    }`}>
                      {vehicle.available ? '✓ Disponível' : '⏸ Indisponível'}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/20">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="text-xs font-bold text-neutral-800">{vehicle.rating}</span>
                    </div>
                  </div>

                  {/* Premium Vehicle Info */}
                  <div className="p-6">
                    <header className="mb-4">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                        {vehicle.name}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">{vehicle.description}</p>
                    </header>
                    
                    {/* Location & Availability */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin size={16} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Local</div>
                          <div className="text-sm font-semibold text-neutral-800">{vehicle.location}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                        <div className="p-2 bg-secondary/10 rounded-lg">
                          <Clock size={16} className="text-secondary" />
                        </div>
                        <div>
                          <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Horário</div>
                          <div className="text-sm font-semibold text-neutral-800">24h</div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                        Recursos Inclusos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.map(feature => (
                          <span 
                            key={feature}
                            className="px-3 py-2 bg-primary/5 text-primary text-xs font-medium rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Premium Price Section */}
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 mb-6 border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-1">Preço por hora</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gradient" aria-label={`Preço: ${vehicle.price} reais por hora`}>
                              R$ {vehicle.price}
                            </span>
                            <span className="text-neutral-600 text-sm">/h</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRent(vehicle)}
                          disabled={!vehicle.available}
                          className={`btn-primary btn-ripple hover-glow group ${!vehicle.available && 'opacity-50 cursor-not-allowed'}`}
                          aria-label={`Alugar ${vehicle.name}`}
                        >
                          <span>{vehicle.available ? 'Alugar Agora' : 'Indisponível'}</span>
                          {vehicle.available && (
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:animate-tada transition-all duration-300">
                              <CreditCard size={12} className="text-white animate-heartbeat" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Premium Requirements */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                      <h4 className="text-sm font-bold text-yellow-800 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        Requisitos Necessários
                      </h4>
                      <ul className="space-y-2">
                        {vehicle.requirements.map(req => (
                          <li key={req} className="flex items-start gap-2 text-sm text-yellow-700">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredVehicles.length === 0 && !isPending && (
              <div className="text-center py-16" role="status">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Nenhum veículo encontrado</h3>
                <p className="text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Ajuste seus filtros ou tente uma busca diferente para encontrar o veículo perfeito
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Modals */}
        <RentalChoiceModal
          isOpen={showChoiceModal}
          onClose={() => setShowChoiceModal(false)}
          vehicle={selectedVehicle as Vehicle}
          onRegisterChoice={handleRegisterChoice}
          onWhatsAppChoice={handleWhatsAppChoice}
        />

        <QuickRegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleRegistrationSuccess}
        />
      </div>
    </section>
  )
}