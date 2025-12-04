import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { WelcomeEmail } from '@/emails/welcome';
import { TeamInvitationEmail } from '@/emails/team-invitation';
import { PasswordResetEmail } from '@/emails/password-reset';
import { QRScanNotificationEmail } from '@/emails/scan-notification';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: `"QR Studio" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// Welcome Email
export async function sendWelcomeEmail(
  to: string,
  userName: string,
  userEmail: string
) {
  const html = await render(
    WelcomeEmail({ userName, userEmail })
  );

  return sendEmail({
    to,
    subject: 'Welcome to QR Studio! 🎉',
    html,
  });
}

// Team Invitation Email
export async function sendTeamInvitationEmail(
  to: string,
  inviterName: string,
  inviterEmail: string,
  teamName: string,
  role: string,
  inviteUrl: string
) {
  const html = await render(
    TeamInvitationEmail({
      inviterName,
      inviterEmail,
      teamName,
      role,
      inviteUrl,
    })
  );

  return sendEmail({
    to,
    subject: `You've been invited to join ${teamName} on QR Studio`,
    html,
  });
}

// Password Reset Email
export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  resetUrl: string,
  expiryTime?: string
) {
  const html = await render(
    PasswordResetEmail({
      userName,
      resetUrl,
      expiryTime,
    })
  );

  return sendEmail({
    to,
    subject: 'Reset your QR Studio password',
    html,
  });
}

// QR Scan Notification Email
export async function sendQRScanNotificationEmail(
  to: string,
  userName: string,
  qrCodeName: string,
  scanCount: number,
  timestamp: string,
  dashboardUrl: string,
  location?: string,
  device?: string
) {
  const html = await render(
    QRScanNotificationEmail({
      userName,
      qrCodeName,
      scanCount,
      location,
      device,
      timestamp,
      dashboardUrl,
    })
  );

  return sendEmail({
    to,
    subject: `📊 Your QR code "${qrCodeName}" was just scanned!`,
    html,
  });
}
