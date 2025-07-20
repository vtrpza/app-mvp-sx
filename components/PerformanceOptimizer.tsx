'use client'

import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload the logo
      const logoLink = document.createElement('link')
      logoLink.rel = 'preload'
      logoLink.href = '/assets/logo-2.svg'
      logoLink.as = 'image'
      logoLink.type = 'image/svg+xml'
      document.head.appendChild(logoLink)
    }

    // Optimize scroll performance
    const optimizeScrollPerformance = () => {
      let ticking = false
      
      const updateScrollElements = () => {
        // Remove will-change after animations complete
        const animatedElements = document.querySelectorAll('.animate-slide-up, .animate-slide-right, .animate-fade-in')
        animatedElements.forEach((element) => {
          const el = element as HTMLElement
          if (el.style.willChange !== 'auto') {
            el.style.willChange = 'auto'
          }
        })
        ticking = false
      }

      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollElements)
          ticking = true
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    // Optimize images loading
    const optimizeImages = () => {
      // Add loading="lazy" to images that are not above the fold
      const images = document.querySelectorAll('img:not([loading])')
      images.forEach((img, index) => {
        if (index > 2) { // First 3 images are probably above the fold
          img.setAttribute('loading', 'lazy')
        }
      })
    }

    // Reduce motion for users who prefer it
    const respectMotionPreferences = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-base', '0.01s')
        document.documentElement.style.setProperty('--transition-slow', '0.01s')
        document.documentElement.style.setProperty('--transition-fast', '0.01s')
      }
    }

    // Execute optimizations
    preloadCriticalResources()
    const cleanupScroll = optimizeScrollPerformance()
    optimizeImages()
    respectMotionPreferences()

    return cleanupScroll
  }, [])

  return null // This component doesn't render anything
}