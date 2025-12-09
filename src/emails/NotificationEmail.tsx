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
  Link,
  Hr,
  Img,
} from '@react-email/components';

interface NotificationEmailProps {
  name: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export default function NotificationEmail({
  name,
  title,
  message,
  actionUrl,
  actionText = 'View Details',
}: NotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Text style={logoText}>QR STUDIO</Text>
          </Section>

          <Heading style={h1}>{title}</Heading>

          <Text style={greeting}>
            Hi {name},
          </Text>

          <Text style={text}>
            {message}
          </Text>

          {actionUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={actionUrl}>
                {actionText}
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footerText}>
            This notification was sent from your QR Studio dashboard.
            <br />
            &copy; {new Date().getFullYear()} QR Studio. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#000000',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  color: '#e0e0e0',
};

const container = {
  backgroundColor: '#111111',
  margin: '40px auto',
  padding: '40px',
  borderRadius: '16px',
  border: '1px solid #333333',
  maxWidth: '600px',
};

const header = {
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff',
  letterSpacing: '2px',
  margin: '0',
};

const h1 = {
  color: '#00ffee', // Electric Cyan
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const,
  textShadow: '0 0 10px rgba(0, 255, 238, 0.3)',
};

const greeting = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px',
};

const text = {
  color: '#cccccc',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '24px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#2563eb', // Electric Blue base
  backgroundImage: 'linear-gradient(90deg, #2563eb 0%, #00ffee 100%)',
  borderRadius: '8px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
};

const hr = {
  borderColor: '#333333',
  margin: '30px 0',
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
};
