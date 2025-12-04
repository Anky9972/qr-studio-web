'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Check, TrendingUp } from '@mui/icons-material';
import Link from 'next/link';

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  message?: string;
  currentPlan?: string;
  suggestedPlan?: 'PRO' | 'BUSINESS' | 'ENTERPRISE';
}

export default function UpgradeDialog({
  open,
  onClose,
  message = 'You\'ve reached your plan limit',
  currentPlan = 'FREE',
  suggestedPlan = 'PRO',
}: UpgradeDialogProps) {
  const planFeatures: Record<string, string[]> = {
    PRO: [
      '100 dynamic QR codes',
      'Advanced analytics',
      'Full customization',
      'Bulk generation (1,000)',
      'Priority support',
    ],
    BUSINESS: [
      '1,000 dynamic QR codes',
      'Team collaboration (10 members)',
      'API access',
      'Bulk generation (10,000)',
      'Custom domains',
      'Advanced reports',
    ],
    ENTERPRISE: [
      'Unlimited QR codes',
      'Unlimited team members',
      'White-label options',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
  };

  const planPrices: Record<string, { monthly: number; annual: number }> = {
    PRO: { monthly: 19, annual: 190 },
    BUSINESS: { monthly: 49, annual: 490 },
    ENTERPRISE: { monthly: 0, annual: 0 },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Upgrade Your Plan
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            {message}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You're currently on the <strong>{currentPlan}</strong> plan.
            Upgrade to unlock more features and higher limits.
          </Typography>
        </Box>

        <Card sx={{ bgcolor: 'primary.50', border: 1, borderColor: 'primary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                {suggestedPlan}
              </Typography>
              <Chip label="RECOMMENDED" color="primary" size="small" />
            </Box>
            {planPrices[suggestedPlan].monthly > 0 ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight="bold" component="span">
                  ${planPrices[suggestedPlan].monthly}
                </Typography>
                <Typography variant="body1" color="text.secondary" component="span">
                  /month
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  or ${planPrices[suggestedPlan].annual}/year (save 16%)
                </Typography>
              </Box>
            ) : (
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Custom Pricing
              </Typography>
            )}
            <List dense>
              {planFeatures[suggestedPlan].map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Check sx={{ color: 'success.main', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            ✓ 14-day free trial · ✓ No credit card required · ✓ Cancel anytime
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Maybe Later</Button>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/pricing"
          onClick={onClose}
        >
          View Plans
        </Button>
      </DialogActions>
    </Dialog>
  );
}
