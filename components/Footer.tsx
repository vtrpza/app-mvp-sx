'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter,
  Linkedin,
  Smartphone,
  Download
} from 'lucide-react'

// ✅ Email validation utility
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const sanitizeEmail = (email: string): string => {
  return email.replace(/[<>]/g, '').trim().toLowerCase()
}

interface FooterProps {
  onNewsletterSubmit?: (email: string) => Promise<void>
  onPWAInstall?: () => Promise<void>
}

export default function Footer({ onNewsletterSubmit, onPWAInstall }: FooterProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  // ✅ Memoized social links
  const socialLinks = useMemo(() => [
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' }
  ], [])
  
  // ✅ Secure PWA installation
  const handleDownloadApp = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator && onPWAInstall) {
        await onPWAInstall()
      }
    } catch (error) {
      console.error('PWA installation failed:', error)
    }
  }, [onPWAInstall])
  
  // ✅ Secure newsletter submission
  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    const sanitizedEmail = sanitizeEmail(email)
    
    if (!validateEmail(sanitizedEmail)) {
      setSubmitStatus('error')
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      await onNewsletterSubmit?.(sanitizedEmail)
      setSubmitStatus('success')
      setEmail('')
    } catch (error) {
      console.error('Newsletter submission failed:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }, [email, onNewsletterSubmit])
  
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
    }
  }, [submitStatus])

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ✅ Accessible brand section */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white text-xl" aria-hidden="true">
                SX
              </div>
              <span className="ml-3 text-2xl font-bold">Locações</span>
            </div>
            <p className="text-gray-400">
              Mobilidade urbana sustentável com tecnologia avançada. 
              Aluguel de patinetes, bikes e veículos recreativos.
            </p>
            
            {/* ✅ Accessible social links */}
            <div className="flex space-x-2 pt-2" role="list" aria-label="Redes sociais">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a 
                  key={label}
                  href={href} 
                  className="p-2 text-gray-400 bg-gray-800 rounded-full hover:bg-primary hover:text-white transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label={`Seguir no ${label}`}
                  role="listitem"
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* ✅ Accessible services section */}
          <nav className="space-y-4" role="navigation" aria-label="Serviços">
            <h3 className="font-semibold text-lg mb-4">Serviços</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Aluguel de Patinetes</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Aluguel de Bikes</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Marketplace</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Guia Turístico</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Programa Ponto X</a></li>
            </ul>
          </nav>

          {/* ✅ Accessible support section */}
          <nav className="space-y-4" role="navigation" aria-label="Suporte">
            <h3 className="font-semibold text-lg mb-4">Suporte</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Como Usar</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Segurança</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">Privacidade</a></li>
            </ul>
          </nav>

          {/* ✅ Accessible contact section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <address className="space-y-3 text-gray-400 not-italic">
              <div className="flex items-center gap-3">
                <MapPin size={16} aria-hidden="true" />
                <span className="text-sm">São Paulo, SP - Brasil</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} aria-hidden="true" />
                <a href="tel:+551130000000" className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">
                  (11) 3000-0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} aria-hidden="true" />
                <a href="mailto:contato@sxlocadora.com.br" className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-1">
                  contato@sxlocadora.com.br
                </a>
              </div>
            </address>

            {/* App Download */}
            <div className="pt-4">
              <h4 className="font-medium mb-3">Baixe o App</h4>
              <button 
                onClick={handleDownloadApp}
                className="btn-primary w-full"
                aria-label="Instalar aplicativo PWA"
              >
                <Smartphone size={20} className="inline mr-2" aria-hidden="true" />
                Instalar PWA
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Accessible newsletter */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Fique por dentro das novidades</h3>
              <p className="text-gray-400">
                Receba atualizações sobre novos serviços e promoções exclusivas
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Seu endereço de e-mail
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Seu e-mail"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-describedby="newsletter-status"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="btn-primary"
                  aria-label="Inscrever-se na newsletter"
                >
                  {isSubmitting ? 'Enviando...' : 'Inscrever'}
                </button>
              </div>
              
              {/* ✅ Status feedback */}
              <div id="newsletter-status" className="min-h-[1.5rem]">
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-sm" role="status">
                    Inscrição realizada com sucesso!
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-sm" role="alert">
                    Erro na inscrição. Verifique seu e-mail e tente novamente.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SX Locações. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}