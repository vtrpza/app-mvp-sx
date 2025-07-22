'use client'

import { useEffect } from 'react'
import { initializeMockData } from '@/lib/mock-data-seed'

export default function ClientInitializer() {
  useEffect(() => {
    // Initialize mock data on client side only
    initializeMockData()
  }, [])

  return null // This component doesn't render anything
}