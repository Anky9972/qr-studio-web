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

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  expiryTime?: string;
}

export const PasswordResetEmail = ({
  userName = 'User',
  resetUrl,
  expiryTime = '1 hour',
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your QR Studio password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Your Password 🔐</Heading>
        
        <Text style={text}>Hi {userName},</Text>
        
        <Text style={text}>
          We received a request to reset your password for your QR Studio account.
          Click the button below to create a new password.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Reset Password →
          </Button>
        </Section>

        <Section style={warningBox}>
          <Text style={warningTitle}>⚠️ Important Security Information</Text>
          <Text style={warningText}>
            This password reset link will expire in <strong>{expiryTime}</strong>.
          </Text>
          <Text style={warningText}>
            If you didn't request a password reset, please ignore this email.
            Your password will remain unchanged.
          </Text>
        </Section>

        <Text style={text}>
          For security reasons, this link can only be used once. If you need another
          reset link, please visit the password reset page again.
        </Text>

        <Section style={tipsSection}>
          <Text style={tipsTitle}>Password Security Tips:</Text>
          <Text style={tipItem}>🔒 Use at least 8 characters</Text>
          <Text style={tipItem}>🔒 Mix uppercase and lowercase letters</Text>
          <Text style={tipItem}>🔒 Include numbers and special characters</Text>
          <Text style={tipItem}>🔒 Don't reuse passwords from other accounts</Text>
          <Text style={tipItem}>🔒 Consider using a password manager</Text>
        </Section>

        <Text style={footer}>
          Best regards,
          <br />
          The QR Studio Team
        </Text>

        <Text style={footerText}>
          If you have any questions, reply to this email or contact our support team.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

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

const warningBox = {
  backgroundColor: '#fff3cd',
  border: '2px solid #ffc107',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const warningTitle = {
  color: '#856404',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const warningText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const tipsSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const tipsTitle = {
  color: '#1976D2',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const tipItem = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '4px 0',
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
