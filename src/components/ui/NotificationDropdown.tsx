'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, AlertCircle, BarChart2, Clock, CheckCircle } from 'lucide-react'
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
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Track previous unread count to trigger toasts
  const prevUnreadCountRef = useRef(0)

  // Fetch notifications
  const fetchNotifications = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true)
      const response = await fetch('/api/notifications?limit=20')
      if (response.ok) {
        const data = await response.json()
        const newUnreadCount = data.unreadCount || 0

        // Trigger toast if unread count increased
        if (newUnreadCount > prevUnreadCountRef.current && isPolling) {
          const newNotification = data.notifications[0];
          if (newNotification) {
            toast(newNotification.subject, {
              description: newNotification.message,
              action: {
                label: 'View',
                onClick: () => router.push('/dashboard/notifications')
              },
            })
          } else {
            toast.info(`You have ${newUnreadCount} new notifications`)
          }
        }

        setNotifications(data.notifications || [])
        setUnreadCount(newUnreadCount)
        prevUnreadCountRef.current = newUnreadCount
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      if (!isPolling) setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        setUnreadCount(prev => {
          const newCount = Math.max(0, prev - 1);
          prevUnreadCountRef.current = newCount;
          return newCount;
        })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      })

      if (response.ok) {
        setNotifications([])
        setUnreadCount(0)
        prevUnreadCountRef.current = 0
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(() => fetchNotifications(true), 60000) // Poll every minute
    return () => clearInterval(interval)
  }, [])

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'scan_alert':
        return <BarChart2 className="w-4 h-4" />
      case 'weekly_report':
        return <BarChart2 className="w-4 h-4" />
      case 'limit_warning':
        return <AlertCircle className="w-4 h-4" />
      case 'expiration_reminder':
        return <Clock className="w-4 h-4" />
      case 'domain_verified':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  // Get color based on notification type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'scan_alert':
        return 'text-blue-500 dark:text-blue-400'
      case 'weekly_report':
        return 'text-purple-500 dark:text-purple-400'
      case 'limit_warning':
        return 'text-orange-500 dark:text-orange-400'
      case 'expiration_reminder':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'domain_verified':
        return 'text-green-500 dark:text-green-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-electric-pink shadow-glow-pink"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-white/10">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => {
                      // Optional: View details or mark as read?
                      // For now just mark as read if user wants to keep it in the list they can use the View All page
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('mt-0.5', getNotificationColor(notification.type))}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {notification.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
                        </p>
                        {notification.error && (
                          <p className="text-xs text-red-500 dark:text-red-400">
                            Error: {notification.error}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"
                        title="Mark as read"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/dashboard/notifications')
              }}
              className="w-full text-sm text-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
