import {
  WelcomeEmailData,
  PasswordResetEmailData,
  TeamInvitationEmailData,
  QRScanNotificationEmailData,
} from '../types/email.types';
import { serverConfig } from '../config/smtp.config';

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to ${serverConfig.appName}!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.userName}!</h2>
          <p>Thank you for joining ${serverConfig.appName}. We're excited to have you on board!</p>
          <p>With ${serverConfig.appName}, you can:</p>
          <ul>
            <li>Create unlimited QR codes</li>
            <li>Track scans and analytics</li>
            <li>Customize your QR codes</li>
            <li>And much more!</li>
          </ul>
          <a href="${serverConfig.appUrl}/dashboard" class="button">Get Started</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${serverConfig.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmail(data: PasswordResetEmailData): string {
  const expiryText = data.expiryTime || '1 hour';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.userName}!</h2>
          <p>We received a request to reset your password for your ${serverConfig.appName} account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${data.resetUrl}" class="button">Reset Password</a>
          <div class="warning">
            <strong>⏰ Important:</strong> This link will expire in ${expiryText}.
          </div>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p><small>For security, you can also copy and paste this link into your browser:<br>${data.resetUrl}</small></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${serverConfig.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateTeamInvitationEmail(data: TeamInvitationEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info-box { background: white; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👥 Team Invitation</h1>
        </div>
        <div class="content">
          <h2>You've been invited!</h2>
          <p><strong>${data.inviterName}</strong> (${data.inviterEmail}) has invited you to join their team on ${serverConfig.appName}.</p>
          <div class="info-box">
            <p><strong>Team:</strong> ${data.teamName}</p>
            <p><strong>Role:</strong> ${data.role}</p>
          </div>
          <a href="${data.inviteUrl}" class="button">Accept Invitation</a>
          <p>By joining this team, you'll be able to collaborate on QR codes and share analytics.</p>
          <p>If you don't want to accept this invitation, you can simply ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${serverConfig.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateQRScanNotificationEmail(data: QRScanNotificationEmailData): string {
  const locationInfo = data.location ? `<p><strong>📍 Location:</strong> ${data.location}</p>` : '';
  const deviceInfo = data.device ? `<p><strong>📱 Device:</strong> ${data.device}</p>` : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .stats-box { background: white; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .stat { margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 QR Code Scanned!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.userName}!</h2>
          <p>Your QR code "<strong>${data.qrCodeName}</strong>" was just scanned!</p>
          <div class="stats-box">
            <div class="stat"><strong>🔢 Total Scans:</strong> ${data.scanCount}</div>
            <div class="stat"><strong>⏰ Time:</strong> ${new Date(data.timestamp).toLocaleString()}</div>
            ${locationInfo}
            ${deviceInfo}
          </div>
          <a href="${data.dashboardUrl}" class="button">View Analytics</a>
          <p>Check your dashboard for detailed analytics and insights.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${serverConfig.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
