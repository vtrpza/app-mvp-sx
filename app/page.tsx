import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Marketplace from '@/components/Marketplace'
import TouristGuide from '@/components/TouristGuide'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Marketplace />
      <TouristGuide />
      <Footer />
    </main>
  )
}