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

interface WelcomeEmailProps {
  name: string;
  email: string;
}

export default function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to QR Studio - Start generating QR codes today!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to QR Studio! 🎉</Heading>
          
          <Text style={text}>
            Hi {name || 'there'},
          </Text>
          
          <Text style={text}>
            Thank you for joining QR Studio! We're excited to have you on board.
          </Text>
          
          <Text style={text}>
            With QR Studio, you can:
          </Text>
          
          <ul style={list}>
            <li>Generate unlimited QR codes</li>
            <li>Customize designs with colors, logos, and patterns</li>
            <li>Track scans with detailed analytics</li>
            <li>Manage campaigns and teams</li>
            <li>Access powerful API for integrations</li>
          </ul>
          
          <Section style={buttonContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
              Get Started
            </Button>
          </Section>
          
          <Text style={text}>
            If you have any questions, feel free to reach out to our support team.
          </Text>
          
          <Text style={text}>
            Happy QR coding!<br />
            The QR Studio Team
          </Text>
          
          <Text style={footer}>
            © {new Date().getFullYear()} QR Studio. All rights reserved.
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
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '12px',
};

const h1 = {
  color: '#06b6d4',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#e5e7eb',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const list = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '26px',
  marginLeft: '20px',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '27px 40px 27px',
};

const button = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
};

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '40px',
};
