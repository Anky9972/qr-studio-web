import * as React from 'react';
import { Html, Head, Body, Container, Heading, Text, Button, Hr, Section } from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Password Reset Request</Heading>
          
          <Text style={text}>
            Hi {name},
          </Text>
          
          <Text style={text}>
            We received a request to reset your password for your QR Studio account. 
            If you didn't make this request, you can safely ignore this email.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          
          <Text style={text}>
            Or copy and paste this link into your browser:
          </Text>
          
          <Text style={link}>
            {resetUrl}
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            This link will expire in 1 hour for security reasons.
          </Text>
          
          <Text style={footer}>
            If you didn't request a password reset, please secure your account by changing your password immediately.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#1e293b',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '12px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#3b82f6',
  marginBottom: '24px',
};

const text = {
  fontSize: '16px',
  color: '#e5e7eb',
  lineHeight: '24px',
  marginBottom: '16px',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  color: '#ffffff',
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
};

const link = {
  fontSize: '14px',
  color: '#06b6d4',
  wordBreak: 'break-all' as const,
  marginBottom: '16px',
};

const hr = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '32px 0',
};

const footer = {
  fontSize: '14px',
  color: '#64748b',
  lineHeight: '20px',
  marginBottom: '8px',
};
