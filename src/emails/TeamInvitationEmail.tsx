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

interface TeamInvitationEmailProps {
  inviterName: string;
  teamName: string;
  role: string;
  inviteUrl: string;
}

export default function TeamInvitationEmail({
  inviterName,
  teamName,
  role,
  inviteUrl,
}: TeamInvitationEmailProps) {
  const roleDescriptions: Record<string, string> = {
    ADMIN: 'full access to manage team members, QR codes, and settings',
    EDITOR: 'create and edit QR codes, but cannot manage team members',
    VIEWER: 'view QR codes and analytics, but cannot make changes',
  };

  return (
    <Html>
      <Head />
      <Preview>You've been invited to join a team on QR Studio</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Team Invitation 🤝</Heading>
          
          <Text style={text}>
            {inviterName} has invited you to join <strong>{teamName}</strong> on QR Studio.
          </Text>
          
          <Text style={text}>
            You'll be joining as a <strong>{role}</strong> with {roleDescriptions[role] || 'team access'}.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={inviteUrl}>
              Accept Invitation
            </Button>
          </Section>
          
          <Text style={text}>
            If you don't have a QR Studio account yet, you'll be able to create one when you accept this invitation.
          </Text>
          
          <Text style={text}>
            This invitation link will expire in 7 days.
          </Text>
          
          <Text style={text}>
            If you weren't expecting this invitation, you can safely ignore this email.
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
