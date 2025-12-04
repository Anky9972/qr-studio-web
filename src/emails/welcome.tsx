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

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
}

export const WelcomeEmail = ({
  userName = 'User',
  userEmail,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to QR Studio - Start creating amazing QR codes!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to QR Studio! 🎉</Heading>
        
        <Text style={text}>Hi {userName},</Text>
        
        <Text style={text}>
          We're excited to have you on board! QR Studio is your complete solution
          for creating, managing, and tracking QR codes for your business.
        </Text>

        <Section style={featuresSection}>
          <Text style={featuresTitle}>What you can do with QR Studio:</Text>
          <Text style={featureItem}>✅ Create unlimited static QR codes</Text>
          <Text style={featureItem}>✅ Generate dynamic QR codes with editable URLs</Text>
          <Text style={featureItem}>✅ Track scans with detailed analytics</Text>
          <Text style={featureItem}>✅ Customize designs with colors, logos, and frames</Text>
          <Text style={featureItem}>✅ Bulk generate QR codes from CSV/Excel</Text>
          <Text style={featureItem}>✅ Export as PNG, SVG, or PDF</Text>
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href="https://qrstudio.com/dashboard">
            Get Started →
          </Button>
        </Section>

        <Text style={text}>
          Need help? Check out our{' '}
          <a href="https://qrstudio.com/docs" style={link}>
            documentation
          </a>{' '}
          or reply to this email - we're here to help!
        </Text>

        <Text style={footer}>
          Best regards,
          <br />
          The QR Studio Team
        </Text>

        <Text style={footerText}>
          You're receiving this email because you signed up for QR Studio with{' '}
          {userEmail}.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const featuresSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const featuresTitle = {
  color: '#1976D2',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const featureItem = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '4px 0',
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

const link = {
  color: '#1976D2',
  textDecoration: 'underline',
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
