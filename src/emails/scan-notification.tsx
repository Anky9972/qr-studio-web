import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface QRScanNotificationEmailProps {
  userName: string;
  qrCodeName: string;
  scanCount: number;
  location?: string;
  device?: string;
  timestamp: string;
  dashboardUrl: string;
}

export const QRScanNotificationEmail = ({
  userName = 'User',
  qrCodeName,
  scanCount,
  location,
  device,
  timestamp,
  dashboardUrl,
}: QRScanNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your QR code "{qrCodeName}" was just scanned!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>📊 New QR Code Scan!</Heading>
        
        <Text style={text}>Hi {userName},</Text>
        
        <Text style={text}>
          Great news! Your QR code <strong>{qrCodeName}</strong> was just scanned.
        </Text>

        <Section style={statsBox}>
          <Text style={statsTitle}>Scan Details</Text>
          
          <div style={statRow}>
            <Text style={statLabel}>QR Code:</Text>
            <Text style={statValue}>{qrCodeName}</Text>
          </div>
          
          <div style={statRow}>
            <Text style={statLabel}>Total Scans:</Text>
            <Text style={statValue}>{scanCount}</Text>
          </div>
          
          <div style={statRow}>
            <Text style={statLabel}>Scanned At:</Text>
            <Text style={statValue}>{timestamp}</Text>
          </div>
          
          {location && (
            <div style={statRow}>
              <Text style={statLabel}>Location:</Text>
              <Text style={statValue}>{location}</Text>
            </div>
          )}
          
          {device && (
            <div style={statRow}>
              <Text style={statLabel}>Device:</Text>
              <Text style={statValue}>{device}</Text>
            </div>
          )}
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={dashboardUrl}>
            View Analytics →
          </Button>
        </Section>

        <Text style={text}>
          You can view detailed analytics including geographic data, device types,
          and scan trends in your dashboard.
        </Text>

        <Text style={footer}>
          Best regards,
          <br />
          The QR Studio Team
        </Text>

        <Text style={footerText}>
          You're receiving this notification because you enabled scan alerts for this
          QR code. You can manage notification preferences in your settings.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default QRScanNotificationEmail;

// Styles
const main = {
  backgroundColor: '#0f172a',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#1e293b',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '12px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
};

const h1 = {
  color: '#10b981',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#e5e7eb',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const statsBox = {
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const statsTitle = {
  color: '#10b981',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const statRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
};

const statLabel = {
  color: '#94a3b8',
  fontSize: '14px',
  fontWeight: '600',
  margin: 0,
};

const statValue = {
  color: '#10b981',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: 0,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
};

const footer = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 16px',
};

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '16px 0',
  textAlign: 'center' as const,
};
