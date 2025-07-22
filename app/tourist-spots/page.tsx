'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  CheckCircle,
  ArrowLeft,
  Trophy,
  Target,
  Search,
  Filter
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import AuthGuard, { useAuth } from '@/components/AuthGuard'
import CheckInModal from '@/components/CheckInModal'

interface TouristSpot {
  id: string
  name: string
  description: string
  type: string
  coordinates: {
    latitude: number
    longitude: number
  }
  rating: number
  image: string
  openingHours?: string
  admissionFee?: number
  website?: string
  checkinPoints: number
  createdAt: string
}

function TouristSpotsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [spots, setSpots] = useState<TouristSpot[]>([])
  const [filteredSpots, setFilteredSpots] = useState<TouristSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [checkinModal, setCheckinModal] = useState<{ isOpen: boolean; spot?: TouristSpot }>({
    isOpen: false
  })
  const [checkedInSpots, setCheckedInSpots] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadTouristSpots()
    checkTodayCheckins()
  }, [])

  useEffect(() => {
    filterSpots()
  }, [spots, searchTerm, selectedType])

  const loadTouristSpots = async () => {
    try {
      const spotsData = await mockDatabase.touristSpots.getAll()
      setSpots(spotsData)
      setFilteredSpots(spotsData)
    } catch (error) {
      console.error('Error loading tourist spots:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkTodayCheckins = () => {
    if (!user) return

    const checkins = JSON.parse(localStorage.getItem('sx_checkins') || '[]')
    const today = new Date().toDateString()
    const todayCheckins = checkins.filter((c: any) => 
      c.userId === user.id && 
      new Date(c.timestamp).toDateString() === today
    )
    
    const checkedInSpotIds = new Set<string>(todayCheckins.map((c: any) => c.locationId))
    setCheckedInSpots(checkedInSpotIds)
  }

  const filterSpots = () => {
    let filtered = spots

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(spot => spot.type === selectedType)
    }

    setFilteredSpots(filtered)
  }

  const handleCheckIn = (spot: TouristSpot) => {
    setCheckinModal({ isOpen: true, spot })
  }

  const handleCheckInSuccess = (result: any) => {
    // Update checked in spots
    const newCheckedInSpots = new Set(checkedInSpots)
    newCheckedInSpots.add(result.checkin.locationId)
    setCheckedInSpots(newCheckedInSpots)
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'parque': return 'bg-green-100 text-green-800'
      case 'museu': return 'bg-purple-100 text-purple-800'
      case 'restaurante': return 'bg-orange-100 text-orange-800'
      case 'praia': return 'bg-blue-100 text-blue-800'
      case 'monumento': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'parque': return '🌳'
      case 'museu': return '🏛️'
      case 'restaurante': return '🍽️'
      case 'praia': return '🏖️'
      case 'monumento': return '🗿'
      default: return '📍'
    }
  }

  const spotTypes = ['all', ...Array.from(new Set(spots.map(spot => spot.type)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pontos turísticos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Pontos Turísticos</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Ganhe pontos fazendo check-in!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar pontos turísticos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="all">Todos os tipos</option>
              {spotTypes.filter(type => type !== 'all').map(type => (
                <option key={type} value={type}>
                  {getTypeIcon(type)} {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{spots.length}</div>
                <div className="text-sm text-gray-600">Pontos Disponíveis</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{checkedInSpots.size}</div>
                <div className="text-sm text-gray-600">Check-ins Hoje</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {checkedInSpots.size * 50}
                </div>
                <div className="text-sm text-gray-600">Pontos Ganhos Hoje</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tourist Spots Grid */}
        {filteredSpots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => {
              const hasCheckedInToday = checkedInSpots.has(spot.id)
              
              return (
                <div key={spot.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image */}
                  {spot.image && (
                    <div className="relative h-48 bg-gray-200">
                      <img 
                        src={spot.image} 
                        alt={spot.name}
                        className="w-full h-full object-cover"
                      />
                      {hasCheckedInToday && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Check-in feito
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {spot.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(spot.type)}`}>
                            {getTypeIcon(spot.type)} {spot.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{spot.rating}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {spot.description}
                    </p>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      {spot.openingHours && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{spot.openingHours}</span>
                        </div>
                      )}
                      
                      {spot.admissionFee !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            {spot.admissionFee === 0 ? 'Entrada gratuita' : `R$ ${spot.admissionFee}`}
                          </span>
                        </div>
                      )}
                      
                      {spot.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ExternalLink className="w-4 h-4" />
                          <a 
                            href={spot.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700"
                          >
                            Ver site oficial
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Check-in Section */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {spot.checkinPoints} pontos
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleCheckIn(spot)}
                          disabled={hasCheckedInToday}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            hasCheckedInToday
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {hasCheckedInToday ? 'Check-in feito' : 'Fazer Check-in'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin size={64} className="text-gray-300 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || selectedType !== 'all' 
                ? 'Nenhum ponto turístico encontrado' 
                : 'Nenhum ponto turístico cadastrado'
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all' 
                ? 'Tente ajustar sua busca ou filtro.' 
                : 'Novos pontos turísticos serão adicionados em breve.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Check-in Modal */}
      <CheckInModal
        isOpen={checkinModal.isOpen}
        onClose={() => setCheckinModal({ isOpen: false })}
        touristSpot={checkinModal.spot}
        onSuccess={handleCheckInSuccess}
      />
    </div>
  )
}

export default function TouristSpotsPage() {
  return (
    <AuthGuard>
      <TouristSpotsContent />
    </AuthGuard>
  )
}