// Initialize mock data for the SX Locações MVP
// Run this script in browser console to populate localStorage with test data

function initializeMockData() {
  console.log('🚀 Initializing mock data for SX Locações...')

  // Sample users with gamification data
  const users = [
    {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 99999-1111',
      points: 2450,
      level: 'Gold',
      createdAt: '2024-01-15T10:00:00.000Z',
      achievements: [
        {
          id: 'first_rental',
          name: 'Primeiro Aluguel',
          description: 'Complete seu primeiro aluguel',
          icon: '🚲',
          points: 50,
          unlockedAt: '2024-01-15T14:30:00.000Z'
        },
        {
          id: 'explorer',
          name: 'Explorador',
          description: 'Visite 5 pontos turísticos diferentes',
          icon: '🗺️',
          points: 100,
          unlockedAt: '2024-02-01T09:15:00.000Z'
        }
      ]
    },
    {
      id: 'user-2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '(11) 99999-2222',
      points: 12500,
      level: 'Diamond',
      createdAt: '2024-01-10T08:00:00.000Z',
      achievements: [
        {
          id: 'first_rental',
          name: 'Primeiro Aluguel',
          description: 'Complete seu primeiro aluguel',
          icon: '🚲',
          points: 50,
          unlockedAt: '2024-01-10T12:00:00.000Z'
        },
        {
          id: 'explorer',
          name: 'Explorador',
          description: 'Visite 5 pontos turísticos diferentes',
          icon: '🗺️',
          points: 100,
          unlockedAt: '2024-01-12T16:45:00.000Z'
        },
        {
          id: 'social_butterfly',
          name: 'Social',
          description: 'Indique 3 amigos',
          icon: '👥',
          points: 150,
          unlockedAt: '2024-01-20T11:30:00.000Z'
        },
        {
          id: 'streak_master',
          name: 'Sequência Máxima',
          description: 'Mantenha streak de 7 dias',
          icon: '🔥',
          points: 200,
          unlockedAt: '2024-02-05T08:00:00.000Z'
        }
      ]
    },
    {
      id: 'user-3',
      name: 'Carlos Oliveira',
      email: 'carlos@example.com',
      phone: '(11) 99999-3333',
      points: 850,
      level: 'Silver',
      createdAt: '2024-02-01T14:00:00.000Z',
      achievements: [
        {
          id: 'first_rental',
          name: 'Primeiro Aluguel',
          description: 'Complete seu primeiro aluguel',
          icon: '🚲',
          points: 50,
          unlockedAt: '2024-02-01T16:00:00.000Z'
        }
      ]
    },
    {
      id: 'user-4',
      name: 'Ana Costa',
      email: 'ana@example.com',
      phone: '(11) 99999-4444',
      points: 4200,
      level: 'Platinum',
      createdAt: '2024-01-20T09:30:00.000Z',
      achievements: [
        {
          id: 'first_rental',
          name: 'Primeiro Aluguel',
          description: 'Complete seu primeiro aluguel',
          icon: '🚲',
          points: 50,
          unlockedAt: '2024-01-20T11:00:00.000Z'
        },
        {
          id: 'explorer',
          name: 'Explorador',
          description: 'Visite 5 pontos turísticos diferentes',
          icon: '🗺️',
          points: 100,
          unlockedAt: '2024-01-25T13:20:00.000Z'
        },
        {
          id: 'review_master',
          name: 'Avaliador Expert',
          description: 'Deixe 10 avaliações',
          icon: '⭐',
          points: 100,
          unlockedAt: '2024-02-10T10:45:00.000Z'
        }
      ]
    },
    {
      id: 'user-5',
      name: 'Pedro Fernandes',
      email: 'pedro@example.com',
      phone: '(11) 99999-5555',
      points: 180,
      level: 'Bronze',
      createdAt: '2024-02-15T16:00:00.000Z',
      achievements: []
    }
  ]

  // Points transactions
  const transactions = [
    {
      id: 'trans-1',
      userId: 'user-1',
      points: 100,
      reason: 'register',
      description: 'Bônus de cadastro',
      timestamp: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 'trans-2',
      userId: 'user-1',
      points: 50,
      reason: 'check-in',
      description: 'Check-in no Parque Ibirapuera',
      timestamp: '2024-01-15T14:00:00.000Z'
    },
    {
      id: 'trans-3',
      userId: 'user-1',
      points: 50,
      reason: 'achievement',
      description: 'Conquista desbloqueada: Primeiro Aluguel',
      timestamp: '2024-01-15T14:30:00.000Z'
    },
    {
      id: 'trans-4',
      userId: 'user-2',
      points: 100,
      reason: 'register',
      description: 'Bônus de cadastro',
      timestamp: '2024-01-10T08:00:00.000Z'
    },
    {
      id: 'trans-5',
      userId: 'user-2',
      points: 200,
      reason: 'referral',
      description: 'Indicou um amigo',
      timestamp: '2024-01-12T10:00:00.000Z'
    },
    {
      id: 'trans-6',
      userId: 'user-2',
      points: 30,
      reason: 'streak',
      description: 'Streak de 7 dias!',
      timestamp: '2024-02-05T08:00:00.000Z'
    }
  ]

  // Tourist spots
  const touristSpots = [
    {
      id: 'spot-1',
      name: 'Parque Ibirapuera',
      description: 'O maior parque urbano de São Paulo',
      category: 'parque',
      latitude: -23.5873,
      longitude: -46.6573,
      pointsPerCheckin: 50,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY5NTU4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGFycXVlPC90ZXh0Pjwvc3ZnPg==',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'spot-2',
      name: 'Teatro Municipal',
      description: 'Patrimônio histórico e cultural da cidade',
      category: 'cultura',
      latitude: -23.5420,
      longitude: -46.6396,
      pointsPerCheckin: 50,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYjMxNzI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGVhdHJvPC90ZXh0Pjwvc3ZnPg==',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'spot-3',
      name: 'Mercado Municipal',
      description: 'Tradicional mercado com gastronomia local',
      category: 'gastronomia',
      latitude: -23.5431,
      longitude: -46.6291,
      pointsPerCheckin: 50,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY4YzAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TWVyY2FkbzwvdGV4dD48L3N2Zz4=',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ]

  // Streaks data
  const streaks = {
    'user-1': { current: 3, longest: 7, lastActivity: '2024-02-20T10:00:00.000Z' },
    'user-2': { current: 12, longest: 15, lastActivity: '2024-02-21T08:00:00.000Z' },
    'user-3': { current: 1, longest: 2, lastActivity: '2024-02-21T15:00:00.000Z' },
    'user-4': { current: 5, longest: 8, lastActivity: '2024-02-21T12:00:00.000Z' },
    'user-5': { current: 0, longest: 0, lastActivity: null }
  }

  // Check-ins data
  const checkins = [
    {
      id: 'checkin-1',
      userId: 'user-1',
      locationId: 'spot-1',
      locationName: 'Parque Ibirapuera',
      timestamp: '2024-01-15T14:00:00.000Z',
      points: 50
    },
    {
      id: 'checkin-2',
      userId: 'user-2',
      locationId: 'spot-1',
      locationName: 'Parque Ibirapuera',
      timestamp: '2024-01-10T12:00:00.000Z',
      points: 50
    },
    {
      id: 'checkin-3',
      userId: 'user-2',
      locationId: 'spot-2',
      locationName: 'Teatro Municipal',
      timestamp: '2024-01-11T16:00:00.000Z',
      points: 50
    }
  ]

  // Points configuration
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

  // Store all data in localStorage
  localStorage.setItem('sx_users', JSON.stringify(users))
  localStorage.setItem('sx_points_transactions', JSON.stringify(transactions))
  localStorage.setItem('sx_tourist_spots', JSON.stringify(touristSpots))
  localStorage.setItem('sx_streaks', JSON.stringify(streaks))
  localStorage.setItem('sx_checkins', JSON.stringify(checkins))
  localStorage.setItem('sx_points_config', JSON.stringify(pointsConfig))

  // Set a default current user for testing
  localStorage.setItem('sx_current_user', JSON.stringify(users[0]))

  console.log('✅ Mock data initialized successfully!')
  console.log('📊 Created:')
  console.log(`  - ${users.length} users`)
  console.log(`  - ${transactions.length} point transactions`)
  console.log(`  - ${touristSpots.length} tourist spots`)
  console.log(`  - ${checkins.length} check-ins`)
  console.log(`  - Streak data for all users`)
  console.log(`  - Points configuration`)
  console.log('')
  console.log('🎮 Gamification features:')
  console.log('  - 5 user levels (Bronze to Diamond)')
  console.log('  - 8 achievement types')
  console.log('  - Streak tracking system')
  console.log('  - Points for multiple actions')
  console.log('  - Leaderboard system')
  console.log('  - Rewards system')
  console.log('')
  console.log('🔗 Users by level:')
  const levelCounts = users.reduce((acc, user) => {
    acc[user.level] = (acc[user.level] || 0) + 1
    return acc
  }, {})
  Object.entries(levelCounts).forEach(([level, count]) => {
    console.log(`  - ${level}: ${count} users`)
  })
  console.log('')
  console.log('🚀 You can now:')
  console.log('  1. Navigate to /dashboard to see user dashboard')
  console.log('  2. Navigate to /admin/users to manage users')
  console.log('  3. Navigate to /admin/points to configure points')
  console.log('  4. Test all gamification features')
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  initializeMockData()
} else {
  // Export for Node.js if needed
  module.exports = { initializeMockData }
}