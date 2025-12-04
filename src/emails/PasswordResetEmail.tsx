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
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1976d2',
  marginBottom: '24px',
};

const text = {
  fontSize: '16px',
  color: '#333',
  lineHeight: '24px',
  marginBottom: '16px',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#1976d2',
  color: '#ffffff',
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
};

const link = {
  fontSize: '14px',
  color: '#1976d2',
  wordBreak: 'break-all' as const,
  marginBottom: '16px',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '32px 0',
};

const footer = {
  fontSize: '14px',
  color: '#666',
  lineHeight: '20px',
  marginBottom: '8px',
};
