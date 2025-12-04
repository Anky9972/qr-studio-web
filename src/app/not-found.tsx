'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { ErrorOutline, Home, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

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
        <ErrorOutline sx={{ fontSize: 120, color: 'primary.main', mb: 3 }} />
        
        <Typography variant="h1" component="h1" fontWeight={700} gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            size="large"
          >
            Go Back
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
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Popular pages:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">Dashboard</Typography>
            </Link>
            <Typography variant="body2" color="text.disabled">•</Typography>
            <Link href="/features" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">Features</Typography>
            </Link>
            <Typography variant="body2" color="text.disabled">•</Typography>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">Pricing</Typography>
            </Link>
            <Typography variant="body2" color="text.disabled">•</Typography>
            <Link href="/support" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">Support</Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
