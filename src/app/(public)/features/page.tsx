'use client';

import { useSession } from 'next-auth/react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import {
  QrCode2,
  Analytics,
  Palette,
  Speed,
  Group,
  Security,
  CloudUpload,
  Edit,
  Timeline,
  Lock,
  Code,
  Devices,
  Check,
  Close,
  ExpandMore,
  ArrowForward,
  Apps,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function FeaturesPage() {
  const { data: session } = useSession();
  const theme = useTheme();

  const featureCategories = [
    {
      title: 'QR Code Generation',
      icon: <QrCode2 sx={{ fontSize: 48 }} />,
      color: '#FF6B6B',
      features: [
        {
          name: '25+ QR Code Types',
          description: 'Support for URL, vCard, WiFi, Email, SMS, Phone, Calendar, Location, and more',
          icon: <Apps />
        },
        {
          name: 'Dynamic QR Codes',
          description: 'Edit the destination URL anytime without reprinting the QR code',
          icon: <Edit />
        },
        {
          name: 'Bulk Generation',
          description: 'Generate up to 10,000 QR codes at once from CSV or Excel files',
          icon: <Speed />
        },
        {
          name: 'High Resolution Export',
          description: 'Export in PNG, SVG, JPEG, or PDF formats up to 4096x4096 pixels',
          icon: <CloudUpload />
        }
      ]
    },
    {
      title: 'Design & Customization',
      icon: <Palette sx={{ fontSize: 48 }} />,
      color: '#4ECDC4',
      features: [
        {
          name: 'Full Color Control',
          description: 'Customize colors, gradients, and transparency for all QR elements',
          icon: <Palette />
        },
        {
          name: 'Logo Upload',
          description: 'Add your brand logo to the center of QR codes with automatic sizing',
          icon: <QrCode2 />
        },
        {
          name: 'Pattern Styles',
          description: 'Choose from 10+ dot patterns and corner styles for unique designs',
          icon: <Apps />
        },
        {
          name: 'Frames & Templates',
          description: 'Apply professional frames and use pre-designed templates for quick creation',
          icon: <Edit />
        }
      ]
    },
    {
      title: 'Analytics & Tracking',
      icon: <Analytics sx={{ fontSize: 48 }} />,
      color: '#45B7D1',
      features: [
        {
          name: 'Real-time Scan Tracking',
          description: 'Monitor scans as they happen with live dashboard updates',
          icon: <Timeline />
        },
        {
          name: 'Geographic Insights',
          description: 'See where your QR codes are being scanned with interactive maps',
          icon: <Devices />
        },
        {
          name: 'Device Analytics',
          description: 'Track devices, browsers, and operating systems used for scanning',
          icon: <Devices />
        },
        {
          name: 'Custom Reports',
          description: 'Generate detailed reports and export data to CSV for further analysis',
          icon: <Analytics />
        }
      ]
    },
    {
      title: 'Team Collaboration',
      icon: <Group sx={{ fontSize: 48 }} />,
      color: '#96CEB4',
      features: [
        {
          name: 'Team Workspaces',
          description: 'Collaborate with unlimited team members on shared QR code libraries',
          icon: <Group />
        },
        {
          name: 'Role-based Access',
          description: 'Control permissions with Admin, Editor, Viewer, and Analyst roles',
          icon: <Lock />
        },
        {
          name: 'Brand Kit',
          description: 'Create shared brand kits with logos, colors, and templates for consistency',
          icon: <Palette />
        },
        {
          name: 'Activity Logs',
          description: 'Track all team actions with detailed audit logs and timestamps',
          icon: <Timeline />
        }
      ]
    },
    {
      title: 'Security & Management',
      icon: <Security sx={{ fontSize: 48 }} />,
      color: '#FF8C42',
      features: [
        {
          name: 'Password Protection',
          description: 'Secure QR codes with password requirements before revealing content',
          icon: <Lock />
        },
        {
          name: 'Expiration Dates',
          description: 'Set automatic expiration dates for time-sensitive campaigns',
          icon: <Timeline />
        },
        {
          name: 'White-label Options',
          description: 'Remove QR Studio branding and use custom domains (Business plan)',
          icon: <Edit />
        },
        {
          name: 'API Access',
          description: 'Integrate QR code generation into your applications with REST API',
          icon: <Code />
        }
      ]
    }
  ];

  const comparisonFeatures = [
    { name: 'Dynamic QR Codes', qrStudio: true, competitor1: false, competitor2: true },
    { name: 'Unlimited Scans', qrStudio: true, competitor1: false, competitor2: false },
    { name: 'Bulk Generation (10,000+)', qrStudio: true, competitor1: '1,000', competitor2: '500' },
    { name: 'Advanced Analytics', qrStudio: true, competitor1: 'Basic', competitor2: true },
    { name: 'Team Collaboration', qrStudio: true, competitor1: false, competitor2: 'Limited' },
    { name: 'White-label', qrStudio: true, competitor1: 'Enterprise', competitor2: false },
    { name: 'API Access', qrStudio: true, competitor1: false, competitor2: 'Paid Add-on' },
    { name: 'Custom Domains', qrStudio: true, competitor1: false, competitor2: false },
    { name: 'Password Protection', qrStudio: true, competitor1: false, competitor2: false },
    { name: 'Export Formats', qrStudio: 'PNG/SVG/PDF/JPEG', competitor1: 'PNG only', competitor2: 'PNG/SVG' }
  ];

  const faqs = [
    {
      question: 'What are dynamic QR codes?',
      answer: 'Dynamic QR codes allow you to change the destination URL without reprinting the code. The QR code points to a short URL that redirects to your actual destination, which you can edit anytime from your dashboard.'
    },
    {
      question: 'How does bulk generation work?',
      answer: 'Upload a CSV or Excel file with your data, map the columns to QR code fields, and generate thousands of codes in minutes. Each code is unique and can be customized with your brand settings. Download all codes as a ZIP file.'
    },
    {
      question: 'Can I track who scans my QR codes?',
      answer: 'Yes! Our analytics show scan counts, timestamps, geographic locations (city/country), device types, browsers, and referral sources. All data is anonymized and GDPR-compliant.'
    },
    {
      question: 'Do QR codes expire?',
      answer: 'Static QR codes never expire. Dynamic QR codes remain active as long as your subscription is active. You can also set optional expiration dates for time-sensitive campaigns.'
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes! Business and Enterprise plans support custom domains for dynamic QR codes (e.g., qr.yourbrand.com). This provides white-label branding and increases user trust.'
    },
    {
      question: 'Is there an API for developers?',
      answer: 'Yes! Our REST API allows you to programmatically generate QR codes, manage campaigns, and retrieve analytics. API access is included in Business and Enterprise plans with rate limiting based on your tier.'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Chip label="FEATURES" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              {session?.user ? 'All Features at Your Fingertips' : 'Everything You Need in One Platform'}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {session?.user 
                ? 'Explore the full power of QR Studio to create, manage, and analyze QR codes.'
                : 'Powerful features designed for marketers, developers, and businesses'
              }
            </Typography>
            {session?.user ? (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
                  Create QR Code
                </Button>
              </Box>
            ) : (
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
            )}
          </Box>
        </Container>
      </Box>

      {/* Feature Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {featureCategories.map((category, catIndex) => (
          <Box key={catIndex} sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ color: category.color }}>{category.icon}</Box>
              <Typography variant="h3" fontWeight="bold">
                {category.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {category.features.map((feature, index) => (
                <Card key={index} sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ color: category.color, mt: 0.5 }}>
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {feature.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </Container>

      {/* Comparison Table */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
            How We Compare
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            See why QR Studio is the best choice for your business
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Feature</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>QR Studio</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Competitor A</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Competitor B</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonFeatures.map((feature, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                      {feature.name}
                    </TableCell>
                    <TableCell align="center">
                      {typeof feature.qrStudio === 'boolean' ? (
                        feature.qrStudio ? (
                          <Check sx={{ color: 'success.main' }} />
                        ) : (
                          <Close sx={{ color: 'error.main' }} />
                        )
                      ) : (
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {feature.qrStudio}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {typeof feature.competitor1 === 'boolean' ? (
                        feature.competitor1 ? (
                          <Check sx={{ color: 'success.main' }} />
                        ) : (
                          <Close sx={{ color: 'error.main' }} />
                        )
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {feature.competitor1}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {typeof feature.competitor2 === 'boolean' ? (
                        feature.competitor2 ? (
                          <Check sx={{ color: 'success.main' }} />
                        ) : (
                          <Close sx={{ color: 'error.main' }} />
                        )
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {feature.competitor2}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Everything you need to know about our features
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="medium">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Try All Features?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Start your free trial today. No credit card required.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                href="/pricing"
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                View Pricing
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
