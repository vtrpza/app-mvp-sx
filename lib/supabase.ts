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

  // Gamification and Points System
  gamification: {
    async checkin(userId: string, locationId: string) {
      // Mock check-in
      console.log('Mock: Check-in at', locationId, 'by user', userId)
      
      // Add points to user
      await this.addPoints(userId, 50, 'check-in', `Check-in em ${locationId}`)
      
      return { success: true, points: 50, badge: 'Explorer' }
    },
    
    async getLeaderboard() {
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      return users
        .sort((a: any, b: any) => b.points - a.points)
        .slice(0, 10)
        .map((user: any, index: number) => ({
          rank: index + 1,
          userId: user.id,
          name: user.name,
          points: user.points,
          avatar: user.avatar
        }))
    },

    async addPoints(userId: string, points: number, reason: string, description: string) {
      // Get current users
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      const userIndex = users.findIndex((u: any) => u.id === userId)
      
      if (userIndex === -1) return { success: false, error: 'User not found' }
      
      // Update user points
      users[userIndex].points = (users[userIndex].points || 0) + points
      users[userIndex].level = this.calculateLevel(users[userIndex].points)
      
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
      
      return { success: true, newTotal: users[userIndex].points, level: users[userIndex].level }
    },

    calculateLevel(points: number): string {
      if (points >= 3000) return 'Platinum'
      if (points >= 1500) return 'Gold'
      if (points >= 500) return 'Silver'
      return 'Bronze'
    },

    async getUserPoints(userId: string) {
      const users = JSON.parse(localStorage.getItem('sx_users') || '[]')
      const user = users.find((u: any) => u.id === userId)
      return user ? { points: user.points, level: user.level } : null
    },

    async getPointsHistory(userId: string) {
      const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
      return transactions.filter((t: any) => t.userId === userId)
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