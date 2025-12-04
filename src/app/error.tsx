'use client';

import { useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Error as ErrorIcon, Refresh, Home } from '@mui/icons-material';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <ErrorIcon sx={{ fontSize: 120, color: 'error.main', mb: 3 }} />
        
        <Typography variant="h1" component="h1" fontWeight={700} gutterBottom>
          Oops!
        </Typography>
        
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Something went wrong
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
        </Typography>
        
        {error.digest && (
          <Typography variant="caption" color="text.disabled" sx={{ mb: 3 }}>
            Error ID: {error.digest}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={reset}
            size="large"
          >
            Try Again
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Home />}
            component={Link}
            href="/"
            size="large"
          >
            Go Home
          </Button>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Need help? <Link href="/support" style={{ color: 'inherit' }}>Contact Support</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
