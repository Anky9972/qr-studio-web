'use client'

import Link from 'next/link'
import { QRCodeGenerator } from '@/components/qr/QRCodeGenerator'
import { useTheme } from '@/components/providers/theme-provider'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import PaletteIcon from '@mui/icons-material/Palette'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function HomePage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const features = [
    {
      icon: QrCode2Icon,
      title: 'Advanced QR Generation',
      description: '25+ QR types with full customization. Add logos, colors, patterns, and more.',
    },
    {
      icon: QrCodeScannerIcon,
      title: 'Powerful Scanner',
      description: 'Real-time camera scanning with multi-format support and on-page detection.',
    },
    {
      icon: CloudUploadIcon,
      title: 'Bulk Operations',
      description: 'Generate thousands of QR codes from CSV/Excel with Google Sheets integration.',
    },
    {
      icon: AnalyticsIcon,
      title: 'Scan Analytics',
      description: 'Track scans, analyze performance, and understand your audience.',
    },
    {
      icon: PaletteIcon,
      title: 'Beautiful Design',
      description: 'Material Design 3 UI with full dark mode support and accessibility.',
    },
    {
      icon: SecurityIcon,
      title: 'Privacy First',
      description: 'All processing happens locally. Your data stays yours, always.',
    },
  ]

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'QR Codes Created' },
    { value: '10M+', label: 'Scans Tracked' },
    { value: '99.9%', label: 'Uptime' },
  ]

  const useCases = [
    { title: 'Business Cards', description: 'Create digital business cards with vCard QR codes', emoji: '💼' },
    { title: 'Marketing Campaigns', description: 'Track engagement with dynamic QR codes', emoji: '📱' },
    { title: 'Event Management', description: 'Ticketing and attendee check-ins made easy', emoji: '🎫' },
    { title: 'Product Packaging', description: 'Link physical products to digital content', emoji: '📦' },
  ]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-md-dark-background' : 'bg-md-light-background'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <AutoAwesomeIcon className="text-blue-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Professional QR Code Platform
                </span>
              </div>
              
              <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${
                isDark ? 'text-md-dark-on-background' : 'text-md-light-on-background'
              }`}>
                Create & Scan QR Codes{' '}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Like a Pro
                </span>
              </h1>
              
              <p className={`text-lg md:text-xl ${
                isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'
              }`}>
                Professional-grade QR code generator and scanner with beautiful design, 
                powerful features, and complete privacy control. Perfect for individuals, 
                businesses, and enterprises.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-md-3 ${
                    isDark
                      ? 'bg-md-dark-primary text-md-dark-on-primary'
                      : 'bg-md-light-primary text-md-light-on-primary'
                  }`}
                >
                  Get Started Free
                  <ArrowForwardIcon className="ml-2" />
                </Link>
                
                <Link
                  href="/features"
                  className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all border-2 ${
                    isDark
                      ? 'border-md-dark-outline text-md-dark-on-surface hover:bg-md-dark-surface-container'
                      : 'border-md-light-outline text-md-light-on-surface hover:bg-md-light-surface-container'
                  }`}
                >
                  View Features
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {['Chrome Extension', 'No Credit Card', '100% Free Tier'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <CheckCircleIcon className="text-green-500 text-sm" />
                    <span className={`text-sm ${
                      isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'
                    }`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-slide-up">
              <QRCodeGenerator />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 border-y ${
        isDark ? 'bg-md-dark-surface border-md-dark-outline' : 'bg-md-light-surface border-md-light-outline'
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className={`text-sm md:text-base ${
                  isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-md-dark-on-background' : 'text-md-light-on-background'
            }`}>
              Powerful Features for Everyone
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'
            }`}>
              From simple QR generation to advanced analytics, we've got everything you need
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`p-6 rounded-xl transition-all hover:scale-105 hover:shadow-md-4 ${
                    isDark
                      ? 'bg-md-dark-surface-container-highest'
                      : 'bg-md-light-surface-container-highest'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-lg mb-4 ${
                    isDark
                      ? 'bg-md-dark-primary-container'
                      : 'bg-md-light-primary-container'
                  }`}>
                    <Icon className={`text-2xl ${
                      isDark
                        ? 'text-md-dark-on-primary-container'
                        : 'text-md-light-on-primary-container'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={`py-20 ${isDark ? 'bg-md-dark-surface' : 'bg-md-light-surface'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-md-dark-on-background' : 'text-md-light-on-background'
            }`}>
              Trusted by Businesses Worldwide
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'
            }`}>
              See how QR Studio is being used across different industries
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className={`p-6 rounded-xl text-center transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-md-dark-surface-container-highest'
                    : 'bg-md-light-surface-container-highest'
                }`}
              >
                <div className="text-5xl mb-4">{useCase.emoji}</div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface'
                }`}>
                  {useCase.title}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant'
                }`}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className={`rounded-2xl p-12 text-center relative overflow-hidden ${
            isDark ? 'bg-md-dark-primary' : 'bg-md-light-primary'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
            <div className="relative z-10">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-md-dark-on-primary' : 'text-md-light-on-primary'
              }`}>
                Ready to Get Started?
              </h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                isDark ? 'text-md-dark-on-primary' : 'text-md-light-on-primary'
              }`}>
                Join thousands of users creating professional QR codes today
              </p>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-md-4 ${
                  isDark
                    ? 'bg-white text-md-dark-primary'
                    : 'bg-md-dark-primary text-white'
                }`}
              >
                Create Your First QR Code
                <ArrowForwardIcon className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
