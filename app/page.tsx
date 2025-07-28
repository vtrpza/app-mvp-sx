'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Marketplace from '@/components/Marketplace'
import TouristGuide from '@/components/TouristGuide'
import Footer from '@/components/Footer'

export default function Home() {
  const searchParams = useSearchParams()
  const [referralCode, setReferralCode] = useState<string>('')

  useEffect(() => {
    // Get referral code from URL parameter
    const refParam = searchParams.get('ref')
    if (refParam) {
      setReferralCode(refParam)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Marketplace referralCode={referralCode} />
      <TouristGuide />
      <Footer />
    </main>
  )
}