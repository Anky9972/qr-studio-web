'use client';

import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Extension,
  QrCodeScanner,
  QrCode2,
  Speed,
  Security,
  Palette,
  Cloud,
  CheckCircle,
  Download,
  Star,
} from '@mui/icons-material';
import Link from 'next/link';

export default function ExtensionPage() {
  // Replace with your actual Chrome Web Store URL
  const chromeStoreUrl = 'https://chrome.google.com/webstore/detail/qr-studio/YOUR_EXTENSION_ID';

  const features = [
    {
      icon: <QrCodeScanner fontSize="large" color="primary" />,
      title: 'Instant QR Scanning',
      description: 'Scan QR codes from any webpage, image, or using your webcam',
    },
    {
      icon: <QrCode2 fontSize="large" color="primary" />,
      title: 'Quick Generation',
      description: 'Generate QR codes for the current page or any text with one click',
    },
    {
      icon: <Speed fontSize="large" color="primary" />,
      title: 'Blazing Fast',
      description: 'Lightning-fast performance with no page reloads required',
    },
    {
      icon: <Palette fontSize="large" color="primary" />,
      title: 'Full Customization',
      description: 'Customize colors, logos, patterns, and styles directly in the extension',
    },
    {
      icon: <Cloud fontSize="large" color="primary" />,
      title: 'Cloud Sync',
      description: 'Sync your QR codes and history with your QR Studio account',
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: 'Privacy First',
      description: 'All data is encrypted and your privacy is protected',
    },
  ];

  const capabilities = [
    'Scan QR codes from images on any webpage',
    'Use your webcam to scan physical QR codes',
    'Generate QR codes for URLs, text, WiFi, vCards, and more',
    'Right-click context menu integration',
    'Keyboard shortcuts for quick access',
    'Scan history with search and filtering',
    'Export QR codes in PNG, SVG, and PDF formats',
    'Bulk generation from CSV files',
    'Custom templates and presets',
    'Dark mode support',
    'Works offline for basic features',
    'Sync with QR Studio web app',
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Chip
                  icon={<Extension />}
                  label="Chrome Extension"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    width: 'fit-content',
                  }}
                />
                
                <Typography variant="h2" fontWeight="bold">
                  QR Studio for Chrome
                </Typography>
                
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Scan and generate QR codes instantly, right from your browser. 
                  Free, powerful, and privacy-focused.
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    size="large"
                    href={chromeStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<Download />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Add to Chrome - Free
                  </Button>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} sx={{ color: '#ffc107' }} />
                    ))}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      4.8 / 5.0 (1,234 reviews)
                    </Typography>
                  </Stack>
                </Stack>

                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Also compatible with Microsoft Edge, Brave, and other Chromium browsers
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={8}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                }}
              >
                {/* Placeholder for extension screenshot */}
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ opacity: 0.7 }}>
                    Extension Screenshot
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          Powerful Features
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to work with QR codes, right in your browser
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Capabilities List */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                What Can You Do?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Our Chrome extension puts professional QR code tools at your fingertips. 
                Here's what you can accomplish:
              </Typography>

              <List>
                {capabilities.slice(0, 6).map((capability, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={capability} />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="contained"
                size="large"
                href={chromeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<Download />}
                fullWidth
                sx={{ mt: 2 }}
              >
                Install Extension
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <List>
                {capabilities.slice(6).map((capability, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={capability} />
                  </ListItem>
                ))}
              </List>

              <Card sx={{ mt: 3, bgcolor: 'primary.main', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Pro Features Available
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Upgrade to QR Studio Pro to unlock:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Unlimited QR code generation</li>
                    <li>Advanced analytics in extension</li>
                    <li>Priority support</li>
                    <li>No usage limits</li>
                  </ul>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/pricing"
                    sx={{
                      mt: 2,
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                    fullWidth
                  >
                    View Pricing
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Installation Guide */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          How to Install
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Get started in 3 easy steps
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                1
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Visit Chrome Web Store
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the "Add to Chrome" button above to open the extension page
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                2
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Install Extension
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Add to Chrome" and confirm the installation
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                3
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Start Using
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the extension icon to start scanning and generating QR codes
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who are already using QR Studio
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              href={chromeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Download />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Install Chrome Extension
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/dashboard"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Try Web App
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
