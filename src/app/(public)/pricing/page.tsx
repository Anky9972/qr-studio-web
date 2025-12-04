'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Switch,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel
} from '@mui/material';
import {
  QrCode2,
  Check,
  Close,
  ExpandMore,
  ArrowForward,
  Calculate
} from '@mui/icons-material';
import Link from 'next/link';

export default function PricingPage() {
  const { data: session } = useSession();
  const [isAnnual, setIsAnnual] = useState(false);
  const [qrCodes, setQrCodes] = useState(100);
  const [teamMembers, setTeamMembers] = useState(1);

  const pricingPlans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for personal projects and trying out QR Studio',
      features: [
        { text: '50 QR codes', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Standard customization', included: true },
        { text: 'PNG/SVG export', included: true },
        { text: 'Scan history (100 items)', included: true },
        { text: 'Dynamic QR codes', included: false },
        { text: 'Bulk generation', included: false },
        { text: 'Team collaboration', included: false },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false }
      ],
      cta: 'Get Started',
      highlighted: false,
      limits: {
        qrCodes: 50,
        scans: 'Unlimited',
        dynamic: 0,
        bulk: 0,
        teamMembers: 1,
        apiCalls: 0
      }
    },
    {
      name: 'Pro',
      monthlyPrice: 19,
      annualPrice: 190,
      description: 'Ideal for professionals and small businesses',
      features: [
        { text: '100 dynamic QR codes', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Full customization', included: true },
        { text: 'All export formats', included: true },
        { text: 'Unlimited scan history', included: true },
        { text: 'Bulk generation (1,000/batch)', included: true },
        { text: 'Password protection', included: true },
        { text: 'Custom expiration dates', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Team collaboration', included: false }
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      limits: {
        qrCodes: 100,
        scans: 'Unlimited',
        dynamic: 100,
        bulk: 1000,
        teamMembers: 1,
        apiCalls: 0
      }
    },
    {
      name: 'Business',
      monthlyPrice: 49,
      annualPrice: 490,
      description: 'For growing teams and businesses',
      features: [
        { text: '1,000 dynamic QR codes', included: true },
        { text: 'Advanced analytics & reports', included: true },
        { text: 'Full customization + frames', included: true },
        { text: 'All export formats + PDF', included: true },
        { text: 'Unlimited scan history', included: true },
        { text: 'Bulk generation (10,000/batch)', included: true },
        { text: 'Team collaboration (10 members)', included: true },
        { text: 'Role-based access control', included: true },
        { text: 'API access (10,000 calls/month)', included: true },
        { text: 'Priority support + phone', included: true }
      ],
      cta: 'Start Free Trial',
      highlighted: false,
      limits: {
        qrCodes: 1000,
        scans: 'Unlimited',
        dynamic: 1000,
        bulk: 10000,
        teamMembers: 10,
        apiCalls: 10000
      }
    },
    {
      name: 'Enterprise',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Custom solutions for large organizations',
      features: [
        { text: 'Unlimited QR codes', included: true },
        { text: 'Custom analytics & reports', included: true },
        { text: 'White-label options', included: true },
        { text: 'All export formats', included: true },
        { text: 'Unlimited scan history', included: true },
        { text: 'Unlimited bulk generation', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Custom roles & permissions', included: true },
        { text: 'Unlimited API access', included: true },
        { text: 'Dedicated account manager', included: true }
      ],
      cta: 'Contact Sales',
      highlighted: false,
      limits: {
        qrCodes: 'Unlimited',
        scans: 'Unlimited',
        dynamic: 'Unlimited',
        bulk: 'Unlimited',
        teamMembers: 'Unlimited',
        apiCalls: 'Unlimited'
      }
    }
  ];

  const allFeatures = [
    { category: 'QR Code Generation', features: [
      { name: 'Static QR codes', free: '50', pro: '100', business: '1,000', enterprise: 'Unlimited' },
      { name: 'Dynamic QR codes', free: '0', pro: '100', business: '1,000', enterprise: 'Unlimited' },
      { name: 'Bulk generation', free: '-', pro: '1,000/batch', business: '10,000/batch', enterprise: 'Unlimited' },
      { name: 'QR code types', free: '25+', pro: '25+', business: '25+', enterprise: '25+' },
      { name: 'Custom expiration', free: false, pro: true, business: true, enterprise: true },
      { name: 'Password protection', free: false, pro: true, business: true, enterprise: true }
    ]},
    { category: 'Design & Customization', features: [
      { name: 'Color customization', free: true, pro: true, business: true, enterprise: true },
      { name: 'Logo upload', free: true, pro: true, business: true, enterprise: true },
      { name: 'Pattern styles', free: '5', pro: '10+', business: '10+', enterprise: 'Custom' },
      { name: 'Frames & templates', free: false, pro: '20+', business: '50+', enterprise: 'Custom' },
      { name: 'Export formats', free: 'PNG/SVG', pro: 'PNG/SVG/JPEG', business: 'All + PDF', enterprise: 'All' }
    ]},
    { category: 'Analytics & Tracking', features: [
      { name: 'Scan tracking', free: 'Basic', pro: 'Advanced', business: 'Advanced', enterprise: 'Custom' },
      { name: 'Scan history', free: '100 items', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Geographic insights', free: false, pro: true, business: true, enterprise: true },
      { name: 'Device analytics', free: false, pro: true, business: true, enterprise: true },
      { name: 'Custom reports', free: false, pro: false, business: true, enterprise: true },
      { name: 'Real-time dashboard', free: false, pro: true, business: true, enterprise: true }
    ]},
    { category: 'Collaboration', features: [
      { name: 'Team members', free: '1', pro: '1', business: '10', enterprise: 'Unlimited' },
      { name: 'Shared libraries', free: false, pro: false, business: true, enterprise: true },
      { name: 'Role-based access', free: false, pro: false, business: true, enterprise: true },
      { name: 'Activity logs', free: false, pro: false, business: true, enterprise: true },
      { name: 'Brand kits', free: false, pro: false, business: true, enterprise: true }
    ]},
    { category: 'Integrations', features: [
      { name: 'API access', free: false, pro: false, business: '10k calls/mo', enterprise: 'Unlimited' },
      { name: 'Webhooks', free: false, pro: false, business: true, enterprise: true },
      { name: 'Custom domains', free: false, pro: false, business: true, enterprise: true },
      { name: 'White-label', free: false, pro: false, business: false, enterprise: true }
    ]},
    { category: 'Support', features: [
      { name: 'Email support', free: 'Community', pro: 'Priority', business: 'Priority', enterprise: '24/7' },
      { name: 'Response time', free: '48h', pro: '24h', business: '12h', enterprise: '1h' },
      { name: 'Phone support', free: false, pro: false, business: true, enterprise: true },
      { name: 'Dedicated manager', free: false, pro: false, business: false, enterprise: true }
    ]}
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged a prorated amount for the remainder of your billing cycle. When downgrading, the change takes effect at the end of your current billing period.'
    },
    {
      question: 'What happens when I exceed my plan limits?',
      answer: 'We\'ll send you a notification when you reach 80% of your limits. If you exceed your QR code limit, you\'ll need to delete existing codes or upgrade. Scans are always unlimited on all plans.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support within 30 days of purchase for a full refund, no questions asked.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. Enterprise plans can be invoiced with NET-30 terms.'
    },
    {
      question: 'Is there a discount for annual billing?',
      answer: 'Yes! Annual plans receive 2 months free (save 16%). Toggle between monthly and annual pricing above to see the savings.'
    },
    {
      question: 'What happens to my QR codes if I cancel?',
      answer: 'Static QR codes continue working forever. Dynamic QR codes will redirect to a generic page after 30 days. You can export all your data before canceling.'
    },
    {
      question: 'Do you offer educational or nonprofit discounts?',
      answer: 'Yes! We offer 50% off Pro and Business plans for verified educational institutions and registered nonprofits. Contact sales@qrstudio.com with proof of status.'
    }
  ];

  const calculateRecommendedPlan = () => {
    if (qrCodes <= 50 && teamMembers === 1) return 'Free';
    if (qrCodes <= 100 && teamMembers === 1) return 'Pro';
    if (qrCodes <= 1000 && teamMembers <= 10) return 'Business';
    return 'Enterprise';
  };

  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? <Check sx={{ color: 'success.main' }} /> : <Close sx={{ color: 'error.main' }} />;
    }
    return <Typography variant="body2">{value}</Typography>;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Chip label="PRICING" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              {session?.user ? `${session.user.name?.split(' ')[0]}, Choose Your Plan` : 'Simple, Transparent Pricing'}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {session?.user 
                ? 'Upgrade to unlock more features and grow your QR code capabilities.'
                : 'Choose the perfect plan for your needs. All plans include a 14-day free trial.'
              }
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ opacity: isAnnual ? 0.6 : 1 }}>Monthly</Typography>
              <Switch
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'white' } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ opacity: isAnnual ? 1 : 0.6 }}>Annual</Typography>
                <Chip label="Save 16%" size="small" sx={{ bgcolor: 'success.main', color: 'white' }} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              sx={{
                flex: '1 1 280px',
                maxWidth: 350,
                border: plan.highlighted ? 2 : 1,
                borderColor: plan.highlighted ? 'primary.main' : 'divider',
                position: 'relative',
                transform: plan.highlighted ? 'scale(1.05)' : 'none',
                boxShadow: plan.highlighted ? 6 : 1
              }}
            >
              {plan.highlighted && (
                <Chip
                  label="MOST POPULAR"
                  color="primary"
                  size="small"
                  sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                  {plan.description}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {plan.name === 'Enterprise' ? (
                    <Typography variant="h4" fontWeight="bold">
                      Custom
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h3" fontWeight="bold" component="span">
                        ${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" component="span">
                        /month
                      </Typography>
                      {isAnnual && plan.monthlyPrice > 0 && (
                        <Typography variant="caption" display="block" color="success.main">
                          ${plan.annualPrice}/year - Save ${(plan.monthlyPrice * 12) - plan.annualPrice}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
                <Button
                  variant={plan.highlighted ? 'contained' : 'outlined'}
                  fullWidth
                  size="large"
                  component={Link}
                  href={
                    plan.name === 'Enterprise' 
                      ? '/support' 
                      : session?.user 
                        ? '/dashboard/billing'
                        : '/signup'
                  }
                  sx={{ mb: 3 }}
                >
                  {plan.name === 'Enterprise' ? plan.cta : session?.user ? 'Upgrade Now' : plan.cta}
                </Button>
                <Box>
                  {plan.features.map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'flex-start' }}>
                      {feature.included ? (
                        <Check sx={{ color: 'success.main', fontSize: 20, mt: 0.25 }} />
                      ) : (
                        <Close sx={{ color: 'error.main', fontSize: 20, mt: 0.25, opacity: 0.3 }} />
                      )}
                      <Typography variant="body2" sx={{ opacity: feature.included ? 1 : 0.5 }}>
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Pricing Calculator */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Calculate sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Not Sure Which Plan?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Use our calculator to find the perfect plan for your needs
            </Typography>
          </Box>
          <Card sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="How many QR codes do you need?"
                type="number"
                value={qrCodes}
                onChange={(e) => setQrCodes(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                helperText="Estimate the total number of QR codes you'll create"
              />
              <TextField
                label="How many team members?"
                type="number"
                value={teamMembers}
                onChange={(e) => setTeamMembers(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                helperText="Number of people who will access the account"
              />
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Recommended Plan:</Typography>
                <Typography variant="h3" fontWeight="bold">{calculateRecommendedPlan()}</Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/signup"
                  sx={{ mt: 2, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  Get Started
                </Button>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* Feature Comparison Table */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
          Detailed Feature Comparison
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Compare all features across plans
        </Typography>
        {allFeatures.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              {section.category}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Feature</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Free</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Pro</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Business</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Enterprise</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.features.map((feature, featureIndex) => (
                    <TableRow key={featureIndex}>
                      <TableCell>{feature.name}</TableCell>
                      <TableCell align="center">{renderFeatureValue(feature.free)}</TableCell>
                      <TableCell align="center">{renderFeatureValue(feature.pro)}</TableCell>
                      <TableCell align="center">{renderFeatureValue(feature.business)}</TableCell>
                      <TableCell align="center">{renderFeatureValue(feature.enterprise)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Container>

      {/* FAQ Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Everything you need to know about pricing
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
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Start your 14-day free trial today. No credit card required.
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
                href="/support"
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Contact Sales
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
