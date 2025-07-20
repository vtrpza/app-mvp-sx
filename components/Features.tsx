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
    <section className="section-padding gradient-bg-light" role="region" aria-labelledby="features-heading">
      <div className="container-custom">
        <header className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6">
            <Star className="text-primary" size={16} />
            <span className="text-sm font-medium text-primary">Funcionalidades Premium</span>
          </div>
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 text-balance">
            Tecnologia <span className="text-gradient">Inovadora</span> ao Seu Alcance
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto text-balance">
            Descubra recursos exclusivos que transformam sua experiência de mobilidade urbana
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 animate-slide-up animate-stagger-1">
          {/* Premium Feature List */}
          <div className="space-y-6" role="tablist" aria-label="Lista de funcionalidades">
            {featureList.map((feature, index) => {
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
                  className={`card-feature w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 group ${
                    feature.isSelected 
                      ? 'border-primary/50 shadow-xl scale-[1.02] bg-gradient-to-br from-white to-primary/5' 
                      : 'hover:border-primary/30'
                  }`}
                  role="tab"
                  aria-selected={feature.isSelected}
                  aria-controls={`feature-panel-${feature.id}`}
                  id={`feature-tab-${feature.id}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className={`relative p-4 rounded-2xl transition-all duration-300 ${
                      feature.isSelected 
                        ? 'bg-gradient-to-br from-primary to-primary-600 text-white shadow-lg scale-110' 
                        : 'bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-105'
                    }`} aria-hidden="true">
                      <Icon size={24} />
                      {feature.isSelected && (
                        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse-soft"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className={`transition-all duration-300 ${
                      feature.isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-70 group-hover:scale-90'
                    }`}>
                      <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Premium Feature Details */}
          <div className="lg:sticky lg:top-24 h-fit animate-slide-up animate-stagger-2">
            <div 
              key={selectedFeature.id}
              className="card relative overflow-hidden animate-fade-in-fast"
              role="tabpanel"
              aria-labelledby={`feature-tab-${selectedFeature.id}`}
              id={`feature-panel-${selectedFeature.id}`}
            >
              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
              
              <header className="flex items-center gap-6 mb-8">
                <div className="relative p-4 bg-gradient-to-br from-primary to-primary-600 text-white rounded-2xl shadow-lg" aria-hidden="true">
                  <selectedFeature.icon size={28} />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse-soft"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {selectedFeature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">{selectedFeature.description}</p>
                </div>
              </header>

              <div className="space-y-8">
                {/* Feature Details */}
                <div>
                  <h4 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    Características Principais
                  </h4>
                  <ul className="space-y-3" role="list">
                    {selectedFeature.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-4 text-neutral-700" role="listitem">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5" aria-hidden="true">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mock Data Preview */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200">
                  <h4 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-secondary to-primary rounded-full"></div>
                    Visualização em Tempo Real
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(selectedFeature.mockData).map(([key, value], index) => (
                      <div 
                        key={key} 
                        className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <dt className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-2">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-lg font-bold text-gradient">{String(value)}</dd>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button 
                    className="w-full btn-primary btn-ripple hover-glow group"
                    aria-label={`Experimentar ${selectedFeature.title}`}
                  >
                    <span>Experimentar Agora</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:animate-tada transition-all duration-300">
                      <Star size={12} className="text-white animate-heartbeat" />
                    </div>
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
