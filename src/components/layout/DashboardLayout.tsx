'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import ThemeToggle from '@/components/ui/ThemeToggle'
import NotificationDropdown from '@/components/ui/NotificationDropdown'
import {
  Menu,
  LayoutDashboard,
  QrCode,
  Scan,
  UploadCloud,
  History,
  BarChart2,
  Folder,
  LayoutTemplate,
  Users,
  Link as LinkIcon,
  Contact,
  Utensils,
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  X,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"

const drawerWidth = 280

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Check if user is admin (you can get this from session or API)
  const isAdmin = session?.user?.email === 'admin@qrstudio.com';

  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { text: 'Generate QR Code', icon: QrCode, path: '/dashboard/generate' },
    { text: 'Scan QR Code', icon: Scan, path: '/dashboard/scan' },
    { text: 'Bulk Generate', icon: UploadCloud, path: '/dashboard/bulk' },

    { header: 'Management' },
    { text: 'My QR Codes', icon: QrCode, path: '/dashboard/qr-codes' },
    { text: 'History', icon: History, path: '/dashboard/history' },
    { text: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },

    { header: 'Workspace' },
    { text: 'Campaigns', icon: Folder, path: '/dashboard/campaigns' },
    { text: 'Templates', icon: LayoutTemplate, path: '/dashboard/templates' },
    { text: 'Team', icon: Users, path: '/dashboard/team', badge: 'Pro' },

    { header: 'Microsites' },
    { text: 'Link in Bio', icon: LinkIcon, path: '/dashboard/link-in-bio', badge: 'New' },
    { text: 'vCard Plus', icon: Contact, path: '/dashboard/vcard-plus', badge: 'New' },
    { text: 'Digital Menu', icon: Utensils, path: '/dashboard/digital-menu', badge: 'New' },
    { text: 'Lead Gate', icon: ClipboardList, path: '/dashboard/lead-gate', badge: 'New' },

    ...(isAdmin ? [
      { header: 'Administration' },
      { text: 'Admin Panel', icon: Settings, path: '/admin' },
    ] : []),

    { divider: true },
    { text: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-electric-cyan border-t-transparent"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-black/90 backdrop-blur-xl border-r border-gray-200 dark:border-white/10">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group translate-y-0.5">
          <div className="w-10 h-10 relative group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="QR Studio Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 group-hover:to-electric-cyan transition-all">
              QR Studio
            </h1>
            <p className="text-[10px] font-bold tracking-wider text-electric-cyan uppercase">
              Pro Dashboard
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item, index) => {
          if (item.header) {
            return (
              <div key={`header-${index}`} className="mt-6 mb-2 px-3">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {item.header}
                </h3>
              </div>
            );
          }

          if (item.divider) {
            return <div key={`divider-${index}`} className="my-4 border-t border-gray-100 dark:border-white/5" />;
          }

          return (
            <Link
              key={item.text}
              href={item.path!}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                pathname === item.path
                  ? "bg-gradient-to-r from-electric-blue to-electric-cyan text-white shadow-md shadow-blue-500/25"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {item.icon && <item.icon className={cn("w-5 h-5", pathname !== item.path && "group-hover:text-electric-cyan transition-colors")} />}
              <span className="flex-1">{item.text}</span>
              {item.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-full",
                  item.badge === 'Pro' ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm" :
                    item.badge === 'New' ? "bg-electric-emerald/10 text-electric-emerald border border-electric-emerald/20" : ""
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Mini Profile (Bottom Sidebar) */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-violet to-electric-blue flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-black">
            {session.user?.image ? (
              <img src={session.user.image} alt="User" className="w-full h-full rounded-full object-cover" />
            ) : (
              session.user?.name?.[0] || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {session.user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {session.user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer (Mobile & Desktop) */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[280px] transform transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        "md:pl-[280px]"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb-like Title */}
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {menuItems.find((item) => item.path === pathname)?.text || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <ThemeToggle /> */}

            <NotificationDropdown />

            {/* Profile Dropdown Replacement (Simplified for now, can be expanded) */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-cyan-400 p-[1px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-electric-blue">{session.user?.name?.[0]}</span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 mr-1" />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 mb-1">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  )
}
