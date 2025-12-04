'use client';

import { Box, Card, CardContent, LinearProgress, Typography, Chip, Stack } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

interface LimitDisplayProps {
  current: number;
  limit: number;
  label: string;
  icon?: React.ReactNode;
}

export function LimitDisplay({ current, limit, label, icon }: LimitDisplayProps) {
  const percentage = (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const getColor = () => {
    if (isAtLimit) return 'error';
    if (isNearLimit) return 'warning';
    return 'primary';
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography variant="subtitle2" fontWeight="medium">
              {label}
            </Typography>
          </Box>
          {isAtLimit && (
            <Chip label="Limit Reached" color="error" size="small" />
          )}
          {isNearLimit && !isAtLimit && (
            <Chip label="Near Limit" color="warning" size="small" />
          )}
        </Stack>

        <Typography variant="h6" gutterBottom>
          {current} / {limit === 999999 ? '∞' : limit.toLocaleString()}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={Math.min(percentage, 100)}
          color={getColor()}
          sx={{ height: 8, borderRadius: 4, mb: 1 }}
        />

        <Typography variant="caption" color="text.secondary">
          {percentage.toFixed(1)}% used
        </Typography>
      </CardContent>
    </Card>
  );
}

interface LimitsOverviewProps {
  limits: {
    qrCodes: { current: number; limit: number };
    dynamicQrCodes: { current: number; limit: number };
    teamMembers: { current: number; limit: number };
    apiKeys: { current: number; limit: number };
  };
}

export function LimitsOverview({ limits }: LimitsOverviewProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
        <TrendingUp />
        Usage & Limits
      </Typography>

      <Stack spacing={2} mt={2}>
        <LimitDisplay
          current={limits.qrCodes.current}
          limit={limits.qrCodes.limit}
          label="Total QR Codes"
        />
        <LimitDisplay
          current={limits.dynamicQrCodes.current}
          limit={limits.dynamicQrCodes.limit}
          label="Dynamic QR Codes"
        />
        <LimitDisplay
          current={limits.teamMembers.current}
          limit={limits.teamMembers.limit}
          label="Team Members"
        />
        <LimitDisplay
          current={limits.apiKeys.current}
          limit={limits.apiKeys.limit}
          label="API Keys"
        />
      </Stack>
    </Box>
  );
}
