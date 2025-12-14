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
  Filter,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { DataAssistant } from '@/components/analytics/DataAssistant';

interface AnalyticsAPIData {
  totalScans: number;
  totalQRCodes: number;
  scansByDevice: Array<{ device: string; count: number }>;
  scansByBrowser: Array<{ browser: string; count: number }>;
  scansByCountry: Array<{ country: string; count: number }>;
  scansOverTime: Array<{ date: string; scans: number }>;
  topQRCodes: Array<{ id: string; name: string; scanCount: number }>;
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
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsAPIData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching analytics for range:', timeRange);
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      console.log('📊 Analytics response status:', response.status);
      
      if (response.ok) {
        const json = await response.json();
        console.log('📊 Analytics raw data:', json);
        // Handle both {data: ...} and direct data formats
        const data = json.data || json;
        console.log('📊 Analytics processed data:', data);
        setAnalyticsData(data);
        toast.success('Analytics data loaded');
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('📊 Analytics API error:', error);
        toast.error(error.error || 'Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('📊 Error fetching analytics:', error);
      toast.error('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  const getDailyScanData = () => {
    if (!analyticsData?.scansOverTime) {
      console.log('📊 No scansOverTime data available');
      return [];
    }
    console.log('📊 Processing scansOverTime:', analyticsData.scansOverTime);
    return analyticsData.scansOverTime.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      scans: Number(item.scans),
    }));
  };

  const getDeviceDistribution = () => {
    if (!analyticsData?.scansByDevice) {
      console.log('📊 No scansByDevice data available');
      return [];
    }
    console.log('📊 Processing scansByDevice:', analyticsData.scansByDevice);
    return analyticsData.scansByDevice.map(item => ({
      name: item.device,
      value: item.count,
    }));
  };

  const getBrowserDistribution = () => {
    if (!analyticsData?.scansByBrowser) {
      console.log('📊 No scansByBrowser data available');
      return [];
    }
    console.log('📊 Processing scansByBrowser:', analyticsData.scansByBrowser);
    return analyticsData.scansByBrowser.map(item => ({
      name: item.browser || 'Unknown',
      value: item.count,
    }));
  };

  const getTopCountries = () => {
    if (!analyticsData?.scansByCountry) {
      console.log('📊 No scansByCountry data available');
      return [];
    }
    console.log('📊 Processing scansByCountry:', analyticsData.scansByCountry);
    return analyticsData.scansByCountry.slice(0, 10).map(item => ({
      country: item.country || 'Unknown',
      scans: item.count,
    }));
  };

  const getDaysInRange = () => {
    const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, 'all': 365 };
    return daysMap[timeRange] || 7;
  };

  const statCards = [
    {
      title: 'Total Scans',
      value: analyticsData?.totalScans || 0,
      icon: Eye,
      color: 'text-electric-blue',
      bg: 'bg-electric-blue/10',
      change: `Last ${timeRange}`,
    },
    {
      title: 'Total QR Codes',
      value: analyticsData?.totalQRCodes || 0,
      icon: QrCode,
      color: 'text-electric-emerald',
      bg: 'bg-electric-emerald/10',
      change: 'All created codes',
    },
    {
      title: 'Avg Scans/Day',
      value: analyticsData ? ((analyticsData.totalScans / getDaysInRange()).toFixed(1)) : '0',
      icon: TrendingUp,
      color: 'text-electric-cyan',
      bg: 'bg-electric-cyan/10',
      change: `Over ${getDaysInRange()} days`,
    },
    {
      title: 'Top Countries',
      value: analyticsData?.scansByCountry?.[0]?.country || 'N/A',
      icon: MapPin,
      color: 'text-electric-violet',
      bg: 'bg-electric-violet/10',
      change: 'Most active location',
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
        <div className="flex gap-3">
          <Button
            onClick={fetchAnalytics}
            disabled={loading}
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
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
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="glass" className="p-6 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-24 mb-3"></div>
                  <div className="h-8 bg-white/10 rounded w-16 mb-3"></div>
                  <div className="h-3 bg-white/10 rounded w-20"></div>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
              </div>
            </Card>
          ))
        ) : (
          statCards.map((stat) => (
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
          ))
        )}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card variant="glass" className="lg:col-span-2 p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <TrendingUp size={18} className="mr-2 text-primary" /> Scan Activity
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
              </div>
            ) : getDailyScanData().length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No scan activity in this period</p>
              </div>
            ) : (
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
            )}
          </div>
        </Card>

        {/* Device Distribution Pie Chart */}
        <Card variant="glass" className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Smartphone size={18} className="mr-2 text-primary" /> Device Distribution
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
              </div>
            ) : getDeviceDistribution().length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Smartphone className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No device data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getDeviceDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                    dataKey="value"
                  >
                    {getDeviceDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Countries Bar Chart */}
        <Card variant="glass" className="lg:col-span-2 p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <MapPin size={18} className="mr-2 text-primary" /> Top Countries
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
              </div>
            ) : getTopCountries().length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MapPin className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No location data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getTopCountries()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="country" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="scans" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Browser Distribution Pie Chart */}
        <Card variant="glass" className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Filter size={18} className="mr-2 text-primary" /> Browser Distribution
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
              </div>
            ) : getBrowserDistribution().length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Filter className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No browser data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getBrowserDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getBrowserDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {analyticsData && (
        <DataAssistant data={{
          title: "Analytics Dashboard",
          summary: {
            totalScans: analyticsData.totalScans,
            totalQRCodes: analyticsData.totalQRCodes,
            topCountry: analyticsData.scansByCountry?.[0]?.country || 'N/A',
            topDevice: analyticsData.scansByDevice?.[0]?.device || 'N/A',
          },
          trends: getDailyScanData(),
          distribution: getDeviceDistribution(),
          browsers: getBrowserDistribution(),
          countries: getTopCountries(),
        }} />
      )}
    </div>
  );
}
