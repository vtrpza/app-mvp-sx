import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import ClientInitializer from '@/components/ClientInitializer'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#05a658',
}

export const metadata: Metadata = {
  title: 'SX Locadora - Mobilidade Urbana Sustentável',
  description: 'Aluguel de patinetes, bikes e veículos recreativos. Mobilidade urbana sustentável com tecnologia avançada.',
  keywords: 'patinetes, bikes, jet ski, lanchas, aluguel, mobilidade urbana, sustentável, SX Locadora',
  authors: [{ name: 'SX Locadora' }],
  creator: 'SX Locadora',
  publisher: 'SX Locadora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'SX Locadora',
    statusBarStyle: 'default',
    capable: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://app.sxlocadora.com.br',
    title: 'SX Locadora - Mobilidade Urbana Sustentável',
    description: 'Aluguel de patinetes, bikes e veículos recreativos. Mobilidade urbana sustentável com tecnologia avançada.',
    siteName: 'SX Locadora',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SX Locadora - Mobilidade Urbana Sustentável',
    description: 'Aluguel de patinetes, bikes e veículos recreativos. Mobilidade urbana sustentável com tecnologia avançada.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SX Locadora" />
        <meta name="application-name" content="SX Locadora" />
        <meta name="msapplication-TileColor" content="#05a658" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#05a658" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <PerformanceOptimizer />
        <ClientInitializer />
        <div id="root">
          {children}
        </div>
        <div id="modal-root"></div>
        <div id="toast-root"></div>
      </body>
    </html>
  )
}