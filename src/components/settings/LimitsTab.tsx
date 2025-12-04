'use client';

import { Box, Card, CardContent, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import Link from 'next/link';
import { useUserLimits } from '@/hooks/useUserLimits';
import { LimitsOverview } from '@/components/ui/LimitDisplay';
import LimitWarning from '@/components/ui/LimitWarning';

export default function LimitsTab() {
  const { limits, loading, error } = useUserLimits();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !limits) {
    return (
      <Box>
        <Typography color="error">Failed to load limits information</Typography>
      </Box>
    );
  }

  const warnings = [
    { ...limits.qrCodes, resourceName: 'QR codes' },
    { ...limits.dynamicQrCodes, resourceName: 'dynamic QR codes' },
    { ...limits.teamMembers, resourceName: 'team members' },
    { ...limits.apiKeys, resourceName: 'API keys' },
  ].filter((item) => item.percentage >= 80);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Plan & Usage Limits
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Monitor your current plan usage and limits
      </Typography>

      {/* Current Plan */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="overline" color="text.secondary">
                Current Plan
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {limits.plan}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<TrendingUp />}
              component={Link}
              href="/pricing"
            >
              Upgrade Plan
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Warnings */}
      {warnings.map((warning) => (
        <LimitWarning
          key={warning.resourceName}
          current={warning.current}
          limit={warning.limit}
          resourceName={warning.resourceName}
        />
      ))}

      {/* Limits Overview */}
      <LimitsOverview
        limits={{
          qrCodes: { current: limits.qrCodes.current, limit: limits.qrCodes.limit },
          dynamicQrCodes: {
            current: limits.dynamicQrCodes.current,
            limit: limits.dynamicQrCodes.limit,
          },
          teamMembers: {
            current: limits.teamMembers.current,
            limit: limits.teamMembers.limit,
          },
          apiKeys: { current: limits.apiKeys.current, limit: limits.apiKeys.limit },
        }}
      />

      {/* Plan Details */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Plan Limits
          </Typography>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography>Total QR Codes</Typography>
              <Typography fontWeight="medium">
                {limits.limits.qrCodes === 999999 ? 'Unlimited' : limits.limits.qrCodes.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Dynamic QR Codes</Typography>
              <Typography fontWeight="medium">
                {limits.limits.dynamicQrCodes === 999999
                  ? 'Unlimited'
                  : limits.limits.dynamicQrCodes.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Bulk Generation (per batch)</Typography>
              <Typography fontWeight="medium">
                {limits.limits.bulkGeneration === 999999
                  ? 'Unlimited'
                  : limits.limits.bulkGeneration.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Team Members</Typography>
              <Typography fontWeight="medium">
                {limits.limits.teamMembers === 999999
                  ? 'Unlimited'
                  : limits.limits.teamMembers.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>API Calls (per month)</Typography>
              <Typography fontWeight="medium">
                {limits.limits.apiCalls === 0
                  ? 'Not Available'
                  : limits.limits.apiCalls === 999999
                  ? 'Unlimited'
                  : limits.limits.apiCalls.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
