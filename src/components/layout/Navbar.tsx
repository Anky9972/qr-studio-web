'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  QrCode2,
  Extension as ExtensionIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle
} from '@mui/icons-material'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    setProfileMenuOpen(false)
    await signOut({ callbackUrl: '/' })
  }

  // Don't show navbar on dashboard pages
  if (!mounted) return null
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Templates', href: '/templates' },
    { label: 'Use Cases', href: '/use-cases' },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled || mobileMenuOpen ? "glass-dark border-white/10 py-3" : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-neon-purple/50 transition-all duration-300 group-hover:scale-105">
                <QrCode2 className="text-white text-2xl" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 hidden sm:block">
                QR Studio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              <a
                href="https://chromewebstore.google.com/detail/pjiipoibmdohooinoolciaamcoeclkln"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExtensionIcon fontSize="small" />
                Extension
              </a>

              <div className="w-px h-6 bg-white/10 mx-2" />

              {status === 'loading' ? (
                <div className="w-24 h-9 bg-white/5 rounded-lg animate-pulse" />
              ) : session?.user ? (
                <div className="flex items-center gap-3 relative">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/5"
                    asChild
                  >
                    <Link href="/dashboard">
                      <DashboardIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>

                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-md">
                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </button>

                    {/* Profile Dropdown */}
                    {profileMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden glass-dark border border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-4 border-b border-white/10 bg-white/5">
                            <p className="text-sm font-medium text-white truncate">
                              {session.user.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {session.user.email}
                            </p>
                          </div>
                          <div className="p-1">
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <DashboardIcon className="text-lg" />
                              Dashboard
                            </Link>
                            <Link
                              href="/dashboard/settings"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <SettingsIcon className="text-lg" />
                              Settings
                            </Link>
                            <Link
                              href="/dashboard/account"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <AccountCircle className="text-lg" />
                              Account
                            </Link>
                            <div className="h-px bg-white/10 my-1" />
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <LogoutIcon className="text-lg" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Button
                    variant="premium"
                    size="sm"
                    className="shadow-neon-purple/20"
                    asChild
                  >
                    <Link href="/signup">
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="text-white hover:bg-white/10"
              >
                <MenuIcon />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[70] w-[280px] glass-dark border-l border-white/10 transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <CloseIcon />
          </Button>
        </div>

        <div className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between group"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          ))}

          <a
            href="https://chromewebstore.google.com/detail/pjiipoibmdohooinoolciaamcoeclkln"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ExtensionIcon className="w-5 h-5" />
            Chrome Extension
          </a>

          <div className="h-px bg-white/10 my-2" />

          {status === 'loading' ? (
            <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
          ) : session?.user ? (
            <>
              <div className="px-4 py-2 mb-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{session.user.name}</p>
                    <p className="text-xs text-gray-400">{session.user.email}</p>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DashboardIcon className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <SettingsIcon className="w-5 h-5" />
                Settings
              </Link>
              <Link
                href="/dashboard/account"
                className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <AccountCircle className="w-5 h-5" />
                Account
              </Link>

              <div className="mt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={async () => {
                    await handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogoutIcon className="mr-2 w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link
                href="/signin"
                className="w-full px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full px-4 py-3 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-neon-purple/50 rounded-lg transition-all shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
