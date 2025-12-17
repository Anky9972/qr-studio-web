'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  QrCode,
  Scan,
  UploadCloud,
  BarChart2,
  ArrowUpRight,
  MapPin,
  Smartphone,
  Clock,
  Zap,
  TrendingUp,
  Activity as ActivityIcon,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import WelcomeBackBanner from '@/components/WelcomeBackBanner';
import { useTranslations } from '@/lib/useTranslations';

interface DashboardStats {
  totalQRCodes: number;
  totalScans: number;
  qrCodesThisMonth: number;
  scansThisMonth: number;
  dynamicQRCodes: number;
  activeCampaigns: number;
}

interface Activity {
  id: string;
  type: string;
  qrCodeName: string | null;
  qrType: string;
  scannedAt: string;
  location: string;
  device: string;
}

interface TodayInsights {
  todayScans: number;
  scanTrend: string;
  todayQRCodes: number;
  mostScanned: {
    name: string | null;
    type: string;
    scans: number;
  } | null;
  topLocations: Array<{
    country: string;
    count: number;
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<TodayInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes, insightsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/activity'),
        fetch('/api/dashboard/insights'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (activityRes.ok) {
        const data = await activityRes.json();
        setActivity(data.activity);
      }
      if (insightsRes.ok) setInsights(await insightsRes.json());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current: number, total: number) => {
    if (total === 0) return '+0%';
    const percentage = ((current / total) * 100).toFixed(1);
    return `+${percentage}%`;
  };

  const calculateScanRate = () => {
    if (!stats || stats.totalQRCodes === 0) return '0%';
    const rate = ((stats.totalScans / stats.totalQRCodes) * 100).toFixed(1);
    return `${rate}%`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  const quickActions = [
    {
      icon: QrCode,
      title: t('quickActions.generateQR'),
      description: t('quickActions.generateQRDesc'),
      href: '/dashboard/generate',
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      icon: Scan,
      title: t('quickActions.scanQR'),
      description: t('quickActions.scanQRDesc'),
      href: '/dashboard/scan',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      icon: UploadCloud,
      title: t('quickActions.bulkCreate'),
      description: t('quickActions.bulkCreateDesc'),
      href: '/dashboard/bulk',
      gradient: 'from-violet-500 to-purple-400',
    },
    {
      icon: BarChart2,
      title: t('quickActions.analytics'),
      description: t('quickActions.analyticsDesc'),
      href: '/dashboard/analytics',
      gradient: 'from-amber-500 to-orange-400',
    },
  ];

  const statsData = [
    {
      label: t('stats.totalQRCodes'),
      value: stats?.totalQRCodes.toLocaleString() || '0',
      icon: QrCode,
      change: calculateChange(stats?.qrCodesThisMonth || 0, stats?.totalQRCodes || 1),
      color: 'text-electric-blue'
    },
    {
      label: t('stats.totalScans'),
      value: stats?.totalScans.toLocaleString() || '0',
      icon: ActivityIcon,
      change: calculateChange(stats?.scansThisMonth || 0, stats?.totalScans || 1),
      color: 'text-electric-emerald'
    },
    {
      label: t('stats.scanRate'),
      value: calculateScanRate(),
      icon: Zap,
      change: '+0%',
      color: 'text-electric-amber'
    },
    {
      label: t('stats.activeCampaigns'),
      value: stats?.activeCampaigns.toString() || '0',
      icon: TrendingUp,
      change: '+0%',
      color: 'text-electric-cyan'
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-electric-cyan border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Back Banner */}
      <WelcomeBackBanner userName={session?.user?.name?.split(' ')[0]} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
            {getGreeting()}, <span className="text-electric-cyan font-bold">{session?.user?.name?.split(' ')[0] || 'User'}</span>! 👋
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            {t('welcomeMessage')}
          </p>
        </motion.div>

        <div className="flex gap-3">
          <Button
            onClick={fetchDashboardData}
            disabled={loading}
            variant="outline"
            size="lg"
            className="rounded-xl border-white/10 hover:bg-white/5"
          >
            <RefreshCw className={cn("w-5 h-5 mr-2", loading && "animate-spin")} />
            {t('refresh')}
          </Button>
          <Link href="/dashboard/generate">
            <Button variant="premium" size="lg" className="rounded-xl shadow-lg shadow-blue-500/20">
              <QrCode className="w-5 h-5 mr-2" />
              {t('createNewQR')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="glass" className="h-full relative overflow-hidden group hover:border-white/20 transition-all duration-300 bg-zinc-900 border-zinc-800">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {stat.change}
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-electric-amber" /> {t('quickActions.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-1 group">
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br", action.gradient)} />
                  <div className="relative h-full p-5 rounded-xl bg-white/5 flex flex-col items-center text-center justify-center gap-3 transition-colors group-hover:bg-transparent">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", action.gradient)}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity: Takes up 2 columns */}
        <div className="lg:col-span-2">
          <Card variant="glass" className="h-full bg-zinc-900 border-zinc-800">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-electric-blue" /> {t('recentActivity.title')}
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">{t('recentActivity.viewAll')}</Button>
            </div>
            <div className="divide-y divide-zinc-800">
              {activity.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ActivityIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">{t('recentActivity.empty')}</p>
                </div>
              ) : (
                activity.map((item) => (
                  <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Scan className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-medium text-white text-sm truncate">
                        {item.qrCodeName || 'Unnamed QR'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {item.device}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium bg-white/10 text-gray-300 px-2 py-1 rounded-md">
                        {item.qrType}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{getTimeAgo(item.scannedAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Widgets: Takes up 1 column */}
        <div className="space-y-6">

          {/* Today's Insights */}
          <Card variant="glass" className="overflow-hidden bg-zinc-900 border-zinc-800">
            <div className="p-5 border-b border-zinc-800 bg-gradient-to-r from-white/5 to-transparent">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-electric-violet" /> {t('todayInsights.title')}
              </h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-400">{t('todayInsights.scansToday')}</p>
                  <p className="text-3xl font-bold text-white mt-1">{insights?.todayScans || 0}</p>
                </div>
                <div className={cn("px-2 py-1 rounded-lg text-xs font-bold", Number(insights?.scanTrend || 0) >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                  {Number(insights?.scanTrend || 0) > 0 ? '+' : ''}{insights?.scanTrend || '0'}%
                </div>
              </div>

              {insights?.mostScanned && (
                <div className="p-3 rounded-xl bg-white/5 border border-zinc-800">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('todayInsights.mostScanned')}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate max-w-[120px]">
                      {insights.mostScanned.name || 'Unnamed'}
                    </span>
                    <span className="text-xs font-bold text-electric-blue">{insights.mostScanned.scans} {t('todayInsights.scans')}</span>
                  </div>
                </div>
              )}

              {insights?.topLocations && insights.topLocations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('todayInsights.topLocations')}</p>
                  <div className="space-y-2">
                    {insights.topLocations.map((loc, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                          {loc.country}
                        </div>
                        <span className="font-mono text-gray-400">{loc.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Storage / Usage */}
          <Card variant="glass" className="p-5 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10">
                <HardDrive className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h4 className="font-bold text-white">{t('storage.title')}</h4>
                <p className="text-xs text-gray-400">{t('storage.qrCodeLimit')}</p>
              </div>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-300 font-medium">{stats?.totalQRCodes || 0} / 1,000</span>
              <span className="text-electric-blue font-bold">{((stats?.totalQRCodes || 0) / 10).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-electric-blue to-electric-cyan rounded-full transition-all duration-500"
                style={{ width: `${(stats?.totalQRCodes || 0) / 10}%` }}
              />
            </div>
          </Card>

          {/* Upgrade Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-electric-blue to-electric-violet p-6 text-white shadow-lg">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

            <h3 className="relative z-10 text-lg font-bold mb-1">{t('upgrade.title')}</h3>
            <p className="relative z-10 text-sm text-white/90 mb-4 leading-relaxed">
              {t('upgrade.description')}
            </p>
            <Button variant="premium" className="relative z-10 w-full bg-white text-electric-blue hover:bg-white/90 border-none shadow-none">
              {t('upgrade.button')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
