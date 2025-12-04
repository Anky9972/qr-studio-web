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
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const h1 = {
  color: '#1976D2',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const statsBox = {
  backgroundColor: '#f0f7ff',
  border: '2px solid #1976D2',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const statsTitle = {
  color: '#1976D2',
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
  borderBottom: '1px solid #e0e0e0',
};

const statLabel = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: '600',
  margin: 0,
};

const statValue = {
  color: '#1976D2',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: 0,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#1976D2',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const footer = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 16px',
};

const footerText = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '16px 0',
  textAlign: 'center' as const,
};
