'use client';

import { Alert, AlertTitle, Box, Button, LinearProgress, Typography } from '@mui/material';
import { Warning, Error as ErrorIcon, TrendingUp } from '@mui/icons-material';
import Link from 'next/link';
import { shouldShowLimitWarning } from '@/middleware/planLimits';

interface LimitWarningProps {
  current: number;
  limit: number;
  resourceName: string;
  upgradeLink?: string;
  onUpgradeClick?: () => void;
}

export default function LimitWarning({
  current,
  limit,
  resourceName,
  upgradeLink = '/pricing',
  onUpgradeClick,
}: LimitWarningProps) {
  const percentage = (current / limit) * 100;
  const warning = shouldShowLimitWarning(percentage);

  if (!warning.show) {
    return null;
  }

  const isLimitReached = percentage >= 100;
  const severity = warning.severity;
  const Icon = severity === 'error' ? ErrorIcon : Warning;

  const getMessage = () => {
    if (isLimitReached) {
      return `You've reached your limit of ${limit} ${resourceName}`;
    } else if (percentage >= 95) {
      return `You're almost at your limit (${current}/${limit} ${resourceName})`;
    } else if (percentage >= 90) {
      return `You're approaching your limit (${current}/${limit} ${resourceName})`;
    } else {
      return `You've used ${current} of ${limit} ${resourceName}`;
    }
  };

  return (
    <Alert
      severity={severity}
      icon={<Icon />}
      sx={{ mb: 2 }}
      action={
        <Button
          component={Link}
          href={upgradeLink}
          size="small"
          variant="contained"
          color={severity === 'error' ? 'error' : 'warning'}
          startIcon={<TrendingUp />}
          onClick={onUpgradeClick}
        >
          Upgrade
        </Button>
      }
    >
      <AlertTitle>{isLimitReached ? 'Limit Reached' : 'Approaching Limit'}</AlertTitle>
      <Box>
        <Typography variant="body2" gutterBottom>
          {getMessage()}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            color={severity === 'error' ? 'error' : 'warning'}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {percentage.toFixed(1)}% used
          </Typography>
        </Box>
      </Box>
    </Alert>
  );
}
