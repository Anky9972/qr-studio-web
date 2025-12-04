'use client';

import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { io, Socket } from 'socket.io-client';

interface RealtimeMetrics {
  scansLastMinute: number;
  activeQRCodes: number;
  currentViewers: number;
  scansToday: number;
}

interface RealtimeScan {
  timestamp: string;
  location: string;
  device: string;
  qrCodeName: string;
}

export default function RealtimeDashboard() {
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    scansLastMinute: 0,
    activeQRCodes: 0,
    currentViewers: 1,
    scansToday: 0,
  });

  const [recentScans, setRecentScans] = useState<RealtimeScan[]>([]);
  const [chartData, setChartData] = useState<{ time: string; scans: number }[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      path: '/api/socket',
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to real-time analytics');
    });

    socketInstance.on('metrics:update', (data: RealtimeMetrics) => {
      setMetrics(data);
    });

    socketInstance.on('scan:new', (scan: RealtimeScan) => {
      setRecentScans(prev => [scan, ...prev.slice(0, 9)]);
      
      // Update chart data
      const now = new Date();
      const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setChartData(prev => {
        const updated = [...prev];
        const lastEntry = updated[updated.length - 1];
        
        if (lastEntry && lastEntry.time === timeLabel) {
          lastEntry.scans += 1;
        } else {
          updated.push({ time: timeLabel, scans: 1 });
        }
        
        return updated.slice(-20); // Keep last 20 minutes
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from real-time analytics');
    });

    setSocket(socketInstance);

    // Simulate data updates for demo (remove in production)
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      setMetrics(prev => ({
        ...prev,
        scansLastMinute: Math.floor(Math.random() * 10),
        scansToday: prev.scansToday + Math.floor(Math.random() * 3),
      }));
    }, 5000);

    return () => {
      socketInstance.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Real-time Analytics Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Live updates every second
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Scans/Minute
              </Typography>
            </Box>
            <Typography variant="h4">{metrics.scansLastMinute}</Typography>
            <Chip label="Live" color="success" size="small" sx={{ mt: 1 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <QrCode2Icon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Active QR Codes
              </Typography>
            </Box>
            <Typography variant="h4">{metrics.activeQRCodes}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <VisibilityIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Current Viewers
              </Typography>
            </Box>
            <Typography variant="h4">{metrics.currentViewers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Scans Today
              </Typography>
            </Box>
            <Typography variant="h4">{metrics.scansToday}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Real-time Chart */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Scans Over Time (Last 20 Minutes)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="scans"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Recent Scans */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Scans
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {recentScans.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Waiting for scans...
            </Typography>
          ) : (
            recentScans.map((scan, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  mb: 1,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {scan.qrCodeName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {scan.location} • {scan.device}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(scan.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
}
