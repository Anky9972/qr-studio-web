'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Alert
} from '@mui/material';
import { QrCode2, ArrowForward, TrendingUp } from '@mui/icons-material';
import Link from 'next/link';
import TemplateCard from '@/components/templates/TemplateCard';
import TemplateFilter from '@/components/templates/TemplateFilter';
import TemplatePreview from '@/components/templates/TemplatePreview';

// Mock templates data - in production, this would come from API
const TEMPLATES = [
  {
    id: 'business-card-1',
    name: 'Professional Business Card',
    description: 'Modern business card template with contact information and social media links',
    category: 'Business Cards',
    rating: 4.8,
    usageCount: 2500,
    isPro: false,
    features: [
      'vCard format',
      'Multiple contact methods',
      'Social media integration',
      'Professional design'
    ]
  },
  {
    id: 'wifi-simple',
    name: 'WiFi Access QR',
    description: 'Simple WiFi connection template for guests and visitors',
    category: 'WiFi Access',
    rating: 4.9,
    usageCount: 5200,
    isPro: false,
    features: [
      'One-tap connection',
      'WPA/WPA2 support',
      'Hidden SSID compatible',
      'Password encryption'
    ]
  },
  {
    id: 'restaurant-menu-1',
    name: 'Digital Menu',
    description: 'Contactless restaurant menu with categories and pricing',
    category: 'Restaurant Menus',
    rating: 4.7,
    usageCount: 3800,
    isPro: false,
    features: [
      'Multi-category support',
      'Price display',
      'Allergy information',
      'Multi-language'
    ]
  },
  {
    id: 'event-ticket-1',
    name: 'Event Ticket',
    description: 'Scannable event ticket with validation and attendee info',
    category: 'Event Tickets',
    rating: 4.6,
    usageCount: 1900,
    isPro: true,
    features: [
      'Unique ticket ID',
      'Real-time validation',
      'Check-in tracking',
      'Anti-counterfeit'
    ]
  },
  {
    id: 'product-label-1',
    name: 'Product Information',
    description: 'Product details, specifications, and warranty information',
    category: 'Product Labels',
    rating: 4.5,
    usageCount: 1500,
    isPro: false,
    features: [
      'Product specifications',
      'Serial number tracking',
      'Warranty details',
      'Support links'
    ]
  },
  {
    id: 'social-media-1',
    name: 'Social Media Hub',
    description: 'Link to all your social media profiles in one place',
    category: 'Social Media',
    rating: 4.9,
    usageCount: 4200,
    isPro: false,
    features: [
      'All major platforms',
      'Bio/description',
      'Custom branding',
      'Analytics tracking'
    ]
  },
  {
    id: 'url-simple',
    name: 'Website Link',
    description: 'Simple QR code that redirects to any URL',
    category: 'URLs & Links',
    rating: 4.8,
    usageCount: 8500,
    isPro: false,
    features: [
      'Any URL supported',
      'Redirect tracking',
      'Custom short URLs',
      'Link expiration'
    ]
  },
  {
    id: 'location-map-1',
    name: 'Location/Map',
    description: 'GPS coordinates with map integration for easy navigation',
    category: 'Location/Maps',
    rating: 4.7,
    usageCount: 2100,
    isPro: false,
    features: [
      'GPS coordinates',
      'Google Maps integration',
      'Directions link',
      'Street view'
    ]
  },
  {
    id: 'contact-vcard',
    name: 'Contact Information',
    description: 'Complete contact details in vCard format',
    category: 'Contact Information',
    rating: 4.6,
    usageCount: 3200,
    isPro: false,
    features: [
      'vCard 3.0 format',
      'Phone, email, address',
      'Company information',
      'Save to contacts'
    ]
  },
  {
    id: 'email-template',
    name: 'Email QR Code',
    description: 'Pre-filled email with recipient, subject, and body',
    category: 'Email & SMS',
    rating: 4.4,
    usageCount: 1800,
    isPro: false,
    features: [
      'Pre-filled recipient',
      'Custom subject line',
      'Message body',
      'CC/BCC support'
    ]
  },
  {
    id: 'sms-template',
    name: 'SMS Message',
    description: 'Pre-filled SMS message for quick texting',
    category: 'Email & SMS',
    rating: 4.5,
    usageCount: 1600,
    isPro: false,
    features: [
      'Phone number pre-filled',
      'Message body',
      'Unicode support',
      'Multi-platform'
    ]
  },
  {
    id: 'payment-link',
    name: 'Payment Link',
    description: 'Quick payment link for online transactions',
    category: 'URLs & Links',
    rating: 4.7,
    usageCount: 2900,
    isPro: true,
    features: [
      'Payment gateway integration',
      'Amount pre-fill',
      'Currency support',
      'Transaction tracking'
    ]
  }
];

const CATEGORIES = Array.from(new Set(TEMPLATES.map(t => t.category))).sort();

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<typeof TEMPLATES[0] | null>(null);
  const isAuthenticated = false; // TODO: Get from auth context

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Popular templates (top 4 by usage)
  const popularTemplates = useMemo(() => {
    return [...TEMPLATES].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight="bold"
              sx={{ display: 'block', mb: 2 }}
            >
              Ready-to-Use Templates
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              sx={{
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              QR Code Templates
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}
            >
              Choose from professionally designed templates and start creating in seconds.
              No design skills required.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                href="/use-cases"
                variant="outlined"
                size="large"
              >
                View Use Cases
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Popular Templates Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <TrendingUp color="primary" />
          <Typography variant="h4" component="h2" fontWeight="bold">
            Popular Templates
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {popularTemplates.map(template => (
            <Grid item xs={12} sm={6} md={3} key={template.id}>
              <Box onClick={() => setPreviewTemplate(template)} sx={{ cursor: 'pointer' }}>
                <TemplateCard {...template} isAuthenticated={isAuthenticated} />
              </Box>
            </Grid>
          ))}
        </Grid>

        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 6 }}>
            <Typography variant="body2">
              <strong>Sign up for free</strong> to use any template and create unlimited QR codes.
              No credit card required.
            </Typography>
          </Alert>
        )}

        {/* All Templates Section */}
        <Box>
          <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 4 }}>
            All Templates ({filteredTemplates.length})
          </Typography>

          <TemplateFilter
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
            categories={CATEGORIES}
          />

          {filteredTemplates.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <QrCode2 sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No templates found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search query
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredTemplates.map(template => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <Box onClick={() => setPreviewTemplate(template)} sx={{ cursor: 'pointer' }}>
                    <TemplateCard {...template} isAuthenticated={isAuthenticated} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Ready to Create Your QR Code?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Sign up for free and start using any template in seconds
            </Typography>
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                '&:hover': { bgcolor: 'background.default' }
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Template Preview Modal */}
      <TemplatePreview
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        isAuthenticated={isAuthenticated}
      />
    </Box>
  );
}
