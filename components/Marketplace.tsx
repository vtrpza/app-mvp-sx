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
    
    try {
      await onRent?.(vehicle.id)
    } catch (error) {
      console.error('Rental failed:', error)
    }
  }, [onRent])

  return (
    <section id="marketplace" className="py-16 px-4 sm:px-6 lg:px-8" role="region" aria-labelledby="marketplace-heading">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2 id="marketplace-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-gradient">Marketplace</span> Integrado
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Alugue diversos tipos de veículos recreativos com segurança e praticidade
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8 animate-on-scroll">
          {/* ✅ Accessible filters sidebar */}
          <aside className="lg:col-span-1" role="complementary" aria-label="Filtros de busca">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
              
              {/* ✅ Accessible search */}
              <div className="mb-6">
                <label htmlFor="vehicle-search" className="sr-only">
                  Buscar veículos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
                  <input
                    id="vehicle-search"
                    type="text"
                    placeholder="Buscar veículos..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-describedby="search-help"
                  />
                  <div id="search-help" className="sr-only">
                    Digite para buscar veículos por nome ou descrição
                  </div>
                </div>
              </div>

              {/* ✅ Accessible categories */}
              <fieldset className="space-y-2">
                <legend className="sr-only">Categorias de veículos</legend>
                
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    selectedCategory === 'all' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-pressed={selectedCategory === 'all'}
                >
                  <Filter size={20} aria-hidden="true" />
                  Todos
                </button>
                
                {categories.map(category => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        selectedCategory === category.id 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-pressed={selectedCategory === category.id}
                    >
                      <Icon size={20} aria-hidden="true" />
                      {category.name}
                    </button>
                  )
                })}
              </fieldset>

              {/* Quick Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-primary" size={16} />
                  <span className="text-sm font-medium">Segurança Garantida</span>
                </div>
                <p className="text-xs text-gray-600">
                  Todos os veículos são verificados e possuem seguro obrigatório
                </p>
              </div>
            </div>
          </aside>

          {/* ✅ Accessible vehicles grid */}
          <main className="lg:col-span-3" role="main" aria-label="Lista de veículos">
            {isPending && (
              <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
                <div className="spinner" aria-label="Carregando veículos"></div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6" role="list">
              {filteredVehicles.map(vehicle => (
                <article 
                  key={vehicle.id} 
                  className="card"
                  role="listitem"
                >
                  {/* Vehicle Image */}
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-4xl" aria-hidden="true">
                        {vehicle.category === 'bikes' ? '🚴' : 
                         vehicle.category === 'jetski' ? '🏄' : 
                         vehicle.category === 'boats' ? '⛵' : '🚗'}
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {vehicle.available ? 'Disponível' : 'Indisponível'}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-6">
                    <header className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-current" size={16} aria-hidden="true" />
                        <span className="text-sm text-gray-600" aria-label={`Avaliação: ${vehicle.rating} de 5 estrelas`}>
                          {vehicle.rating}
                        </span>
                      </div>
                    </header>
                    
                    <p className="text-gray-600 text-sm mb-4">{vehicle.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        {vehicle.location}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        Disponível 24h
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vehicle.features.map(feature => (
                        <span 
                          key={feature}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary" aria-label={`Preço: ${vehicle.price} reais por hora`}>
                          R$ {vehicle.price}
                        </span>
                        <span className="text-gray-600 text-sm">/hora</span>
                      </div>
                      
                      <button
                        onClick={() => handleRent(vehicle)}
                        disabled={!vehicle.available}
                        className={`btn-primary ${!vehicle.available && 'opacity-50 cursor-not-allowed'}`}
                        aria-label={`Alugar ${vehicle.name}`}
                      >
                        {vehicle.available ? 'Alugar' : 'Indisponível'}
                      </button>
                    </div>

                    {/* Requirements */}
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">Requisitos:</h4>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        {vehicle.requirements.map(req => (
                          <li key={req}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredVehicles.length === 0 && !isPending && (
              <div className="text-center py-12" role="status">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" aria-hidden="true" />
                </div>
                <p className="text-gray-600">Nenhum veículo encontrado para sua busca.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}