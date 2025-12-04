'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { QrCode2, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function TermsPage() {
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
        <Typography variant="h2" fontWeight="bold" gutterBottom>Terms of Service</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last updated: December 2, 2025</Typography>

        <Box sx={{ '& h3': { mt: 4, mb: 2, fontWeight: 'bold' }, '& p': { mb: 2 } }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>1. Acceptance of Terms</Typography>
          <Typography paragraph>
            By accessing and using QR Studio ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>2. Use License</Typography>
          <Typography paragraph>
            Permission is granted to temporarily download one copy of the materials on QR Studio's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on QR Studio's website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>3. Account Terms</Typography>
          <Typography paragraph>
            • You must be 18 years or older to use this Service.<br/>
            • You must provide your legal full name, a valid email address, and any other information requested in order to complete the signup process.<br/>
            • You are responsible for maintaining the security of your account and password.<br/>
            • You may not use the Service for any illegal or unauthorized purpose.<br/>
            • You must not transmit any worms or viruses or any code of a destructive nature.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>4. QR Code Usage</Typography>
          <Typography paragraph>
            • QR codes generated using QR Studio remain your property.<br/>
            • You are solely responsible for the content encoded in QR codes you create.<br/>
            • QR Studio reserves the right to disable QR codes that violate our Acceptable Use Policy.<br/>
            • Dynamic QR codes require an active subscription to remain functional.<br/>
            • Static QR codes will continue to work independently of your subscription status.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>5. Payment Terms</Typography>
          <Typography paragraph>
            • Paid plans are billed in advance on a monthly or annual basis.<br/>
            • All fees are exclusive of all taxes, levies, or duties.<br/>
            • Refunds are processed according to our 30-day money-back guarantee.<br/>
            • Failure to pay will result in suspension of your account.<br/>
            • Price changes will be notified 30 days in advance.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>6. Cancellation and Termination</Typography>
          <Typography paragraph>
            • You may cancel your account at any time from your account settings.<br/>
            • Upon cancellation, your content will remain accessible for 30 days.<br/>
            • QR Studio reserves the right to suspend or terminate accounts that violate these terms.<br/>
            • All provisions of this agreement which by their nature should survive termination shall survive termination.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>7. Modifications to Service</Typography>
          <Typography paragraph>
            QR Studio reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. QR Studio shall not be liable to you or to any third party for any modification, price change, suspension or discontinuance of the Service.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>8. Limitation of Liability</Typography>
          <Typography paragraph>
            In no event shall QR Studio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use QR Studio's services.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>9. Contact Information</Typography>
          <Typography paragraph>
            Questions about the Terms of Service should be sent to us at legal@qrstudio.com.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
