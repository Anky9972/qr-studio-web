'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Bell, Search, Filter, CheckCircle, Clock, AlertTriangle, X, Check, History, Megaphone, BarChart2, RefreshCw } from 'lucide-react';
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
    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => { fetchNotifications(); }, [activeTab]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            if (activeTab === 'unread') {
                const response = await fetch('/api/notifications?limit=50');
                if (response.ok) { const data = await response.json(); setUnreadNotifications(data.notifications || []); }
            } else {
                const response = await fetch('/api/notifications/history?limit=100');
                if (response.ok) { const data = await response.json(); setAllNotifications(data.notifications || []); }
            }
        } catch (error) { console.error('Error fetching notifications:', error); toast.error('Failed to load notifications'); }
        finally { setLoading(false); }
    };

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch('/api/notifications/mark-read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId: id }) });
            if (response.ok) { setUnreadNotifications(prev => prev.filter(n => n.id !== id)); toast.success('Notification marked as read'); }
        } catch (error) { toast.error('Failed to mark as read'); }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/api/notifications/mark-read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllAsRead: true }) });
            if (response.ok) { setUnreadNotifications([]); toast.success('All notifications marked as read'); }
        } catch (error) { toast.error('Failed to mark all as read'); }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'announcement': case 'admin_message': return <Megaphone className="w-5 h-5" />;
            case 'scan_alert': case 'weekly_report': return <BarChart2 className="w-5 h-5" />;
            case 'error': return <AlertTriangle className="w-5 h-5" />;
            case 'success': return <CheckCircle className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'announcement': case 'admin_message': return 'bg-cyan-500/10 text-cyan-500';
            case 'scan_alert': case 'weekly_report': return 'bg-blue-500/10 text-blue-500';
            case 'error': return 'bg-red-500/10 text-red-500';
            case 'success': return 'bg-green-500/10 text-green-500';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    const currentNotifications = activeTab === 'unread' ? unreadNotifications : allNotifications;

    return (
        <div className="space-y-8 pb-8 p-6 lg:p-10 max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-2"><span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-xs font-bold border border-electric-blue/20 flex items-center gap-1"><Bell className="w-3 h-3" /> ALERTS</span></div>
                    <h1 className="text-3xl font-bold font-display text-white">Notifications</h1>
                    <p className="text-gray-400 mt-2 text-lg">Stay updated with system alerts and announcements.</p>
                </motion.div>
                <div className="flex gap-3">
                    <Button onClick={fetchNotifications} disabled={loading} variant="outline" className="border-white/10 hover:bg-white/5"><RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />Refresh</Button>
                    {activeTab === 'unread' && unreadNotifications.length > 0 && (<Button variant="outline" onClick={markAllAsRead} className="border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10"><Check className="w-4 h-4 mr-2" /> Mark All as Read</Button>)}
                </div>
            </div>

            <div className="flex gap-2 border-b border-white/10">
                <button onClick={() => setActiveTab('unread')} className={cn('px-4 py-3 font-medium text-sm transition-colors relative', activeTab === 'unread' ? 'text-electric-cyan' : 'text-gray-400 hover:text-white')}>
                    <div className="flex items-center gap-2"><Bell className="w-4 h-4" />Unread{unreadNotifications.length > 0 && <span className="px-2 py-0.5 rounded-full bg-electric-cyan/20 text-electric-cyan text-xs font-bold">{unreadNotifications.length}</span>}</div>
                    {activeTab === 'unread' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-cyan" />}
                </button>
                <button onClick={() => setActiveTab('all')} className={cn('px-4 py-3 font-medium text-sm transition-colors relative', activeTab === 'all' ? 'text-electric-cyan' : 'text-gray-400 hover:text-white')}>
                    <div className="flex items-center gap-2"><History className="w-4 h-4" />All Notifications</div>
                    {activeTab === 'all' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-cyan" />}
                </button>
            </div>

            <Card variant="glass" className="min-h-[400px]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between"><h2 className="text-lg font-semibold text-white">{activeTab === 'unread' ? 'Unread Notifications' : 'Notification History'}</h2><span className="text-sm text-gray-400">{currentNotifications.length} {currentNotifications.length === 1 ? 'notification' : 'notifications'}</span></div>
                <div className="divide-y divide-white/5">
                    {loading ? (<div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div></div>
                    ) : currentNotifications.length === 0 ? (<div className="p-12 text-center text-gray-500"><Bell className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>{activeTab === 'unread' ? "No unread notifications. You're all caught up!" : "No notification history found."}</p></div>
                    ) : (currentNotifications.map((notification) => (
                        <div key={notification.id} className="p-6 hover:bg-white/5 transition-colors group flex gap-4 cursor-pointer" onClick={() => { setSelectedNotification(notification); setShowDetailModal(true); }}>
                            <div className={cn("mt-1 p-2 rounded-lg", getNotificationColor(notification.type))}>{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start"><h3 className="text-white font-medium">{notification.subject}</h3><span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}</span></div>
                                <p className="text-gray-400 mt-1 text-sm leading-relaxed">{notification.message}</p>
                                {notification.error && <p className="text-xs text-red-400 mt-2">Error: {notification.error}</p>}
                            </div>
                            {activeTab === 'unread' && <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white" onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}><X className="w-4 h-4" /></Button>}
                        </div>
                    )))}
                </div>
            </Card>

            {showDetailModal && selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 rounded-xl shadow-2xl border border-white/10 max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/10 flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1"><div className={cn('mt-1 p-3 rounded-xl', getNotificationColor(selectedNotification.type))}>{getNotificationIcon(selectedNotification.type)}</div><div className="flex-1"><h2 className="text-2xl font-bold text-white">{selectedNotification.subject}</h2><p className="text-sm text-gray-400 mt-2 flex items-center gap-2"><Clock className="w-4 h-4" />{formatDistanceToNow(new Date(selectedNotification.sentAt), { addSuffix: true })}</p></div></div>
                            <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6"><div className="prose prose-invert max-w-none"><p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">{selectedNotification.message}</p></div>{selectedNotification.error && <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-lg"><p className="text-sm text-red-400 font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Error Details:</p><p className="text-sm text-red-300 mt-2">{selectedNotification.error}</p></div>}</div>
                        <div className="p-6 border-t border-white/10 flex justify-between items-center"><span className="text-sm text-gray-400">Type: <span className="text-electric-cyan font-medium capitalize">{selectedNotification.type.replace('_', ' ')}</span></span><div className="flex gap-3">{activeTab === 'unread' && <Button onClick={() => { markAsRead(selectedNotification.id); setShowDetailModal(false); }} variant="glow" className="flex items-center gap-2"><Check className="w-4 h-4" />Mark as Read</Button>}<Button onClick={() => setShowDetailModal(false)} variant="outline" className="border-white/10">Close</Button></div></div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
