'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Alert
} from '@mui/material';
import {
  ErrorOutline,
  Block,
  AccessTime,
  Home,
  ContactSupport
} from '@mui/icons-material';

type ErrorType = 'expired' | 'limit' | 'password' | 'not-found';

export default function QRExpiredPage() {
  const searchParams = useSearchParams();

  // Derive state from searchParams using useMemo to avoid cascading renders
  const { errorType, message, fallbackUrl } = useMemo(() => {
    const type = (searchParams.get('type') as ErrorType) || 'expired';
    const customMessage = searchParams.get('message') || '';
    const fallback = searchParams.get('fallback') || '';

    return {
      errorType: type,
      message: customMessage,
      fallbackUrl: fallback,
    };
  }, [searchParams]);

  const getIcon = () => {
    switch (errorType) {
      case 'expired':
        return <AccessTime sx={{ fontSize: 80, color: 'warning.main' }} />;
      case 'limit':
        return <Block sx={{ fontSize: 80, color: 'error.main' }} />;
      case 'password':
        return <ErrorOutline sx={{ fontSize: 80, color: 'info.main' }} />;
      case 'not-found':
        return <ErrorOutline sx={{ fontSize: 80, color: 'text.secondary' }} />;
      default:
        return <ErrorOutline sx={{ fontSize: 80, color: 'error.main' }} />;
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case 'expired':
        return 'QR Code Has Expired';
      case 'limit':
        return 'Scan Limit Reached';
      case 'password':
        return 'Password Required';
      case 'not-found':
        return 'QR Code Not Found';
      default:
        return 'QR Code Unavailable';
    }
  };

  const getDescription = () => {
    if (message) return message;

    switch (errorType) {
      case 'expired':
        return 'This QR code has reached its expiration date and is no longer active. Please contact the QR code owner for an updated code.';
      case 'limit':
        return 'This QR code has reached its maximum number of scans and is no longer accepting new scans. Please contact the QR code owner for assistance.';
      case 'password':
        return 'This QR code is password protected. Please enter the correct password to access the content.';
      case 'not-found':
        return 'The QR code you are trying to access does not exist or has been deleted.';
      default:
        return 'This QR code is currently unavailable. Please try again later or contact support.';
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            maxWidth: 600,
          }}
        >
          <Box sx={{ mb: 3 }}>
            {getIcon()}
          </Box>

          <Typography variant="h4" gutterBottom fontWeight="bold">
            {getTitle()}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {getDescription()}
          </Typography>

          {errorType === 'limit' && (
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Did you know?</strong> QR Studio offers unlimited scans on our Pro and Enterprise plans.
                Upgrade to never worry about scan limits again!
              </Typography>
            </Alert>
          )}

          {errorType === 'expired' && (
            <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Tip:</strong> Set longer expiration dates or remove expiration entirely with QR Studio Pro.
                Create QR codes that last forever!
              </Typography>
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 4 }}>
            {fallbackUrl && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                href={fallbackUrl}
                fullWidth
              >
                Continue to Alternate Content
              </Button>
            )}

            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              href="/"
              startIcon={<Home />}
              fullWidth
            >
              Go to Homepage
            </Button>

            <Button
              variant="text"
              color="secondary"
              size="large"
              component={Link}
              href="/dashboard"
              fullWidth
            >
              Create Your Own QR Code
            </Button>

            <Button
              variant="text"
              size="small"
              component={Link}
              href="/support"
              startIcon={<ContactSupport />}
              sx={{ mt: 2 }}
            >
              Contact Support
            </Button>
          </Stack>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Powered by <strong>QR Studio</strong> - Professional QR Code Management
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
