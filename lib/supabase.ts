import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock database operations for development
export const mockDatabase = {
  // User management
  users: {
    async create(userData: any) {
      // Mock user creation
      console.log('Mock: Creating user', userData)
      return { id: Math.random().toString(36), ...userData }
    },
    
    async authenticate(email: string, password: string) {
      // Mock authentication
      console.log('Mock: Authenticating user', email)
      return { 
        id: Math.random().toString(36), 
        email, 
        name: 'João Silva',
        points: 2450,
        level: 'Gold'
      }
    },
    
    async updatePoints(userId: string, points: number) {
      // Mock points update
      console.log('Mock: Updating points for user', userId, points)
      return { success: true }
    }
  },

  // Vehicle management
  vehicles: {
    async getAvailable(category?: string) {
      // Mock available vehicles
      const mockVehicles = [
        { id: 1, type: 'scooter', location: 'Centro', battery: 85 },
        { id: 2, type: 'scooter', location: 'Ibirapuera', battery: 92 },
        { id: 3, type: 'bike', location: 'Vila Madalena', battery: 100 }
      ]
      return mockVehicles.filter(v => !category || v.type === category)
    },
    
    async reserve(vehicleId: string, userId: string) {
      // Mock vehicle reservation
      console.log('Mock: Reserving vehicle', vehicleId, 'for user', userId)
      return { success: true, reservation: { id: Math.random().toString(36), vehicleId, userId } }
    }
  },

  // Rental management
  rentals: {
    async create(rentalData: any) {
      // Mock rental creation
      console.log('Mock: Creating rental', rentalData)
      return { id: Math.random().toString(36), ...rentalData, status: 'active' }
    },
    
    async end(rentalId: string) {
      // Mock rental end
      console.log('Mock: Ending rental', rentalId)
      return { success: true, cost: 12.50, duration: 45 }
    }
  },

  // Contract management
  contracts: {
    async create(contractData: any) {
      // Mock contract creation
      console.log('Mock: Creating contract', contractData)
      return { 
        id: Math.random().toString(36), 
        ...contractData, 
        signed: false,
        ip: '192.168.1.1',
        timestamp: new Date().toISOString()
      }
    },
    
    async sign(contractId: string, userId: string, geolocation: any) {
      // Mock contract signing
      console.log('Mock: Signing contract', contractId, userId, geolocation)
      return { success: true, signedAt: new Date().toISOString() }
    }
  },

  // Document management
  documents: {
    async upload(file: File, userId: string) {
      // Mock document upload
      console.log('Mock: Uploading document', file.name, 'for user', userId)
      return { 
        id: Math.random().toString(36), 
        url: URL.createObjectURL(file),
        status: 'pending_review'
      }
    },
    
    async verify(documentId: string) {
      // Mock document verification
      console.log('Mock: Verifying document', documentId)
      return { success: true, status: 'verified' }
    }
  },

  // Advanced Gamification and Points System
  gamification: {
    // Points Configuration
    pointsConfig: {
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
    },

    // Level Configuration
    levelThresholds: [
      { name: 'Bronze', min: 0, max: 499, color: '#cd7f32', perks: ['Desconto 5%'] },
      { name: 'Silver', min: 500, max: 1499, color: '#c0c0c0', perks: ['Desconto 10%', 'Suporte prioritário'] },
      { name: 'Gold', min: 1500, max: 2999, color: '#ffd700', perks: ['Desconto 15%', 'Veículos premium', 'Suporte VIP'] },
      { name: 'Platinum', min: 3000, max: 9999, color: '#e5e4e2', perks: ['Desconto 20%', 'Acesso antecipado', 'Concierge'] },
      { name: 'Diamond', min: 10000, max: 99999, color: '#b9f2ff', perks: ['Desconto 25%', 'Eventos exclusivos', 'Consultoria premium'] }
    ],

    // Achievement System
    achievements: [
      { id: 'first_rental', name: 'Primeiro Aluguel', description: 'Complete seu primeiro aluguel', points: 50, icon: '🚲' },
      { id: 'explorer', name: 'Explorador', description: 'Visite 5 pontos turísticos diferentes', points: 100, icon: '🗺️' },
      { id: 'social_butterfly', name: 'Social', description: 'Indique 3 amigos', points: 150, icon: '👥' },
      { id: 'streak_master', name: 'Sequência Máxima', description: 'Mantenha streak de 7 dias', points: 200, icon: '🔥' },
      { id: 'eco_warrior', name: 'Eco Guerreiro', description: 'Complete 20 aluguéis sustentáveis', points: 250, icon: '🌱' },
      { id: 'review_master', name: 'Avaliador Expert', description: 'Deixe 10 avaliações', points: 100, icon: '⭐' },
      { id: 'night_owl', name: 'Coruja Noturna', description: 'Alugue veículo após 22h', points: 75, icon: '🦉' },
      { id: 'weekend_warrior', name: 'Guerreiro do Fim de Semana', description: 'Alugue em todos os fins de semana do mês', points: 180, icon: '📅' }
    ],

    // Check-in with enhanced logic
    async checkin(userId: string, locationId: string, locationName: string) {
      const user = await this.getUser(userId)
      if (!user) return { success: false, error: 'User not found' }

      // Check for duplicate check-ins
      const today = new Date().toDateString()
      const checkins = JSON.parse(localStorage.getItem('sx_checkins') || '[]')
      const todayCheckin = checkins.find((c: any) => 
        c.userId === userId && 
        c.locationId === locationId && 
        new Date(c.timestamp).toDateString() === today
      )

      if (todayCheckin) {
        return { success: false, error: 'Já fez check-in neste local hoje' }
      }

      const points = this.pointsConfig.checkin
      
      // Save check-in
      const newCheckin = {
        id: Math.random().toString(36),
        userId,
        locationId,
        locationName,
        timestamp: new Date().toISOString(),
        points
      }
      checkins.push(newCheckin)
      localStorage.setItem('sx_checkins', JSON.stringify(checkins))

      // Add points
      const result = await this.addPoints(userId, points, 'check-in', `Check-in em ${locationName}`)
      
      // Check for achievements
      const newAchievements = await this.checkAchievements(userId)
      
      // Update streak
      await this.updateStreak(userId, 'checkin')

      return { 
        success: true, 
        points, 
        newTotal: result.newTotal,
        level: result.level,
        newAchievements,
        checkin: newCheckin
      }
    },

    async getUser(userId: string) {
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      return users.find((u: any) => u.id === userId)
    },
    
    async getLeaderboard(timeframe: string = 'all', limit: number = 10) {
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      let filteredUsers = users

      if (timeframe !== 'all') {
        const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
        const timeLimit = this.getTimeLimit(timeframe)
        
        // Calculate points within timeframe
        filteredUsers = users.map((user: any) => {
          const userTransactions = transactions.filter((t: any) => 
            t.userId === user.id && new Date(t.timestamp) >= timeLimit
          )
          const timeframePoints = userTransactions.reduce((sum: number, t: any) => sum + t.points, 0)
          return { ...user, timeframePoints }
        }).sort((a: any, b: any) => b.timeframePoints - a.timeframePoints)
      } else {
        filteredUsers = users.sort((a: any, b: any) => b.points - a.points)
      }

      return filteredUsers
        .slice(0, limit)
        .map((user: any, index: number) => ({
          rank: index + 1,
          userId: user.id,
          name: user.name,
          points: timeframe === 'all' ? user.points : user.timeframePoints,
          totalPoints: user.points,
          level: user.level,
          avatar: user.avatar,
          achievements: user.achievements?.length || 0
        }))
    },

    getTimeLimit(timeframe: string): Date {
      const now = new Date()
      switch (timeframe) {
        case 'week':
          return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case 'month':
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case 'year':
          return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        default:
          return new Date(0)
      }
    },

    async addPoints(userId: string, points: number, reason: string, description: string) {
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      const userIndex = users.findIndex((u: any) => u.id === userId)
      
      if (userIndex === -1) return { success: false, error: 'User not found' }
      
      const oldLevel = users[userIndex].level
      const oldPoints = users[userIndex].points || 0
      
      // Update user points
      users[userIndex].points = oldPoints + points
      users[userIndex].level = this.calculateLevel(users[userIndex].points)
      users[userIndex].updatedAt = new Date().toISOString()
      
      // Save updated users
      localStorage.setItem('sx_users', JSON.stringify(users))
      
      // Save points transaction
      const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
      transactions.push({
        id: Math.random().toString(36),
        userId,
        points,
        reason,
        description,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('sx_points_transactions', JSON.stringify(transactions))
      
      const levelUp = oldLevel !== users[userIndex].level

      return { 
        success: true, 
        newTotal: users[userIndex].points, 
        level: users[userIndex].level,
        levelUp,
        oldLevel,
        pointsAdded: points
      }
    },

    calculateLevel(points: number): string {
      const level = this.levelThresholds.find(l => points >= l.min && points <= l.max)
      return level?.name || 'Bronze'
    },

    getLevelInfo(level: string) {
      return this.levelThresholds.find(l => l.name === level)
    },

    async getUserStats(userId: string) {
      const user = await this.getUser(userId)
      if (!user) return null

      const transactions = await this.getPointsHistory(userId)
      const checkins = JSON.parse(localStorage.getItem('sx_checkins') || '[]')
        .filter((c: any) => c.userId === userId)
      const achievements = user.achievements || []
      const streaks = await this.getUserStreaks(userId)

      const levelInfo = this.getLevelInfo(user.level)
      const nextLevel = this.levelThresholds.find(l => l.min > user.points)

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          points: user.points,
          level: user.level,
          levelInfo,
          nextLevel,
          progressToNext: nextLevel && levelInfo ? ((user.points - levelInfo.min) / (nextLevel.min - levelInfo.min)) * 100 : 100
        },
        stats: {
          totalTransactions: transactions.length,
          totalCheckins: checkins.length,
          achievementsUnlocked: achievements.length,
          totalAchievements: this.achievements.length,
          currentStreak: streaks.current,
          longestStreak: streaks.longest,
          pointsThisWeek: this.getPointsInTimeframe(transactions, 'week'),
          pointsThisMonth: this.getPointsInTimeframe(transactions, 'month'),
        },
        recent: {
          transactions: transactions.slice(-5).reverse(),
          checkins: checkins.slice(-3).reverse(),
          achievements: achievements.slice(-3).reverse()
        }
      }
    },

    getPointsInTimeframe(transactions: any[], timeframe: string): number {
      const timeLimit = this.getTimeLimit(timeframe)
      return transactions
        .filter(t => new Date(t.timestamp) >= timeLimit)
        .reduce((sum, t) => sum + t.points, 0)
    },

    async checkAchievements(userId: string) {
      const user = await this.getUser(userId)
      if (!user) return []

      const userAchievements = user.achievements || []
      const newAchievements: any[] = []

      for (const achievement of this.achievements) {
        if (userAchievements.find((a: any) => a.id === achievement.id)) continue

        const unlocked = await this.checkAchievementCondition(userId, achievement.id)
        if (unlocked) {
          const newAchievement = {
            ...achievement,
            unlockedAt: new Date().toISOString()
          }
          userAchievements.push(newAchievement)
          newAchievements.push(newAchievement)

          // Award points for achievement
          await this.addPoints(userId, achievement.points, 'achievement', `Conquista desbloqueada: ${achievement.name}`)
        }
      }

      if (newAchievements.length > 0) {
        const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
        const userIndex = users.findIndex((u: any) => u.id === userId)
        users[userIndex].achievements = userAchievements
        localStorage.setItem('sx_users', JSON.stringify(users))
      }

      return newAchievements
    },

    async checkAchievementCondition(userId: string, achievementId: string): Promise<boolean> {
      const checkins = JSON.parse(localStorage.getItem('sx_checkins') || '[]')
        .filter((c: any) => c.userId === userId)
      const transactions = await this.getPointsHistory(userId)
      const streaks = await this.getUserStreaks(userId)

      switch (achievementId) {
        case 'first_rental':
          return transactions.some((t: any) => t.reason === 'rental')
        case 'explorer':
          const uniqueLocations = new Set(checkins.map((c: any) => c.locationId))
          return uniqueLocations.size >= 5
        case 'streak_master':
          return streaks.current >= 7
        case 'review_master':
          return transactions.filter((t: any) => t.reason === 'review').length >= 10
        case 'social_butterfly':
          return transactions.filter((t: any) => t.reason === 'referral').length >= 3
        case 'eco_warrior':
          return transactions.filter((t: any) => t.reason === 'rental').length >= 20
        default:
          return false
      }
    },

    async getUserStreaks(userId: string) {
      const streaks = JSON.parse(localStorage.getItem('sx_streaks') || '{}')
      return streaks[userId] || { current: 0, longest: 0, lastActivity: null }
    },

    async updateStreak(userId: string, activity: string) {
      const streaks = JSON.parse(localStorage.getItem('sx_streaks') || '{}')
      const userStreak = streaks[userId] || { current: 0, longest: 0, lastActivity: null }
      
      const today = new Date().toDateString()
      const lastActivity = userStreak.lastActivity ? new Date(userStreak.lastActivity).toDateString() : null
      
      if (lastActivity === today) {
        return userStreak // Already updated today
      }
      
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      if (lastActivity === yesterday) {
        userStreak.current += 1
      } else {
        userStreak.current = 1
      }
      
      userStreak.longest = Math.max(userStreak.longest, userStreak.current)
      userStreak.lastActivity = new Date().toISOString()
      
      streaks[userId] = userStreak
      localStorage.setItem('sx_streaks', JSON.stringify(streaks))
      
      // Award streak bonus
      if (userStreak.current > 1 && userStreak.current % 7 === 0) {
        await this.addPoints(userId, this.pointsConfig.daily_streak, 'streak', `Streak de ${userStreak.current} dias!`)
      }
      
      return userStreak
    },

    async getUserPoints(userId: string) {
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      const user = users.find((u: any) => u.id === userId)
      return user ? { points: user.points, level: user.level } : null
    },

    async getPointsHistory(userId: string) {
      const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
      return transactions.filter((t: any) => t.userId === userId)
    },

    // Rewards System
    async getAvailableRewards(userId: string) {
      const user = await this.getUser(userId)
      if (!user) return []

      const rewards = [
        { id: 'discount_5', name: '5% Desconto', description: 'Desconto em próximo aluguel', cost: 100, type: 'discount' },
        { id: 'discount_10', name: '10% Desconto', description: 'Desconto em próximo aluguel', cost: 200, type: 'discount' },
        { id: 'free_30min', name: '30min Grátis', description: 'Tempo livre de aluguel', cost: 150, type: 'time' },
        { id: 'premium_access', name: 'Acesso Premium', description: 'Veículos premium por 1 dia', cost: 300, type: 'access' },
        { id: 'vip_support', name: 'Suporte VIP', description: 'Atendimento prioritário por 1 mês', cost: 500, type: 'support' }
      ]

      return rewards.filter(r => user.points >= r.cost)
    },

    async redeemReward(userId: string, rewardId: string) {
      const user = await this.getUser(userId)
      const rewards = await this.getAvailableRewards(userId)
      const reward = rewards.find(r => r.id === rewardId)
      
      if (!reward) return { success: false, error: 'Recompensa não disponível' }
      
      // Deduct points
      await this.addPoints(userId, -reward.cost, 'redemption', `Resgate: ${reward.name}`)
      
      // Save redemption
      const redemptions = JSON.parse(localStorage.getItem('sx_redemptions') || '[]')
      const redemption = {
        id: Math.random().toString(36),
        userId,
        rewardId: reward.id,
        rewardName: reward.name,
        cost: reward.cost,
        redeemedAt: new Date().toISOString(),
        status: 'active'
      }
      redemptions.push(redemption)
      localStorage.setItem('sx_redemptions', JSON.stringify(redemptions))
      
      return { success: true, redemption }
    }
  },

  // Tourist Spots Management
  touristSpots: {
    async getAll() {
      return JSON.parse(localStorage.getItem('sx_tourist_spots') || '[]')
    },

    async create(spotData: any) {
      const spots = JSON.parse(localStorage.getItem('sx_tourist_spots') || '[]')
      const newSpot = {
        id: Math.random().toString(36),
        ...spotData,
        createdAt: new Date().toISOString()
      }
      spots.push(newSpot)
      localStorage.setItem('sx_tourist_spots', JSON.stringify(spots))
      return newSpot
    },

    async update(id: string, spotData: any) {
      const spots = JSON.parse(localStorage.getItem('sx_tourist_spots') || '[]')
      const index = spots.findIndex((s: any) => s.id === id)
      if (index === -1) return { success: false, error: 'Spot not found' }
      
      spots[index] = { ...spots[index], ...spotData, updatedAt: new Date().toISOString() }
      localStorage.setItem('sx_tourist_spots', JSON.stringify(spots))
      return spots[index]
    },

    async delete(id: string) {
      const spots = JSON.parse(localStorage.getItem('sx_tourist_spots') || '[]')
      const filtered = spots.filter((s: any) => s.id !== id)
      localStorage.setItem('sx_tourist_spots', JSON.stringify(filtered))
      return { success: true }
    }
  }
}

// Mock geolocation service
export const geolocationService = {
  async getCurrentPosition(): Promise<GeolocationPosition> {
    // Mock geolocation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          coords: {
            latitude: -23.5505,
            longitude: -46.6333,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        } as GeolocationPosition)
      }, 1000)
    })
  },

  async watchPosition(callback: (position: GeolocationPosition) => void) {
    // Mock position watching
    const position = await this.getCurrentPosition()
    callback(position)
    return setInterval(() => callback(position), 5000)
  }
}

// Mock notification service
export const notificationService = {
  async requestPermission() {
    // Mock notification permission
    return 'granted'
  },

  async sendNotification(title: string, options: any) {
    // Mock notification
    console.log('Mock: Sending notification', title, options)
    if ('Notification' in window) {
      new Notification(title, options)
    }
  }
}

// Environment check for production
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = !isProduction