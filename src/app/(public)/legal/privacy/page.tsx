'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { QrCode2, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function PrivacyPage() {
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
        <Typography variant="h2" fontWeight="bold" gutterBottom>Privacy Policy</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last updated: December 2, 2025</Typography>

        <Box sx={{ '& h3': { mt: 4, mb: 2, fontWeight: 'bold' }, '& p': { mb: 2 } }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>1. Information We Collect</Typography>
          <Typography paragraph>
            <strong>Account Information:</strong> When you create an account, we collect your name, email address, password, and profile information.
          </Typography>
          <Typography paragraph>
            <strong>QR Code Data:</strong> We store the QR codes you create, including their content, design settings, and metadata.
          </Typography>
          <Typography paragraph>
            <strong>Scan Analytics:</strong> When someone scans your QR codes, we collect anonymized data including timestamp, location (city/country), device type, browser, and referral source. We do NOT collect personal identifying information about scanners.
          </Typography>
          <Typography paragraph>
            <strong>Usage Data:</strong> We collect information about how you use our service, including features accessed, pages viewed, and time spent.
          </Typography>
          <Typography paragraph>
            <strong>Payment Information:</strong> Payment details are processed securely by Stripe. We do not store full credit card numbers on our servers.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>2. How We Use Your Information</Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>To provide, maintain, and improve our services</li>
            <li>To process your transactions and manage your account</li>
            <li>To send you technical notices, updates, and support messages</li>
            <li>To respond to your comments, questions, and requests</li>
            <li>To analyze usage trends and improve user experience</li>
            <li>To detect, prevent, and address technical issues and fraud</li>
            <li>To send marketing communications (with your consent)</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>3. Data Sharing and Disclosure</Typography>
          <Typography paragraph>
            We do not sell your personal information. We may share your information only in these circumstances:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Service Providers:</strong> We share data with third-party vendors who perform services on our behalf (e.g., Stripe for payments, AWS for hosting)</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
            <li><strong>Business Transfers:</strong> Information may be transferred if we are involved in a merger, acquisition, or sale of assets</li>
            <li><strong>With Your Consent:</strong> We may share information with your explicit permission</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>4. Data Security</Typography>
          <Typography paragraph>
            We implement industry-standard security measures to protect your data:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>Encryption in transit (HTTPS/TLS) and at rest</li>
            <li>Regular security audits and penetration testing</li>
            <li>Access controls and authentication requirements</li>
            <li>Secure password hashing (bcrypt)</li>
            <li>Regular backups and disaster recovery procedures</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>5. Data Retention</Typography>
          <Typography paragraph>
            • Active account data is retained while your account is active<br/>
            • After account deletion, personal data is removed within 30 days<br/>
            • QR code scan analytics are retained for 24 months<br/>
            • Backup copies are purged within 90 days<br/>
            • Legal requirements may require longer retention periods
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>6. Your Rights (GDPR Compliance)</Typography>
          <Typography paragraph>
            If you are in the European Economic Area (EEA), you have the following rights:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> Object to processing of your data</li>
            <li><strong>Restriction:</strong> Request restriction of processing</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>7. Cookies and Tracking</Typography>
          <Typography paragraph>
            We use cookies and similar technologies for:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>Essential Cookies:</strong> Required for authentication and service functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </Box>
          <Typography paragraph>
            You can control cookies through your browser settings. Disabling cookies may affect service functionality.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>8. Children's Privacy</Typography>
          <Typography paragraph>
            Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us immediately.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>9. International Data Transfers</Typography>
          <Typography paragraph>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Privacy Shield Framework compliance (where applicable)</li>
            <li>Adequate country determinations</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>10. Changes to This Policy</Typography>
          <Typography paragraph>
            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or prominent notice on our website. Continued use of the service after changes constitutes acceptance.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>11. Contact Us</Typography>
          <Typography paragraph>
            For privacy-related questions or to exercise your rights, contact us at:
          </Typography>
          <Typography paragraph>
            <strong>Email:</strong> privacy@qrstudio.com<br/>
            <strong>Data Protection Officer:</strong> dpo@qrstudio.com<br/>
            <strong>Address:</strong> QR Studio, Inc., 123 Tech Street, San Francisco, CA 94105, USA
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
