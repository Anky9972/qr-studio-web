'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip
} from '@mui/material';
import {
  QrCode2,
  ArrowBack,
  CheckCircle,
  Lock,
  Download,
  Delete,
  Settings,
  Security,
  Gavel,
  ContactSupport
} from '@mui/icons-material';
import Link from 'next/link';

export default function GDPRPage() {
  const rights = [
    {
      icon: <Security />,
      title: 'Right to Access',
      description: 'You have the right to request a copy of all personal data we hold about you.'
    },
    {
      icon: <Settings />,
      title: 'Right to Rectification',
      description: 'You can request correction of inaccurate or incomplete personal data.'
    },
    {
      icon: <Delete />,
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data (right to be forgotten).'
    },
    {
      icon: <Lock />,
      title: 'Right to Restrict Processing',
      description: 'You can request limitation of how we process your personal data.'
    },
    {
      icon: <Download />,
      title: 'Right to Data Portability',
      description: 'You can request your data in a structured, machine-readable format.'
    },
    {
      icon: <Gavel />,
      title: 'Right to Object',
      description: 'You can object to processing of your personal data for specific purposes.'
    }
  ];

  const dataWeCollect = [
    {
      category: 'Account Information',
      items: ['Name', 'Email address', 'Password (encrypted)', 'Profile picture', 'Company name']
    },
    {
      category: 'QR Code Data',
      items: ['QR code content', 'Design settings', 'Custom domains', 'Metadata', 'Creation timestamps']
    },
    {
      category: 'Analytics Data',
      items: ['Scan timestamps', 'Geographic location (city/country)', 'Device type', 'Browser information', 'Referral source']
    },
    {
      category: 'Usage Data',
      items: ['Features accessed', 'Pages viewed', 'Session duration', 'IP address (anonymized)', 'Cookies']
    },
    {
      category: 'Payment Information',
      items: ['Billing address', 'Payment method (via Stripe)', 'Transaction history', 'Invoice details']
    }
  ];

  const howWeUseData = [
    'Provide and maintain our QR code services',
    'Process your transactions and manage subscriptions',
    'Send you important service notifications',
    'Provide customer support',
    'Analyze usage patterns to improve our platform',
    'Prevent fraud and abuse',
    'Comply with legal obligations',
    'Send marketing communications (with your consent)'
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QrCode2 sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                component={Link}
                href="/"
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                QR Studio
              </Typography>
            </Box>
            <Button startIcon={<ArrowBack />} component={Link} href="/">
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="GDPR Compliant" color="success" sx={{ mb: 2 }} />
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            GDPR Compliance
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Your data protection rights under the General Data Protection Regulation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: December 3, 2025
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            QR Studio is committed to protecting your privacy and ensuring compliance with GDPR.
            This page explains your rights and how we handle your personal data.
          </Typography>
        </Alert>

        {/* Your Rights Section */}
        <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security color="primary" />
              Your Data Protection Rights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Under GDPR, you have the following rights regarding your personal data:
            </Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {rights.map((right, index) => (
                <Card key={index} variant="outlined" sx={{ bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          flexShrink: 0
                        }}
                      >
                        {right.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {right.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {right.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Data We Collect
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We collect the following categories of personal data:
            </Typography>

            {dataWeCollect.map((category, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {category.category}
                </Typography>
                <List dense>
                  {category.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="primary" sx={{ fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
                {index < dataWeCollect.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* How We Use Data */}
        <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              How We Use Your Data
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We process your personal data for the following purposes:
            </Typography>

            <List>
              {howWeUseData.map((purpose, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={purpose} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Legal Basis */}
        <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Legal Basis for Processing
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              We process your data based on:
            </Typography>

            <List>
              <ListItem disableGutters>
                <ListItemIcon>
                  <Gavel color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Contract Performance"
                  secondary="Processing necessary to provide our services as per our Terms of Service"
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <Gavel color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Legitimate Interest"
                  secondary="Improving our services, fraud prevention, and security"
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <Gavel color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Consent"
                  secondary="Marketing communications and non-essential cookies (when you opt-in)"
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <Gavel color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Legal Obligation"
                  secondary="Compliance with applicable laws and regulations"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Data Retention
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              We retain your personal data only as long as necessary:
            </Typography>

            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Active accounts:</strong> Data retained while your account is active
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Deleted accounts:</strong> Most data deleted within 30 days; some retained for legal compliance (e.g., billing records)
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Analytics data:</strong> Anonymized data may be retained for statistical purposes
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>Backups:</strong> Deleted data may persist in backups for up to 90 days
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Your Controls */}
        <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Exercise Your Rights
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              You can manage your data and privacy settings directly from your account:
            </Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Button
                component={Link}
                href="/dashboard/settings/privacy"
                variant="contained"
                size="large"
                startIcon={<Settings />}
                sx={{
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'background.default' }
                }}
                fullWidth
              >
                Privacy Settings
              </Button>
              <Button
                component={Link}
                href="/dashboard/settings/privacy?action=export"
                variant="outlined"
                size="large"
                startIcon={<Download />}
                sx={{
                  borderColor: 'primary.contrastText',
                  color: 'primary.contrastText',
                  '&:hover': {
                    borderColor: 'primary.contrastText',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
                fullWidth
              >
                Export My Data
              </Button>
              <Button
                component={Link}
                href="/dashboard/settings/privacy?action=delete"
                variant="outlined"
                size="large"
                startIcon={<Delete />}
                sx={{
                  borderColor: 'primary.contrastText',
                  color: 'primary.contrastText',
                  '&:hover': {
                    borderColor: 'primary.contrastText',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
                fullWidth
              >
                Delete My Account
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              International Data Transfers
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Your data may be transferred to and processed in countries outside the European Economic Area (EEA).
              We ensure appropriate safeguards are in place:
            </Typography>

            <List dense>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="EU-US Data Privacy Framework compliance" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="Standard Contractual Clauses (SCCs)" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="Data encryption in transit and at rest" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ContactSupport color="primary" />
              Questions or Concerns?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              If you have questions about our GDPR compliance or wish to exercise your rights, please contact us:
            </Typography>

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Data Protection Officer:</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Email: dpo@qrstudio.com
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Support Team:</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Email: privacy@qrstudio.com
              </Typography>

              <Typography variant="caption" color="text.secondary">
                We will respond to your request within 30 days as required by GDPR.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Related Documents:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} href="/legal/privacy" size="small">
              Privacy Policy
            </Button>
            <Button component={Link} href="/legal/terms" size="small">
              Terms of Service
            </Button>
            <Button component={Link} href="/legal/cookies" size="small">
              Cookie Policy
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
