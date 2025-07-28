'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Star, Trophy, X, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { mockDatabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthGuard'

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  touristSpot?: any
  onSuccess?: (result: any) => void
}

export default function CheckInModal({ isOpen, onClose, touristSpot, onSuccess }: CheckInModalProps) {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checkInResult, setCheckInResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)

  const checkExistingCheckin = useCallback(() => {
    if (!user || !touristSpot) return

    // Check if user already checked in today at this location
    const checkins = JSON.parse(localStorage.getItem('sx_checkins') || '[]')
    const today = new Date().toDateString()
    const todayCheckin = checkins.find((c: any) => 
      c.userId === user.id && 
      c.locationId === touristSpot.id && 
      new Date(c.timestamp).toDateString() === today
    )

    setHasCheckedInToday(!!todayCheckin)
  }, [user, touristSpot])

  useEffect(() => {
    if (isOpen && touristSpot && user) {
      checkExistingCheckin()
    }
  }, [isOpen, touristSpot, user, checkExistingCheckin])

  const handleCheckIn = async () => {
    if (!user || !touristSpot || hasCheckedInToday) return

    setLoading(true)
    setError('')

    try {
      const result = await mockDatabase.gamification.checkin(
        user.id, 
        touristSpot.id, 
        touristSpot.name
      )

      if (result.success) {
        setCheckInResult(result)
        
        // Update user points in context
        if (user) {
          const updatedUser = { ...user, points: result.newTotal, level: result.level }
          updateUser(updatedUser)
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(result)
        }
      } else {
        setError(result.error || 'Erro ao fazer check-in')
      }
    } catch (err) {
      setError('Erro ao fazer check-in. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCheckInResult(null)
    setError('')
    setHasCheckedInToday(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white w-full sm:w-auto sm:max-w-md sm:rounded-2xl p-4 sm:p-6 safe-bottom">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 safe-top">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Check-in</h2>
          <button
            onClick={handleClose}
            className="p-2 sm:p-1 hover:bg-gray-100 rounded-full transition-colors touch-target"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Success State */}
        {checkInResult && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check-in realizado!</h3>
            <p className="text-gray-600 mb-4">
              Você ganhou <span className="font-bold text-green-600">+{checkInResult.points} pontos</span>
            </p>
            
            {/* Level up notification */}
            {checkInResult.levelUp && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-800">Parabéns! Novo nível!</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Você subiu para o nível {checkInResult.level}!
                </p>
              </div>
            )}

            {/* New achievements */}
            {checkInResult.newAchievements && checkInResult.newAchievements.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-800">Nova conquista!</span>
                </div>
                {checkInResult.newAchievements.map((achievement: any) => (
                  <p key={achievement.id} className="text-blue-700 text-sm">
                    🏆 {achievement.name} - +{achievement.points} pontos
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Total: {checkInResult.newTotal} pontos</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-blue-500" />
                <span>Nível: {checkInResult.level}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors touch-target"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Check-in Form */}
        {!checkInResult && (
          <>
            {/* Tourist Spot Info */}
            {touristSpot && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                {touristSpot.image && (
                  <div className="w-16 h-16 relative overflow-hidden rounded-lg">
                    <Image 
                      src={touristSpot.image} 
                      alt={touristSpot.name}
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized={touristSpot.image.startsWith('data:')}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{touristSpot.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{touristSpot.type || 'Ponto turístico'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Already checked in today */}
            {hasCheckedInToday && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Check-in já realizado</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Você já fez check-in neste local hoje. Volte amanhã para ganhar mais pontos!
                </p>
              </div>
            )}

            {/* Points Info */}
            {!hasCheckedInToday && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">
                      Ganhe {touristSpot?.checkinPoints || 50} pontos!
                    </p>
                    <p className="text-green-700 text-sm">
                      Faça check-in neste local e acumule pontos no Ponto X
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors touch-target"
              >
                Cancelar
              </button>
              <button
                onClick={handleCheckIn}
                disabled={loading || hasCheckedInToday}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 touch-target"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fazendo check-in...
                  </>
                ) : (
                  hasCheckedInToday ? 'Já fez check-in hoje' : 'Fazer Check-in'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}