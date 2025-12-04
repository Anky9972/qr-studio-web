'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  QrCode2,
  ExpandMore,
  Email,
  Chat,
  Phone,
  Description,
  Send
} from '@mui/icons-material';
import Link from 'next/link';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first QR code?',
          a: 'Sign up for a free account, navigate to the Generate tab, choose your QR code type, enter your content, customize the design, and click Generate. You can download your QR code immediately or save it to your account.'
        },
        {
          q: 'What QR code types are supported?',
          a: 'We support 25+ types including URL, vCard (business cards), WiFi, Email, SMS, Phone, Calendar events, Location, and more. Each type has specific fields optimized for that use case.'
        },
        {
          q: 'Can I try QR Studio for free?',
          a: 'Yes! Our Free plan includes 50 QR codes, basic analytics, and standard customization. Paid plans start at $19/month and include a 14-day free trial with no credit card required.'
        }
      ]
    },
    {
      category: 'Dynamic QR Codes',
      questions: [
        {
          q: 'What is a dynamic QR code?',
          a: 'A dynamic QR code allows you to change the destination URL after the code is created and printed. The QR code contains a short URL that redirects to your actual destination, which you can edit anytime from your dashboard.'
        },
        {
          q: 'Can I edit static QR codes?',
          a: 'No, static QR codes permanently encode the content. Once generated, they cannot be changed. That\'s why we recommend dynamic QR codes for marketing materials, product packaging, and any long-term use.'
        },
        {
          q: 'Do dynamic QR codes expire?',
          a: 'Dynamic QR codes remain active as long as your subscription is active. You can also set optional expiration dates for time-sensitive campaigns. After cancellation, dynamic codes remain active for 30 days.'
        }
      ]
    },
    {
      category: 'Analytics & Tracking',
      questions: [
        {
          q: 'What analytics data can I track?',
          a: 'We track scan counts, timestamps, geographic location (city/country), device types, browsers, operating systems, and referral sources. All data is anonymized and GDPR-compliant—we don\'t collect personal identifiable information.'
        },
        {
          q: 'How accurate is location tracking?',
          a: 'Location is determined by the scanner\'s IP address and provides city/country-level accuracy. We don\'t use GPS or require location permissions, making scanning frictionless for users.'
        },
        {
          q: 'Can I export analytics data?',
          a: 'Yes! All plans allow CSV export of scan data. Business and Enterprise plans include custom reports and API access for advanced analytics integrations.'
        }
      ]
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          q: 'Can I change plans anytime?',
          a: 'Yes! Upgrade or downgrade at any time. Upgrades are prorated for the remainder of your billing cycle. Downgrades take effect at the end of your current billing period to ensure you receive full value.'
        },
        {
          q: 'What happens if I exceed my plan limits?',
          a: 'You\'ll receive notifications at 80% and 100% of your limits. If you exceed your QR code limit, you\'ll need to delete existing codes or upgrade. Scans are always unlimited on all plans.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'Yes! We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support within 30 days for a full refund, no questions asked.'
        }
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'What image formats can I export?',
          a: 'Free plan: PNG and SVG. Pro plan adds JPEG. Business plan adds PDF. All formats support high resolution up to 4096x4096 pixels for print quality.'
        },
        {
          q: 'Can I use my own domain for short URLs?',
          a: 'Yes! Business and Enterprise plans support custom domains (e.g., qr.yourbrand.com) for white-label dynamic QR codes. This increases brand trust and looks professional.'
        },
        {
          q: 'Is there an API?',
          a: 'Yes! Business plans include API access with 10,000 calls/month. Enterprise plans have unlimited API access. Our REST API supports QR code generation, campaign management, and analytics retrieval.'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: <Email sx={{ fontSize: 40 }} />,
      title: 'Email Support',
      description: 'Get help via email',
      detail: 'support@qrstudio.com',
      availability: 'Response within 24 hours'
    },
    {
      icon: <Chat sx={{ fontSize: 40 }} />,
      title: 'Live Chat',
      description: 'Chat with our team',
      detail: 'Available in-app',
      availability: 'Mon-Fri, 9am-6pm PST'
    },
    {
      icon: <Phone sx={{ fontSize: 40 }} />,
      title: 'Phone Support',
      description: 'Business & Enterprise plans',
      detail: '+1 (555) 123-4567',
      availability: 'Mon-Fri, 9am-6pm PST'
    },
    {
      icon: <Description sx={{ fontSize: 40 }} />,
      title: 'Documentation',
      description: 'Guides and tutorials',
      detail: 'docs.qrstudio.com',
      availability: 'Available 24/7'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QrCode2 sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold" component={Link} href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                QR Studio
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} href="/features">Features</Button>
              <Button color="inherit" component={Link} href="/pricing">Pricing</Button>
              <Button color="inherit" component={Link} href="/signin">Sign In</Button>
              <Button variant="contained" component={Link} href="/signup">Get Started</Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              How Can We Help You?
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              Find answers in our FAQ or reach out to our support team
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Methods */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Choose the support channel that works best for you
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {contactMethods.map((method, index) => (
            <Card key={index} sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 280 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{method.icon}</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {method.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {method.description}
                </Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ mt: 2 }}>
                  {method.detail}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {method.availability}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Contact Form */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
            Send Us a Message
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Fill out the form below and we'll get back to you within 24 hours
          </Typography>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for contacting us! We'll respond to your message within 24 hours.
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Name"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <TextField
                    label="Subject"
                    required
                    fullWidth
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                  <TextField
                    label="Message"
                    required
                    fullWidth
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    endIcon={submitting ? <CircularProgress size={20} /> : <Send />}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Find quick answers to common questions
        </Typography>
        {faqs.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4, mb: 2 }}>
              {category.category}
            </Typography>
            {category.questions.map((faq, faqIndex) => (
              <Accordion key={faqIndex}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="medium">
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Still Have Questions?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Our team is here to help you succeed
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="mailto:support@qrstudio.com"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Contact Support
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
