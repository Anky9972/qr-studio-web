'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Bell, Search, Filter, CheckCircle, Clock, AlertTriangle, X, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
    id: string;
    type: string;
    subject: string;
    message: string;
    sentAt: string;
    success: boolean;
    error?: string | null;
}

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/notifications?limit=50'); // Fetch more for full page
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch('/api/notifications/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: id }),
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                toast.success('Notification marked as read');
            }
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/api/notifications/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllAsRead: true }),
            });

            if (response.ok) {
                setNotifications([]);
                toast.success('All notifications marked as read');
            }
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    return (
        <div className="space-y-8 pb-8 p-6 lg:p-10 max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-xs font-bold border border-electric-blue/20 flex items-center gap-1">
                            <Bell className="w-3 h-3" /> ALERTS
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold font-display text-white">Notifications</h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Stay updated with system alerts and announcements.
                    </p>
                </motion.div>

                <div className="flex gap-2">
                    {notifications.length > 0 && (
                        <Button variant="outline" onClick={markAllAsRead}>
                            <Check className="w-4 h-4 mr-2" /> Mark All as Read
                        </Button>
                    )}
                </div>
            </div>

            <Card variant="glass" className="min-h-[400px]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    {/* Placeholder for filters if needed */}
                </div>

                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No notifications found. You're all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className="p-6 hover:bg-white/5 transition-colors group flex gap-4">
                                <div className={cn(
                                    "mt-1 p-2 rounded-lg",
                                    notification.type === 'error' ? "bg-red-500/10 text-red-500" :
                                        notification.type === 'success' ? "bg-green-500/10 text-green-500" :
                                            "bg-blue-500/10 text-blue-500"
                                )}>
                                    {notification.type === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                                        notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                            <Bell className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-medium">{notification.subject}</h3>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
