'use client';

import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  WavingHand as WaveIcon,
  TrendingUp as TrendingUpIcon,
  QrCode2 as QrCode2Icon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface WelcomeBackBannerProps {
  userName?: string;
}

interface LoginInfo {
  lastLoginAt: string | null;
  newScans: number;
  newQRCodes: number;
  daysSinceLastLogin: number;
}

export default function WelcomeBackBanner({ userName }: WelcomeBackBannerProps) {
  const [open, setOpen] = useState(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginInfo();
  }, []);

  const fetchLoginInfo = async () => {
    try {
      const response = await fetch('/api/user/login-info');
      if (response.ok) {
        const data = await response.json();
        setLoginInfo(data);
        
        // Show banner if user has been away for more than 1 day or has new activity
        if (data.daysSinceLastLogin > 0 || data.newScans > 0 || data.newQRCodes > 0) {
          setOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch login info:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastLogin = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return 'your first time here';
    
    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading || !loginInfo || !open) return null;

  return (
    <Collapse in={open}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert
          severity="info"
          icon={<WaveIcon />}
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Welcome back, {userName || 'there'}! 👋
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
              {loginInfo.lastLoginAt 
                ? `Your last visit was ${formatLastLogin(loginInfo.lastLoginAt)}`
                : "This is your first time here! Let's get started."}
            </Typography>

            {(loginInfo.newScans > 0 || loginInfo.newQRCodes > 0) && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {loginInfo.newScans > 0 && (
                  <Chip
                    icon={<VisibilityIcon />}
                    label={`${loginInfo.newScans} new scan${loginInfo.newScans !== 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                )}
                {loginInfo.newQRCodes > 0 && (
                  <Chip
                    icon={<QrCode2Icon />}
                    label={`${loginInfo.newQRCodes} new QR code${loginInfo.newQRCodes !== 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                )}
                {loginInfo.daysSinceLastLogin >= 7 && (
                  <Chip
                    icon={<TrendingUpIcon />}
                    label="Missed you!"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                )}
              </Stack>
            )}
          </Box>
        </Alert>
      </motion.div>
    </Collapse>
  );
}
