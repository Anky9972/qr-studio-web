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

interface TeamInvitationEmailProps {
  inviterName: string;
  inviterEmail: string;
  teamName: string;
  role: string;
  inviteUrl: string;
}

export const TeamInvitationEmail = ({
  inviterName = 'Team Admin',
  inviterEmail,
  teamName = 'QR Studio Team',
  role = 'Member',
  inviteUrl,
}: TeamInvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>You've been invited to join {teamName} on QR Studio</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You've been invited! 🎊</Heading>
        
        <Text style={text}>
          <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join
          their team on QR Studio.
        </Text>

        <Section style={infoBox}>
          <Text style={infoLabel}>Team:</Text>
          <Text style={infoValue}>{teamName}</Text>
          
          <Text style={infoLabel}>Your Role:</Text>
          <Text style={infoValue}>{role}</Text>
        </Section>

        <Text style={text}>
          As a {role.toLowerCase()}, you'll be able to collaborate with your team on
          creating and managing QR codes together.
        </Text>

        <Section style={rolePermissions}>
          <Text style={permissionsTitle}>Your permissions as {role}:</Text>
          {role === 'Admin' && (
            <>
              <Text style={permissionItem}>✅ Full access to all QR codes</Text>
              <Text style={permissionItem}>✅ Manage team members</Text>
              <Text style={permissionItem}>✅ Access analytics and reports</Text>
              <Text style={permissionItem}>✅ Modify billing settings</Text>
            </>
          )}
          {role === 'Editor' && (
            <>
              <Text style={permissionItem}>✅ Create and edit QR codes</Text>
              <Text style={permissionItem}>✅ View analytics</Text>
              <Text style={permissionItem}>✅ Export QR codes</Text>
              <Text style={permissionItem}>❌ Cannot manage team or billing</Text>
            </>
          )}
          {role === 'Viewer' && (
            <>
              <Text style={permissionItem}>✅ View all QR codes</Text>
              <Text style={permissionItem}>✅ View analytics</Text>
              <Text style={permissionItem}>❌ Cannot edit or create QR codes</Text>
              <Text style={permissionItem}>❌ Cannot manage team or billing</Text>
            </>
          )}
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={inviteUrl}>
            Accept Invitation →
          </Button>
        </Section>

        <Text style={text}>
          This invitation will expire in 7 days. If you didn't expect this invitation,
          you can safely ignore this email.
        </Text>

        <Text style={footer}>
          Best regards,
          <br />
          The QR Studio Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TeamInvitationEmail;

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

const infoBox = {
  backgroundColor: '#f0f7ff',
  border: '2px solid #1976D2',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const infoLabel = {
  color: '#666666',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: '8px 0 4px',
  letterSpacing: '0.5px',
};

const infoValue = {
  color: '#1976D2',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const rolePermissions = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const permissionsTitle = {
  color: '#1976D2',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const permissionItem = {
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

const footer = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 16px',
};
