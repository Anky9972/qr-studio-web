'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, AlertCircle, BarChart2, Clock, CheckCircle, Megaphone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: string
  subject: string
  message: string
  sentAt: string
  success: boolean
  error?: string | null
}

interface NotificationDropdownProps {
  className?: string
}

export default function NotificationDropdown({ className }: NotificationDropdownProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const prevUnreadCountRef = useRef(0)

  const fetchNotifications = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true)
      const response = await fetch('/api/notifications?limit=20')
      if (response.ok) {
        const data = await response.json()
        const newUnreadCount = data.unreadCount || 0
        if (newUnreadCount > prevUnreadCountRef.current && isPolling) {
          const newNotification = data.notifications[0]
          if (newNotification) { toast(newNotification.subject, { description: newNotification.message, action: { label: 'View', onClick: () => router.push('/dashboard/notifications') } }) }
          else { toast.info(`You have ${newUnreadCount} new notifications`) }
        }
        setNotifications(data.notifications || [])
        setUnreadCount(newUnreadCount)
        prevUnreadCountRef.current = newUnreadCount
      }
    } catch (error) { console.error('Error fetching notifications:', error) }
    finally { if (!isPolling) setLoading(false) }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId }) })
      if (response.ok) { setNotifications(prev => prev.filter(n => n.id !== notificationId)); setUnreadCount(prev => { const newCount = Math.max(0, prev - 1); prevUnreadCountRef.current = newCount; return newCount }) }
    } catch (error) { console.error('Error marking notification as read:', error) }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllAsRead: true }) })
      if (response.ok) { setNotifications([]); setUnreadCount(0); prevUnreadCountRef.current = 0 }
    } catch (error) { console.error('Error marking all as read:', error) }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false) }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => { document.removeEventListener('mousedown', handleClickOutside) }
  }, [isOpen])

  useEffect(() => { if (isOpen) fetchNotifications() }, [isOpen])
  useEffect(() => { fetchNotifications(); const interval = setInterval(() => fetchNotifications(true), 60000); return () => clearInterval(interval) }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'announcement': case 'admin_message': return <Megaphone className="w-4 h-4" />
      case 'scan_alert': case 'weekly_report': return <BarChart2 className="w-4 h-4" />
      case 'limit_warning': return <AlertCircle className="w-4 h-4" />
      case 'expiration_reminder': return <Clock className="w-4 h-4" />
      case 'domain_verified': return <CheckCircle className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'announcement': case 'admin_message': return 'text-electric-cyan dark:text-electric-cyan'
      case 'scan_alert': return 'text-blue-500 dark:text-blue-400'
      case 'weekly_report': return 'text-purple-500 dark:text-purple-400'
      case 'limit_warning': return 'text-orange-500 dark:text-orange-400'
      case 'expiration_reminder': return 'text-yellow-500 dark:text-yellow-400'
      case 'domain_verified': return 'text-green-500 dark:text-green-400'
      default: return 'text-gray-500 dark:text-gray-400'
    }
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-gradient-to-r from-electric-pink to-electric-violet text-white text-xs font-bold shadow-lg shadow-electric-pink/50">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div><h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3><p className="text-xs text-gray-500 dark:text-gray-400">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p></div>
            {notifications.length > 0 && <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Clear all</button>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (<div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p></div>
            ) : notifications.length === 0 ? (<div className="p-8 text-center"><Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" /><p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p></div>
            ) : (<div className="divide-y divide-gray-200 dark:divide-white/10">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => { setSelectedNotification(notification); setShowDetailModal(true); setIsOpen(false) }}>
                  <div className="flex items-start gap-3">
                    <div className={cn('mt-0.5', getNotificationColor(notification.type))}>{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{notification.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}</p>
                      {notification.error && <p className="text-xs text-red-500 dark:text-red-400">Error: {notification.error}</p>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); markAsRead(notification.id) }} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded" title="Mark as read"><X className="w-4 h-4 text-gray-500 dark:text-gray-400" /></button>
                  </div>
                </div>
              ))}
            </div>)}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50"><button onClick={() => { setIsOpen(false); router.push('/dashboard/notifications') }} className="w-full text-sm text-center text-electric-cyan hover:text-electric-blue transition-colors font-medium">View all notifications</button></div>
        </div>
      )}

      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1"><div className={cn('mt-1 p-2 rounded-lg bg-opacity-10', getNotificationColor(selectedNotification.type))}>{getNotificationIcon(selectedNotification.type)}</div><div className="flex-1"><h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedNotification.subject}</h2><p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(selectedNotification.sentAt), { addSuffix: true })}</p></div></div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
            </div>
            <div className="p-6"><div className="prose prose-sm dark:prose-invert max-w-none"><p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedNotification.message}</p></div>{selectedNotification.error && <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg"><p className="text-sm text-red-800 dark:text-red-400 font-medium">Error Details:</p><p className="text-sm text-red-700 dark:text-red-300 mt-1">{selectedNotification.error}</p></div>}</div>
            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3"><button onClick={() => setShowDetailModal(false)} className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 rounded-lg transition-colors">Close</button><button onClick={() => { markAsRead(selectedNotification.id); setShowDetailModal(false) }} className="px-4 py-2 bg-gradient-to-r from-electric-cyan to-electric-blue hover:from-electric-blue hover:to-electric-cyan text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-electric-cyan/20"><Check className="w-4 h-4" />Mark as Read</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
