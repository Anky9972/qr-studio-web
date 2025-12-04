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
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1976d2',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const list = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  marginLeft: '20px',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '27px 40px 27px',
};

const button = {
  backgroundColor: '#1976d2',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '40px',
};
