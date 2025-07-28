import { User, Referral, ReferralStats, ReferralLeaderboard } from '@/types'

// Generate unique referral code
export const generateReferralCode = (userId: string, name: string): string => {
  const namePrefix = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z]/g, '') // Remove non-letters
    .toUpperCase()
    .substring(0, 3)
  
  const userSuffix = userId.substring(0, 4).toUpperCase()
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  
  return `${namePrefix}${userSuffix}${randomSuffix}`
}

// Validate referral code format
export const isValidReferralCode = (code: string): boolean => {
  return /^[A-Z0-9]{8,12}$/.test(code)
}

// Get user by referral code
export const getUserByReferralCode = (referralCode: string): User | null => {
  if (typeof window === 'undefined') return null
  
  const users = JSON.parse(localStorage.getItem('sx_users') || '[]') as User[]
  return users.find(user => user.referralCode === referralCode) || null
}

// Create referral relationship
export const createReferral = (referrerId: string, referredId: string): Referral => {
  const referral: Referral = {
    id: Math.random().toString(36).substring(2, 15),
    referrerId,
    referredId,
    status: 'completed',
    pointsAwarded: 200, // Default referral points
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  }

  // Save to localStorage
  const referrals = JSON.parse(localStorage.getItem('sx_referrals') || '[]') as Referral[]
  referrals.push(referral)
  localStorage.setItem('sx_referrals', JSON.stringify(referrals))

  return referral
}

// Award referral points
export const awardReferralPoints = (referrerId: string, points: number = 200): void => {
  // Update user points
  const users = JSON.parse(localStorage.getItem('sx_users') || '[]') as User[]
  const userIndex = users.findIndex(u => u.id === referrerId)
  
  if (userIndex !== -1) {
    users[userIndex].points += points
    users[userIndex].level = calculateLevel(users[userIndex].points)
    users[userIndex].updatedAt = new Date().toISOString()
    localStorage.setItem('sx_users', JSON.stringify(users))

    // Add points transaction
    const transactions = JSON.parse(localStorage.getItem('sx_points_transactions') || '[]')
    transactions.push({
      id: Math.random().toString(36).substring(2, 15),
      userId: referrerId,
      points,
      reason: 'referral',
      description: 'Indicação de amigo',
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('sx_points_transactions', JSON.stringify(transactions))
  }
}

// Calculate user level based on points
export const calculateLevel = (points: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
  if (points >= 3000) return 'Platinum'
  if (points >= 1500) return 'Gold'
  if (points >= 500) return 'Silver'
  return 'Bronze'
}

// Get referral statistics for a user
export const getReferralStats = (userId: string): ReferralStats => {
  const referrals = JSON.parse(localStorage.getItem('sx_referrals') || '[]') as Referral[]
  const userReferrals = referrals.filter(r => r.referrerId === userId)
  
  const totalReferred = userReferrals.length
  const successfulReferrals = userReferrals.filter(r => r.status === 'completed' || r.status === 'rewarded').length
  const pendingReferrals = userReferrals.filter(r => r.status === 'pending').length
  const totalPointsEarned = userReferrals.reduce((sum, r) => sum + (r.pointsAwarded || 0), 0)

  return {
    totalReferred,
    successfulReferrals,
    totalPointsEarned,
    pendingReferrals
  }
}

// Get referral leaderboard
export const getReferralLeaderboard = (limit: number = 10): ReferralLeaderboard[] => {
  const users = JSON.parse(localStorage.getItem('sx_users') || '[]') as User[]
  const referrals = JSON.parse(localStorage.getItem('sx_referrals') || '[]') as Referral[]
  
  const userStats = users.map(user => {
    const userReferrals = referrals.filter(r => r.referrerId === user.id)
    const referralCount = userReferrals.filter(r => r.status === 'completed' || r.status === 'rewarded').length
    const pointsEarned = userReferrals.reduce((sum, r) => sum + (r.pointsAwarded || 0), 0)
    
    return {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      referralCount,
      pointsEarned
    }
  })
  
  // Sort by referral count, then by points earned
  return userStats
    .filter(stat => stat.referralCount > 0)
    .sort((a, b) => {
      if (b.referralCount !== a.referralCount) {
        return b.referralCount - a.referralCount
      }
      return b.pointsEarned - a.pointsEarned
    })
    .slice(0, limit)
    .map((stat, index) => ({
      rank: index + 1,
      ...stat
    }))
}

// Get referred users by a referrer
export const getReferredUsers = (referrerId: string): User[] => {
  const users = JSON.parse(localStorage.getItem('sx_users') || '[]') as User[]
  const referrals = JSON.parse(localStorage.getItem('sx_referrals') || '[]') as Referral[]
  
  const referredIds = referrals
    .filter(r => r.referrerId === referrerId)
    .map(r => r.referredId)
  
  return users.filter(user => referredIds.includes(user.id))
}

// Generate shareable referral URL
export const generateReferralUrl = (referralCode: string): string => {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}?ref=${referralCode}`
}

// Generate WhatsApp share link
export const generateWhatsAppShareLink = (referralCode: string, userName: string): string => {
  const referralUrl = generateReferralUrl(referralCode)
  const message = `🚲 Oi! Eu uso a SX Locações para alugar bikes, scooters e muito mais!

Cadastre-se usando meu código de indicação *${referralCode}* e ganhe 100 pontos no programa Ponto X!

${referralUrl}

#SXLocacoes #PontoX #MobilidadeUrbana`

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

// Generate SMS share link
export const generateSMSShareLink = (referralCode: string): string => {
  const referralUrl = generateReferralUrl(referralCode)
  const message = `Cadastre-se na SX Locações com meu código ${referralCode} e ganhe 100 pontos! ${referralUrl}`
  
  return `sms:?body=${encodeURIComponent(message)}`
}

// Generate email share link
export const generateEmailShareLink = (referralCode: string, userName: string): string => {
  const referralUrl = generateReferralUrl(referralCode)
  const subject = 'Ganhe pontos na SX Locações!'
  const body = `Olá!

Estou usando a SX Locações para alugar bikes, scooters e outros veículos de forma prática e sustentável.

Cadastre-se usando meu código de indicação ${referralCode} e ganhe 100 pontos no programa de fidelidade Ponto X!

Acesse: ${referralUrl}

Abraços,
${userName}`

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Copy referral code to clipboard
export const copyReferralCodeToClipboard = async (referralCode: string): Promise<boolean> => {
  try {
    const referralUrl = generateReferralUrl(referralCode)
    await navigator.clipboard.writeText(referralUrl)
    return true
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = generateReferralUrl(referralCode)
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      return false
    }
  }
}

// Generate QR code data URL (simple implementation)
export const generateQRCodeDataUrl = (referralCode: string): string => {
  const referralUrl = generateReferralUrl(referralCode)
  // For MVP, we'll use a placeholder QR code service
  // In production, consider using a proper QR code library
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralUrl)}`
}