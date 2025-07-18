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

  // Gamification
  gamification: {
    async checkin(userId: string, locationId: string) {
      // Mock check-in
      console.log('Mock: Check-in at', locationId, 'by user', userId)
      return { success: true, points: 50, badge: 'Explorer' }
    },
    
    async getLeaderboard() {
      // Mock leaderboard
      return [
        { rank: 1, name: 'Ana Costa', points: 5420 },
        { rank: 2, name: 'Carlos Silva', points: 4830 },
        { rank: 3, name: 'Maria Santos', points: 4200 }
      ]
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