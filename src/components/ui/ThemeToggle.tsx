'use client';

import { IconButton, Tooltip, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useDashboardTheme } from '@/components/providers/DashboardThemeProvider';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useDashboardTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`} arrow>
      <IconButton
        onClick={toggleTheme}
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            bgcolor: mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(66, 165, 245, 0.12)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        <AnimatePresence mode="wait">
          {mode === 'light' ? (
            <motion.div
              key="light"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 180, scale: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.68, -0.55, 0.265, 1.55],
              }}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LightModeIcon sx={{ color: 'warning.main' }} />
            </motion.div>
          ) : (
            <motion.div
              key="dark"
              initial={{ rotate: 180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -180, scale: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.68, -0.55, 0.265, 1.55],
              }}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DarkModeIcon sx={{ color: 'primary.main' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
}
