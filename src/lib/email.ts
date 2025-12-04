import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/WelcomeEmail';
import TeamInvitationEmail from '@/emails/TeamInvitationEmail';
import NotificationEmail from '@/emails/NotificationEmail';
import PasswordResetEmail from '@/emails/PasswordResetEmail';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const transporter = createTransporter();
  const emailHtml = await render(WelcomeEmail({ name, email: to }));

  try {
    await transporter.sendMail({
      from: `"QR Studio" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Welcome to QR Studio! 🎉',
      html: emailHtml,
    });
    console.log(`Welcome email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendTeamInvitationEmail(
  to: string,
  inviterName: string,
  teamName: string,
  role: string,
  inviteUrl: string
) {
  const transporter = createTransporter();
  const emailHtml = await render(
    TeamInvitationEmail({ inviterName, teamName, role, inviteUrl })
  );

  try {
    await transporter.sendMail({
      from: `"QR Studio" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `You've been invited to join ${teamName} on QR Studio`,
      html: emailHtml,
    });
    console.log(`Team invitation sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send team invitation:', error);
    return { success: false, error };
  }
}

export async function sendNotificationEmail(
  to: string,
  name: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string
) {
  const transporter = createTransporter();
  const emailHtml = await render(
    NotificationEmail({ name, title, message, actionUrl, actionText })
  );

  try {
    await transporter.sendMail({
      from: `"QR Studio" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: title,
      html: emailHtml,
    });
    console.log(`Notification email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  try {
    const transporter = createTransporter();
    
    const emailHtml = await render(PasswordResetEmail({ name, resetUrl }));
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@qrstudio.com',
      to,
      subject: 'Reset Your Password - QR Studio',
      html: emailHtml,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}
