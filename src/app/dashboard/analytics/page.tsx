'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DevicesIcon from '@mui/icons-material/Devices'
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
} from 'recharts'
import { useScanHistoryStore } from '@/store/scanHistoryStore'
import { useQRCodeStore } from '@/store/qrCodeStore'

interface AnalyticsData {
  totalScans: number
  totalQRCodes: number
  avgScansPerDay: number
  topQRType: string
}

export default function AnalyticsPage() {
  const { scans } = useScanHistoryStore()
  const { qrCodes } = useQRCodeStore()
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d, all
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalScans: 0,
    totalQRCodes: 0,
    avgScansPerDay: 0,
    topQRType: 'url',
  })

  useEffect(() => {
    calculateAnalytics()
  }, [scans, qrCodes, timeRange])

  const calculateAnalytics = () => {
    const now = new Date()
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      'all': 365 * 10,
    }
    const days = daysMap[timeRange]
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    const filteredScans = scans.filter(
      scan => new Date(scan.timestamp) >= cutoffDate
    )

    const qrTypeCount: Record<string, number> = {}
    filteredScans.forEach(scan => {
      qrTypeCount[scan.type] = (qrTypeCount[scan.type] || 0) + 1
    })

    const topQRType = Object.entries(qrTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'url'

    setAnalytics({
      totalScans: filteredScans.length,
      totalQRCodes: qrCodes.length,
      avgScansPerDay: days > 0 ? filteredScans.length / days : 0,
      topQRType,
    })
  }

  // Generate daily scan data
  const getDailyScanData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30
    const data = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      const dayScans = scans.filter(scan => {
        const scanDate = new Date(scan.timestamp)
        return scanDate.toDateString() === date.toDateString()
      })

      data.push({
        date: dateStr,
        scans: dayScans.length,
        generated: 0, // Would be from API in production
      })
    }

    return data
  }

  // Get QR type distribution
  const getQRTypeDistribution = () => {
    const typeCount: Record<string, number> = {}
    scans.forEach(scan => {
      typeCount[scan.type] = (typeCount[scan.type] || 0) + 1
    })

    return Object.entries(typeCount).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }))
  }

  // Get scan source distribution
  const getScanSourceData = () => {
    const sourceCount: Record<string, number> = {}
    scans.forEach(scan => {
      sourceCount[scan.source] = (sourceCount[scan.source] || 0) + 1
    })

    return Object.entries(sourceCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
  }

  // Get hourly distribution
  const getHourlyDistribution = () => {
    const hourCount: Record<number, number> = {}
    
    scans.forEach(scan => {
      const hour = new Date(scan.timestamp).getHours()
      hourCount[hour] = (hourCount[hour] || 0) + 1
    })

    const data = []
    for (let i = 0; i < 24; i++) {
      data.push({
        hour: `${i}:00`,
        scans: hourCount[i] || 0,
      })
    }

    return data
  }

  const COLORS = ['#1976D2', '#4CAF50', '#00BCD4', '#FF9800', '#F44336', '#26A69A']

  const statCards = [
    {
      title: 'Total Scans',
      value: analytics.totalScans,
      icon: VisibilityIcon,
      color: '#1976D2',
      change: '+12% from last period',
    },
    {
      title: 'Total QR Codes',
      value: analytics.totalQRCodes,
      icon: QrCode2Icon,
      color: '#4CAF50',
      change: `${qrCodes.filter(qr => qr.type === 'dynamic').length} dynamic`,
    },
    {
      title: 'Avg Scans/Day',
      value: analytics.avgScansPerDay.toFixed(1),
      icon: TrendingUpIcon,
      color: '#00BCD4',
      change: 'Last ' + timeRange,
    },
    {
      title: 'Top QR Type',
      value: analytics.topQRType.toUpperCase(),
      icon: DevicesIcon,
      color: '#FF9800',
      change: 'Most popular',
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your QR code performance and insights
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 3,
        mb: 4,
      }}>
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <stat.icon sx={{ color: stat.color, fontSize: 28 }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.change}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Row 1 */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        {/* Daily Scans Line Chart */}
        <Paper sx={{ flex: '1 1 60%', minWidth: 300, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Scan Activity Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getDailyScanData()}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976D2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1976D2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="#1976D2"
                fillOpacity={1}
                fill="url(#colorScans)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* QR Type Distribution Pie Chart */}
        <Paper sx={{ flex: '1 1 35%', minWidth: 300, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            QR Type Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getQRTypeDistribution()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getQRTypeDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Charts Row 2 */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Hourly Distribution Bar Chart */}
        <Paper sx={{ flex: '1 1 60%', minWidth: 300, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Scans by Hour of Day
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getHourlyDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Scan Source Pie Chart */}
        <Paper sx={{ flex: '1 1 35%', minWidth: 300, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Scan Source
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getScanSourceData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getScanSourceData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  )
}
