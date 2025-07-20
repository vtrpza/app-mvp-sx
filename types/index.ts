// User types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  points: number
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  createdAt: string
  updatedAt: string
}

// Vehicle types
export interface Vehicle {
  id: string | number
  type: 'scooter' | 'bike' | 'jetski' | 'boat' | 'other'
  model?: string
  name: string
  description: string
  price: number
  location: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  battery?: number
  available: boolean
  features: string[]
  requirements: string[]
  image?: string
  rating: number
  category: string
}

// Rental types
export interface Rental {
  id: string
  userId: string
  vehicleId: string
  startTime: string
  endTime?: string
  duration?: number
  cost: number
  status: 'active' | 'completed' | 'cancelled'
  startLocation: {
    latitude: number
    longitude: number
  }
  endLocation?: {
    latitude: number
    longitude: number
  }
}

// Contract types
export interface Contract {
  id: string
  userId: string
  vehicleId: string
  content: string
  signed: boolean
  signedAt?: string
  ip: string
  geolocation: {
    latitude: number
    longitude: number
  }
  timestamp: string
}

// Document types
export interface Document {
  id: string
  userId: string
  type: 'id' | 'license' | 'declaration' | 'other'
  url: string
  status: 'pending_review' | 'verified' | 'rejected'
  uploadedAt: string
  verifiedAt?: string
}

// Gamification types
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedAt?: string
}

export interface CheckIn {
  id: string
  userId: string
  locationId: string
  locationName: string
  timestamp: string
  points: number
}

export interface Leaderboard {
  rank: number
  userId: string
  name: string
  points: number
  avatar?: string
}

// Tourist Guide types
export interface TouristAttraction {
  id: string
  name: string
  description: string
  type: 'park' | 'museum' | 'restaurant' | 'beach' | 'monument' | 'other'
  coordinates: {
    latitude: number
    longitude: number
  }
  rating: number
  image: string
  openingHours: string
  admissionFee: number
  website?: string
  checkinPoints: number
}

export interface Route {
  id: string
  from: {
    latitude: number
    longitude: number
  }
  to: {
    latitude: number
    longitude: number
  }
  distance: number
  duration: number
  cost: number
  sustainableCost: number
  transportMode: 'walking' | 'bike' | 'scooter' | 'public' | 'taxi'
  ecoScore: number
  steps: RouteStep[]
}

export interface RouteStep {
  instruction: string
  distance: number
  duration: number
}

// Chat types
export interface ChatMessage {
  id: string
  userId: string
  hostId: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'location'
  read: boolean
}

export interface Host {
  id: string
  name: string
  avatar?: string
  rating: number
  responseTime: number
  languages: string[]
  specialties: string[]
  online: boolean
}

// Notification types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: string
  action?: {
    label: string
    url: string
  }
}

// Marketplace types
export interface MarketplaceItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  location: string
  available: boolean
  rating: number
  features: string[]
  requirements: string[]
  image: string
  ownerId: string
}

// Loyalty Program types
export interface LoyaltyProgram {
  id: string
  name: string
  description: string
  pointsRequired: number
  discount: number
  validUntil: string
  category: string
  used: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

// PWA types
export interface PWAInstallPrompt {
  show: boolean
  deferredPrompt?: any
}

// Geolocation types
export interface LocationPermission {
  granted: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
}

// Theme types
export interface Theme {
  mode: 'light' | 'dark'
  primaryColor: string
  accentColor: string
}