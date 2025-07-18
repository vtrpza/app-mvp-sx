'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  UserCheck, 
  FileText, 
  Gift, 
  MapPin, 
  ShoppingBag, 
  Map, 
  Trophy, 
  MessageCircle,
  Upload,
  Clock,
  Shield,
  Star
} from 'lucide-react'

interface Feature {
  id: string
  icon: React.ElementType
  title: string
  description: string
  details: string[]
  mockData: Record<string, any>
}

interface FeaturesProps {
  initialFeatureId?: string
}

const features = [
  {
    id: 'register',
    icon: UserCheck,
    title: 'Cadastro Inteligente',
    description: 'Upload de documento + análise automatizada. Aprovação em até 4h úteis.',
    details: [
      'Upload de foto com documento',
      'Declaração manuscrita digital',
      'Análise automatizada + validação manual',
      'Aprovação automática para clientes recorrentes'
    ],
    mockData: {
      status: 'Em análise',
      timeRemaining: '2h 30min',
      documents: ['RG', 'Declaração']
    }
  },
  {
    id: 'contract',
    icon: FileText,
    title: 'Contrato Digital',
    description: 'Assinatura eletrônica válida com registro completo de IP e geolocalização.',
    details: [
      'Consentimento jurídico eletrônico',
      'Registro de IP e geolocalização',
      'Timestamp preciso',
      'Botão "Li e autorizo"'
    ],
    mockData: {
      contract: 'Contrato de Locação #2024-001',
      signed: false,
      location: 'São Paulo, SP'
    }
  },
  {
    id: 'loyalty',
    icon: Gift,
    title: 'Programa Ponto X',
    description: 'Acúmulo de pontos por uso e indicações. Troque por benefícios reais.',
    details: [
      'Pontos por cada aluguel',
      'Bônus por indicações',
      'Descontos exclusivos',
      'Gratuidades especiais'
    ],
    mockData: {
      points: 2450,
      level: 'Gold',
      nextReward: '500 pontos para próxima recompensa'
    }
  },
  {
    id: 'geolocation',
    icon: MapPin,
    title: 'Geolocalização em Tempo Real',
    description: 'Localização de patinetes ativos e notificações em áreas restritas.',
    details: [
      'Localização em tempo real',
      'Notificações em áreas restritas',
      'Rastreamento de patinetes',
      'Alertas de segurança'
    ],
    mockData: {
      nearbyScooters: 8,
      closestDistance: '50m',
      restrictedZone: false
    }
  },
  {
    id: 'marketplace',
    icon: ShoppingBag,
    title: 'Marketplace Integrado',
    description: 'Aluguel de bikes, jet ski, lanchas e outros veículos recreativos.',
    details: [
      'Bikes e patinetes',
      'Jet ski e lanchas',
      'Controle de requisitos legais',
      'Verificação de CNH Náutica'
    ],
    mockData: {
      categories: ['Bikes', 'Jet Ski', 'Lanchas', 'Outros'],
      available: 45,
      popular: 'Bike Elétrica'
    }
  },
  {
    id: 'guide',
    icon: Map,
    title: 'Guia Turístico Digital',
    description: 'Pontos turísticos, melhor trajeto e sugestões sustentáveis.',
    details: [
      'Localização de pontos turísticos',
      'Melhor trajeto (custo/tempo)',
      'Modal mais barato',
      'Opções sustentáveis'
    ],
    mockData: {
      nearbyAttractions: 12,
      suggestedRoute: 'Rota Sustentável',
      savings: 'R$ 15,00'
    }
  },
  {
    id: 'gamification',
    icon: Trophy,
    title: 'Check-in Social',
    description: 'Ranking, desafios e engajamento com pontos turísticos locais.',
    details: [
      'Sistema de ranking',
      'Desafios semanais',
      'Check-in em pontos turísticos',
      'Conquistas e badges'
    ],
    mockData: {
      rank: 42,
      badges: 8,
      currentChallenge: 'Visite 5 pontos turísticos'
    }
  },
  {
    id: 'host',
    icon: MessageCircle,
    title: 'Anfitrião Local',
    description: 'Canal direto com anfitriões locais através de chat seguro.',
    details: [
      'Chat seguro integrado',
      'Suporte local especializado',
      'Dicas e recomendações',
      'Atendimento personalizado'
    ],
    mockData: {
      hostName: 'Maria Silva',
      rating: 4.9,
      responseTime: '2 min'
    }
  }
]

export default function Features({ initialFeatureId }: FeaturesProps) {
  const [selectedFeatureId, setSelectedFeatureId] = useState(initialFeatureId || features[0].id)
  
  // ✅ Memoized selected feature
  const selectedFeature = useMemo(() => 
    features.find(f => f.id === selectedFeatureId) || features[0], 
    [selectedFeatureId]
  )
  
  // ✅ Memoized callback
  const handleFeatureSelect = useCallback((featureId: string) => {
    setSelectedFeatureId(featureId)
  }, [])
  
  // ✅ Memoized feature list
  const featureList = useMemo(() => 
    features.map(feature => ({
      ...feature,
      isSelected: feature.id === selectedFeatureId
    })), [selectedFeatureId]
  )

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" role="region" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Funcionalidades <span className="text-gradient">Inovadoras</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tecnologia avançada para uma experiência de mobilidade única e sustentável
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 animate-on-scroll">
          {/* ✅ Accessible feature list */}
          <div className="space-y-4" role="tablist" aria-label="Lista de funcionalidades">
            {featureList.map((feature) => {
              const Icon = feature.icon
              
              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureSelect(feature.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleFeatureSelect(feature.id)
                    }
                  }}
                  className={`w-full p-6 rounded-xl transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform ${
                    feature.isSelected 
                      ? 'bg-white border-2 border-primary shadow-xl scale-[1.02]' 
                      : 'bg-white border border-gray-200 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]'
                  }`}
                  role="tab"
                  aria-selected={feature.isSelected}
                  aria-controls={`feature-panel-${feature.id}`}
                  id={`feature-tab-${feature.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      feature.isSelected ? 'bg-primary text-white' : 'bg-primary-50 text-primary-700'
                    }`} aria-hidden="true">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-800 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* ✅ Accessible feature details */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div 
              key={selectedFeature.id}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 animate-fade-in-fast"
              role="tabpanel"
              aria-labelledby={`feature-tab-${selectedFeature.id}`}
              id={`feature-panel-${selectedFeature.id}`}
            >
              <header className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary text-white rounded-lg" aria-hidden="true">
                  <selectedFeature.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedFeature.title}
                  </h3>
                  <p className="text-gray-800 text-sm">{selectedFeature.description}</p>
                </div>
              </header>

              <div className="space-y-6">
                {/* Feature Details */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Características Principais:</h4>
                  <ul className="space-y-2" role="list">
                    {selectedFeature.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-900" role="listitem">
                        <div className="w-2 h-2 bg-primary rounded-full" aria-hidden="true"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mock Data Preview */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Visualização em Tempo Real:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedFeature.mockData).map(([key, value]) => (
                      <div key={key} className="bg-white p-3 rounded-lg border border-gray-200">
                        <dt className="text-xs text-gray-800 capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-base font-bold text-primary">{String(value)}</dd>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <button 
                    className="w-full btn-primary"
                    aria-label={`Experimentar ${selectedFeature.title}`}
                  >
                    Experimentar Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
