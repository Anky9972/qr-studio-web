'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import WelcomeBackBanner from '@/components/WelcomeBackBanner';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

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
  const theme = useTheme();
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<TodayInsights | null>(null);
  const [loading, setLoading] = useState(true);

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

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivity(activityData.activity);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
      }
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
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      icon: QrCode2Icon,
      title: 'Generate QR Code',
      description: 'Create a new QR code with custom design',
      href: '/dashboard/generate',
      color: theme.palette.primary.main,
      gradient: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
    },
    {
      icon: QrCodeScannerIcon,
      title: 'Scan QR Code',
      description: 'Scan QR codes using your camera',
      href: '/dashboard/scan',
      color: theme.palette.success.main,
      gradient: 'linear-gradient(135deg, #006E1C 0%, #4D9C5E 100%)',
    },
    {
      icon: CloudUploadIcon,
      title: 'Bulk Generate',
      description: 'Create multiple QR codes at once',
      href: '/dashboard/bulk',
      color: theme.palette.info.main,
      gradient: 'linear-gradient(135deg, #006874 0%, #4F9BA7 100%)',
    },
    {
      icon: AnalyticsIcon,
      title: 'View Analytics',
      description: 'Track your QR code performance',
      href: '/dashboard/analytics',
      color: theme.palette.warning.main,
      gradient: 'linear-gradient(135deg, #FF8C00 0%, #FFB74D 100%)',
    },
  ];

  const statsData = [
    { 
      label: 'Total QR Codes', 
      value: stats?.totalQRCodes.toLocaleString() || '0', 
      icon: QrCode2Icon, 
      change: calculateChange(stats?.qrCodesThisMonth || 0, stats?.totalQRCodes || 1), 
      color: theme.palette.primary.main 
    },
    { 
      label: 'Total Scans', 
      value: stats?.totalScans.toLocaleString() || '0', 
      icon: VisibilityIcon, 
      change: calculateChange(stats?.scansThisMonth || 0, stats?.totalScans || 1), 
      color: theme.palette.success.main 
    },
    { 
      label: 'Scan Rate', 
      value: calculateScanRate(), 
      icon: SpeedIcon, 
      change: '+0%', 
      color: theme.palette.info.main 
    },
    { 
      label: 'Active Campaigns', 
      value: stats?.activeCampaigns.toString() || '0', 
      icon: TrendingUpIcon, 
      change: '+0%', 
      color: theme.palette.warning.main 
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Back Banner */}
      <WelcomeBackBanner userName={session?.user?.name?.split(' ')[0]} />

      {/* Welcome Section */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your QR codes today
          </Typography>
        </Box>
      </MotionBox>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2.5,
          mb: 4,
        }}
      >
        {statsData.map((stat, index) => (
          <MotionCard
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{
              y: -4,
              transition: { type: 'spring', stiffness: 400, damping: 10 },
            }}
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
              borderTop: `3px solid ${stat.color}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 8px 24px ${stat.color}40`
                  : `0 8px 24px ${stat.color}20`,
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  color="success"
                  sx={{
                    height: 24,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ 
                color: theme.palette.text.primary,
                mb: 0.5,
              }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {stat.label}
              </Typography>
            </CardContent>
          </MotionCard>
        ))}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2.5,
          }}
        >
          {quickActions.map((action, index) => (
            <Link href={action.href} key={action.title} style={{ textDecoration: 'none' }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                  whileHover={{
                    y: -6,
                    transition: { type: 'spring', stiffness: 400, damping: 10 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.03)' 
                      : '#ffffff',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    borderLeft: `4px solid ${action.color}`,
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'dark'
                        ? `0 8px 24px ${action.color}40`
                        : `0 8px 24px ${action.color}20`,
                      borderLeftWidth: '6px',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: `${action.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <action.icon sx={{ color: action.color, fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: theme.palette.text.primary }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.875rem' }}>
                      {action.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Link>
          ))}
        </Box>
      </Box>

      {/* Recent Activity and Insights */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 2.5,
        }}
      >
        <MotionPaper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.03)' 
                : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2.5 }}>
              {activity.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity yet. Start by generating your first QR code!
                  </Typography>
                </Box>
              ) : (
                activity.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Avatar
                      sx={{
                        background: '#1976D2',
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <QrCodeScannerIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.qrCodeName || 'QR Code'} scanned
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getTimeAgo(item.scannedAt)} • {item.location} • {item.device}
                      </Typography>
                    </Box>
                    <Chip 
                      label={item.qrType} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                ))
              )}
            </Box>
          </MotionPaper>

        <Box>
          {/* Today's Insights */}
          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              mb: 2.5,
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.03)' 
                : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Today's Insights
            </Typography>
            <Box sx={{ mt: 2.5 }}>
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Scans Today
                  </Typography>
                  <Chip 
                    label={`${insights?.scanTrend || '0'}%`}
                    size="small"
                    color={Number(insights?.scanTrend || 0) >= 0 ? 'success' : 'error'}
                    sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {insights?.todayScans || 0}
                </Typography>
              </Box>

              {insights?.mostScanned && (
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1.5, 
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  mb: 2,
                }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Most Scanned Today
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {insights.mostScanned.name || 'Unnamed QR Code'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {insights.mostScanned.scans} scans • {insights.mostScanned.type}
                  </Typography>
                </Box>
              )}

              {insights?.topLocations && insights.topLocations.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Top Locations Today
                  </Typography>
                  {insights.topLocations.map((loc, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {loc.country}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {loc.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </MotionPaper>

          {/* Storage Usage */}
          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              mb: 2.5,
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.03)' 
                : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Storage Usage
            </Typography>
            <Box sx={{ mt: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {stats?.totalQRCodes || 0} of 1,000 QR Codes
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {((stats?.totalQRCodes || 0) / 10).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats?.totalQRCodes || 0) / 10}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  '& .MuiLinearProgress-bar': {
                    background: '#1976D2',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </MotionPaper>

          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
              color: 'white',
              border: 'none',
            }}
          >
            <StarIcon sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Upgrade to Pro
            </Typography>
            <Typography variant="body2" sx={{ mb: 2.5, opacity: 0.95, lineHeight: 1.6 }}>
              Get unlimited QR codes, advanced analytics, and priority support
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: 'white',
                color: '#1976D2',
                fontWeight: 600,
                py: 1.2,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.95)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Upgrade Now
            </Button>
          </MotionPaper>
        </Box>
      </Box>
    </Container>
  );
}
