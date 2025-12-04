'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { QrCode2, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function CookiesPage() {
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
            <Button startIcon={<ArrowBack />} component={Link} href="/">Back to Home</Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>Cookie Policy</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last updated: December 2, 2025</Typography>

        <Box sx={{ '& h3': { mt: 4, mb: 2, fontWeight: 'bold' }, '& p': { mb: 2 } }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>What Are Cookies</Typography>
          <Typography paragraph>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, making your next visit easier and the site more useful to you.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>How We Use Cookies</Typography>
          <Typography paragraph>
            QR Studio uses cookies to enhance your experience, improve our services, and provide functionality. We use the following types of cookies:
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom>1. Essential Cookies</Typography>
          <Typography paragraph>
            These cookies are necessary for the website to function properly. Without these cookies, services you have requested cannot be provided.
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Authentication:</strong> Keep you logged in to your account</li>
            <li><strong>Security:</strong> Protect against cross-site request forgery (CSRF) attacks</li>
            <li><strong>Session Management:</strong> Maintain your session state across pages</li>
            <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom>2. Functional Cookies</Typography>
          <Typography paragraph>
            These cookies enable enhanced functionality and personalization, such as remembering your preferences.
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Preferences:</strong> Remember your language, theme, and display settings</li>
            <li><strong>UI State:</strong> Remember sidebar collapse state, tab selections</li>
            <li><strong>Recently Used:</strong> Store recently accessed QR codes for quick access</li>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom>3. Analytics Cookies</Typography>
          <Typography paragraph>
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Usage Patterns:</strong> Track which features are most used</li>
            <li><strong>Performance:</strong> Measure page load times and errors</li>
            <li><strong>Traffic Sources:</strong> Understand how you found our website</li>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom>4. Marketing Cookies</Typography>
          <Typography paragraph>
            These cookies may be set through our site by our advertising partners to build a profile of your interests.
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Advertising:</strong> Show relevant ads across other websites</li>
            <li><strong>Campaign Tracking:</strong> Measure effectiveness of marketing campaigns</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>Third-Party Cookies</Typography>
          <Typography paragraph>
            We use the following third-party services that may set cookies:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Google Analytics:</strong> Website traffic analysis</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Intercom:</strong> Customer support chat</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>Managing Cookies</Typography>
          <Typography paragraph>
            You have several options for managing cookies:
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom>Browser Settings</Typography>
          <Typography paragraph>
            Most browsers allow you to control cookies through their settings. You can:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>Block all cookies</li>
            <li>Block third-party cookies only</li>
            <li>Delete cookies when you close your browser</li>
            <li>View and delete individual cookies</li>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom>Browser-Specific Instructions</Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom>Cookie Consent Tool</Typography>
          <Typography paragraph>
            When you first visit QR Studio, you'll see a cookie consent banner. You can:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>Accept all cookies</li>
            <li>Reject non-essential cookies</li>
            <li>Customize your cookie preferences</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>Impact of Disabling Cookies</Typography>
          <Typography paragraph>
            Disabling certain cookies may affect your experience:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Essential Cookies:</strong> You may not be able to log in or use key features</li>
            <li><strong>Functional Cookies:</strong> Your preferences won't be saved</li>
            <li><strong>Analytics Cookies:</strong> We won't be able to improve based on usage data</li>
            <li><strong>Marketing Cookies:</strong> You may see less relevant advertising</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>Cookie Retention</Typography>
          <Typography paragraph>
            Different cookies have different lifespans:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Remain until they expire or you delete them (typically 30 days to 2 years)</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>Updates to This Policy</Typography>
          <Typography paragraph>
            We may update this Cookie Policy to reflect changes in our practices or for legal reasons. We will notify you of significant changes by posting a notice on our website or sending you an email.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>Contact Us</Typography>
          <Typography paragraph>
            If you have questions about our use of cookies, please contact us at:
          </Typography>
          <Typography paragraph>
            <strong>Email:</strong> privacy@qrstudio.com<br/>
            <strong>Website:</strong> <Link href="/support">qrstudio.com/support</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
