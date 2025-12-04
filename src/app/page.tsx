'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Grid,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  QrCode2,
  Analytics,
  Palette,
  Speed,
  Group,
  Security,
  Check,
  ArrowForward,
  Download,
  Stars,
  Lock,
  TrendingUp,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import Link from 'next/link';

interface Stats {
  activeUsers: string;
  qrCodesCreated: string;
  uptime: string;
  support: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [demoUrl, setDemoUrl] = useState('https://qrstudio.app');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeUsers: '10,000+',
    qrCodesCreated: '5M+',
    uptime: '99.9%',
    support: '24/7'
  });
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize QR Code
  useEffect(() => {
    setMounted(true);
    
    const initQR = async () => {
      if (qrRef.current && !qrInstance.current) {
        try {
          const QRCodeStyling = (await import('qr-code-styling')).default;
          
          // Clear any existing content
          qrRef.current.innerHTML = '';
          
          qrInstance.current = new QRCodeStyling({
            width: 250,
            height: 250,
            data: demoUrl,
            margin: 5,
            qrOptions: {
              typeNumber: 0,
              mode: 'Byte',
              errorCorrectionLevel: 'H'
            },
            dotsOptions: {
              type: 'rounded',
              color: '#1976d2'
            },
            backgroundOptions: {
              color: '#ffffff'
            },
            cornersSquareOptions: {
              type: 'extra-rounded',
              color: '#1565c0'
            },
            cornersDotOptions: {
              type: 'dot',
              color: '#1565c0'
            }
          });
          
          qrInstance.current.append(qrRef.current);
          setQrGenerated(true);
        } catch (error) {
          console.error('Error initializing QR code:', error);
        }
      }
    };
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      initQR();
    }, 100);
  }, []);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    setIsLoading(false);
  }, []);

  // Update QR Code when URL changes
  useEffect(() => {
    if (qrInstance.current && demoUrl && mounted) {
      try {
        qrInstance.current.update({ data: demoUrl });
        setQrGenerated(true);
      } catch (error) {
        console.error('Error updating QR code:', error);
      }
    }
  }, [demoUrl, mounted]);

  const handleDownloadQR = () => {
    if (qrInstance.current) {
      qrInstance.current.download({
        name: 'qr-code',
        extension: 'png'
      });
    }
  };

  const features = [
    {
      icon: <QrCode2 sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Dynamic QR Codes',
      description: 'Create editable QR codes that you can update anytime without reprinting'
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Advanced Analytics',
      description: 'Track scans with detailed insights: location, device, time, and more'
    },
    {
      icon: <Palette sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Full Customization',
      description: 'Design stunning QR codes with colors, logos, patterns, and frames'
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Bulk Generation',
      description: 'Generate thousands of QR codes at once from CSV or Excel files'
    },
    {
      icon: <Group sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Team Collaboration',
      description: 'Work together with your team, share libraries, and manage permissions'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Enterprise Security',
      description: 'Password protection, expiration dates, and white-label options'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechFlow Inc.',
      avatar: 'SJ',
      content: 'QR Studio has transformed how we run our marketing campaigns. The dynamic QR codes and analytics are game-changers!'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupHub',
      avatar: 'MC',
      content: 'Best QR code platform we\'ve used. The customization options and team collaboration features are outstanding.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Lead',
      company: 'EventPro',
      avatar: 'ER',
      content: 'We generate thousands of QR codes for events. The bulk generation and analytics save us hours every week.'
    }
  ];

  if (!mounted) return null;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <Chip
                icon={<Stars />}
                label="Trusted by 10,000+ businesses worldwide"
                sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }}
              />
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                {session?.user ? `Welcome Back, ${session.user.name?.split(' ')[0] || 'User'}!` : 'Create Powerful QR Codes In Seconds'}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                {session?.user 
                  ? 'Ready to create more amazing QR codes? Access your dashboard to manage your codes, view analytics, and more.'
                  : 'Generate dynamic, customizable QR codes with advanced analytics. Track every scan and update content anytime—no reprinting needed.'
                }
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {session?.user ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      href="/dashboard"
                      sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                      startIcon={<DashboardIcon />}
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      href="/dashboard/generate"
                      sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                      endIcon={<QrCode2 />}
                    >
                      Create New QR Code
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      href="/signup"
                      sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                      endIcon={<ArrowForward />}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      href="/features"
                      sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                      Explore Features
                    </Button>
                  </>
                )}
              </Box>
              {!session?.user && (
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', fontSize: '0.875rem', opacity: 0.9 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Check fontSize="small" />
                    <span>No credit card required</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Check fontSize="small" />
                    <span>14-day free trial</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Check fontSize="small" />
                    <span>Cancel anytime</span>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Right Content - QR Generator */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                  🚀 Live QR Generator - Try it Free!
                </Typography>
                <TextField
                  fullWidth
                  label="Enter any URL"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                  placeholder="https://example.com"
                />
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    bgcolor: 'grey.100', 
                    borderRadius: 2, 
                    p: 3, 
                    mb: 2,
                    minHeight: 280,
                    position: 'relative'
                  }}
                >
                  {!qrGenerated && isLoading && (
                    <Box sx={{ textAlign: 'center' }}>
                      <CircularProgress size={40} sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Generating QR Code...
                      </Typography>
                    </Box>
                  )}
                  <div 
                    ref={qrRef} 
                    style={{ 
                      display: qrGenerated ? 'flex' : 'none',
                      justifyContent: 'center', 
                      alignItems: 'center',
                      width: '100%'
                    }} 
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Download />}
                      onClick={handleDownloadQR}
                    >
                      Download
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      component={Link}
                      href={session?.user ? "/dashboard/generate" : "/signup"}
                      startIcon={session?.user ? <QrCode2 /> : <Lock />}
                    >
                      {session?.user ? "Create Advanced QR" : "Unlock Pro"}
                    </Button>
                  </Grid>
                </Grid>
                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }} color="text.secondary">
                  🔒 Secure & Private - Your data is never stored
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.activeUsers}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.qrCodesCreated}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  QR Codes Created
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.uptime}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Uptime
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.support}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Support
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Preview */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="FEATURES" sx={{ mb: 2 }} color="primary" />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Everything You Need to Succeed
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Powerful features for creating, managing, and tracking QR codes
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            href="/features"
            endIcon={<ArrowForward />}
          >
            View All Features
          </Button>
        </Box>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 4 } }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
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

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="TESTIMONIALS" sx={{ mb: 2 }} color="primary" />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Loved by Thousands
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join businesses worldwide who trust QR Studio
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Preview */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="PRICING" sx={{ mb: 2 }} color="primary" />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Choose the plan that's right for you
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            href="/pricing"
            endIcon={<ArrowForward />}
          >
            View All Plans
          </Button>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Free
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                  $0<Typography component="span" variant="h6">/month</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Perfect for personal projects
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {['50 QR codes', 'Basic analytics', 'Standard customization', 'PNG/SVG export'].map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Check fontSize="small" color="success" />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button fullWidth variant="outlined" component={Link} href="/signup">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ border: 2, borderColor: 'primary.main', position: 'relative' }}>
              <Chip
                label="MOST POPULAR"
                color="primary"
                size="small"
                sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}
              />
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                  $19<Typography component="span" variant="h6">/month</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Ideal for professionals
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {['Unlimited dynamic QR codes', 'Advanced analytics', 'Full customization', 'Bulk generation (1,000)', 'Priority support'].map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Check fontSize="small" color="success" />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button fullWidth variant="contained" component={Link} href="/signup">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Business
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                  $49<Typography component="span" variant="h6">/month</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  For growing teams
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {['Everything in Pro', 'Team collaboration', 'White-label', 'Bulk generation (10,000)', 'API access'].map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Check fontSize="small" color="success" />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button fullWidth variant="outlined" component={Link} href="/signup">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label="LIMITED TIME OFFER"
              sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }}
            />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Create Amazing QR Codes?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join 10,000+ businesses transforming their QR code campaigns with dynamic tracking and beautiful designs
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/signup"
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                endIcon={<ArrowForward />}
              >
                Start Free 14-Day Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/support"
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Talk to Sales
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.875rem', opacity: 0.9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Check fontSize="small" />
                <span>No credit card required</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Check fontSize="small" />
                <span>Full access to all features</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Check fontSize="small" />
                <span>Cancel anytime</span>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
