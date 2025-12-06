'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  QrCode,
  Eye,
  Smartphone,
  Calendar,
  Filter
} from 'lucide-react';
import { useScanHistoryStore } from '@/store/scanHistoryStore';
import { useQRCodeStore } from '@/store/qrCodeStore';
import { Card } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { DataAssistant } from '@/components/analytics/DataAssistant';

interface AnalyticsData {
  totalScans: number;
  totalQRCodes: number;
  avgScansPerDay: number;
  topQRType: string;
}

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color || p.fill }} className="text-sm">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { scans } = useScanHistoryStore();
  const { qrCodes } = useQRCodeStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalScans: 0,
    totalQRCodes: 0,
    avgScansPerDay: 0,
    topQRType: 'url',
  });

  useEffect(() => {
    calculateAnalytics();
  }, [scans, qrCodes, timeRange]);

  const calculateAnalytics = () => {
    const now = new Date();
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      'all': 365 * 10,
    };
    const days = daysMap[timeRange];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredScans = scans.filter(
      scan => new Date(scan.timestamp) >= cutoffDate
    );

    const qrTypeCount: Record<string, number> = {};
    filteredScans.forEach(scan => {
      qrTypeCount[scan.type] = (qrTypeCount[scan.type] || 0) + 1;
    });

    const topQRType = Object.entries(qrTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'url';

    setAnalytics({
      totalScans: filteredScans.length,
      totalQRCodes: qrCodes.length,
      avgScansPerDay: days > 0 ? filteredScans.length / days : 0,
      topQRType,
    });
  };

  const getDailyScanData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayScans = scans.filter(scan => {
        const scanDate = new Date(scan.timestamp);
        return scanDate.toDateString() === date.toDateString();
      });

      data.push({
        date: dateStr,
        scans: dayScans.length,
      });
    }

    return data;
  };

  const getQRTypeDistribution = () => {
    const typeCount: Record<string, number> = {};
    scans.forEach(scan => {
      typeCount[scan.type] = (typeCount[scan.type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }));
  };

  const getScanSourceData = () => {
    const sourceCount: Record<string, number> = {};
    scans.forEach(scan => {
      sourceCount[scan.source] = (sourceCount[scan.source] || 0) + 1;
    });

    return Object.entries(sourceCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  const getHourlyDistribution = () => {
    const hourCount: Record<number, number> = {};

    scans.forEach(scan => {
      const hour = new Date(scan.timestamp).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    const data = [];
    for (let i = 0; i < 24; i++) {
      // Format hour to 12h format simply
      const hourLabel = i === 0 ? '12am' : i < 12 ? `${i}am` : i === 12 ? '12pm' : `${i - 12}pm`;
      data.push({
        hour: hourLabel,
        // use raw i for sorting if needed but label for display. Actually rechart uses original data.
        hourOriginal: i,
        scans: hourCount[i] || 0,
      });
    }

    return data;
  };

  const statCards = [
    {
      title: 'Total Scans',
      value: analytics.totalScans,
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      change: '+12% vs last period',
    },
    {
      title: 'Total QR Codes',
      value: analytics.totalQRCodes,
      icon: QrCode,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      change: `${qrCodes.filter(qr => qr.type === 'dynamic').length} dynamic`,
    },
    {
      title: 'Avg Scans/Day',
      value: analytics.avgScansPerDay.toFixed(1),
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      change: `Last ${timeRange}`,
    },
    {
      title: 'Top QR Type',
      value: analytics.topQRType.toUpperCase(),
      icon: Smartphone,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      change: 'Most popular',
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Track your QR code performance and insights.</p>
        </div>
        <div className="w-[180px]">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} variant="glass" className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-2 border-t border-white/5 pt-2 inline-block">
                  {stat.change}
                </p>
              </div>
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card variant="glass" className="lg:col-span-2 p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <TrendingUp size={18} className="mr-2 text-primary" /> Scan Activity
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getDailyScanData()}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* QR Type Pie Chart */}
        <Card variant="glass" className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <QrCode size={18} className="mr-2 text-primary" /> Type Distribution
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getQRTypeDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getQRTypeDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Bar Chart */}
        <Card variant="glass" className="lg:col-span-2 p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Calendar size={18} className="mr-2 text-primary" /> Scans by Time of Day
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getHourlyDistribution()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="scans" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Source Pie Chart */}
        <Card variant="glass" className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Filter size={18} className="mr-2 text-primary" /> Scan Sources
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getScanSourceData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getScanSourceData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <DataAssistant data={{
        title: "Analytics Dashboard",
        summary: analytics,
        trends: getDailyScanData(),
        distribution: getQRTypeDistribution(),
        sources: getScanSourceData(),
        history: scans.slice(0, 50) // Limit granular history to save context
      }} />
    </div>
  );
}
