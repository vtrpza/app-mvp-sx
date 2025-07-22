// Mock data seeder for development
export const seedMockData = () => {
  // Check if data already exists
  const existingSpots = localStorage.getItem('sx_tourist_spots')
  
  if (!existingSpots || JSON.parse(existingSpots).length === 0) {
    const mockTouristSpots = [
      {
        id: 'spot-1',
        name: 'Parque Ibirapuera',
        description: 'Um dos maiores parques urbanos de São Paulo, ideal para atividades ao ar livre, esportes e lazer.',
        type: 'parque',
        coordinates: {
          latitude: -23.5873,
          longitude: -46.6573
        },
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        openingHours: '5h às 24h',
        admissionFee: 0,
        website: 'https://parqueibirapuera.org',
        checkinPoints: 50,
        createdAt: new Date().toISOString()
      },
      {
        id: 'spot-2',
        name: 'Museu de Arte de São Paulo (MASP)',
        description: 'Importante museu de arte com coleções nacionais e internacionais, famoso por sua arquitetura única.',
        type: 'museu',
        coordinates: {
          latitude: -23.5613,
          longitude: -46.6558
        },
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        openingHours: '10h às 18h (ter-dom)',
        admissionFee: 25,
        website: 'https://masp.org.br',
        checkinPoints: 75,
        createdAt: new Date().toISOString()
      },
      {
        id: 'spot-3',
        name: 'Mercado Municipal de São Paulo',
        description: 'Marco gastronômico da cidade com produtos típicos, restaurantes e a famosa mortadela.',
        type: 'restaurante',
        coordinates: {
          latitude: -23.5433,
          longitude: -46.6296
        },
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        openingHours: '6h às 18h (seg-sáb)',
        admissionFee: 0,
        website: 'https://mercadomunicipal.com.br',
        checkinPoints: 60,
        createdAt: new Date().toISOString()
      },
      {
        id: 'spot-4',
        name: 'Pinacoteca do Estado',
        description: 'Museu de arte mais antigo de São Paulo, com importante acervo de arte brasileira.',
        type: 'museu',
        coordinates: {
          latitude: -23.5338,
          longitude: -46.6327
        },
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        openingHours: '10h às 18h (qua-seg)',
        admissionFee: 15,
        website: 'https://pinacoteca.org.br',
        checkinPoints: 70,
        createdAt: new Date().toISOString()
      },
      {
        id: 'spot-5',
        name: 'Teatro Municipal',
        description: 'Teatro histórico e marco arquitetônico de São Paulo, palco das principais apresentações da cidade.',
        type: 'monumento',
        coordinates: {
          latitude: -23.5458,
          longitude: -46.6372
        },
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        openingHours: 'Conforme programação',
        admissionFee: 0,
        website: 'https://theatromunicipal.org.br',
        checkinPoints: 80,
        createdAt: new Date().toISOString()
      },
      {
        id: 'spot-6',
        name: 'Jardim Botânico de São Paulo',
        description: 'Área verde preservada com rica diversidade de plantas nativas e exóticas.',
        type: 'parque',
        coordinates: {
          latitude: -23.6344,
          longitude: -46.6258
        },
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        openingHours: '9h às 17h',
        admissionFee: 8,
        website: 'https://jardimbotanico.sp.gov.br',
        checkinPoints: 55,
        createdAt: new Date().toISOString()
      }
    ]

    localStorage.setItem('sx_tourist_spots', JSON.stringify(mockTouristSpots))
    console.log('✅ Mock tourist spots seeded successfully')
  }

  // Seed points configuration if not exists
  const existingConfig = localStorage.getItem('sx_points_config')
  if (!existingConfig) {
    const pointsConfig = {
      registration: 100,
      checkin: 50,
      referral: 200,
      review: 25,
      rental: 10,
      daily_streak: 30,
      weekly_challenge: 150,
      achievement_unlock: 100,
      social_share: 15,
      profile_complete: 75
    }

    localStorage.setItem('sx_points_config', JSON.stringify(pointsConfig))
    console.log('✅ Points configuration seeded successfully')
  }

  console.log('🚀 Mock data initialization complete')
}

// Call this function on app startup
export const initializeMockData = () => {
  if (typeof window !== 'undefined') {
    seedMockData()
  }
}