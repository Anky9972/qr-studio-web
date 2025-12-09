// SMTP Server Configuration for Email Service
const SMTP_SERVER_URL = process.env.SMTP_SERVER_URL || 'http://localhost:3001';
const SMTP_API_KEY = process.env.SMTP_API_KEY || '';

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email via SMTP server API
 */
async function sendEmailViaAPI({ to, subject, html }: SendEmailOptions): Promise<EmailResponse> {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ to, subject, html }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Email API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  to: string,
  userName: string,
  userEmail: string
): Promise<EmailResponse> {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/templates/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ to, userName, userEmail }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send welcome email');
    }

    return await response.json();
  } catch (error) {
    console.error('Welcome email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  resetUrl: string,
  expiryTime?: string
): Promise<EmailResponse> {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/templates/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ to, userName, resetUrl, expiryTime }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send password reset email');
    }

    return await response.json();
  } catch (error) {
    console.error('Password reset email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitationEmail(
  to: string,
  inviterName: string,
  inviterEmail: string,
  teamName: string,
  role: string,
  inviteUrl: string
): Promise<EmailResponse> {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/templates/team-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ to, inviterName, inviterEmail, teamName, role, inviteUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send team invitation email');
    }

    return await response.json();
  } catch (error) {
    console.error('Team invitation email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send QR scan notification email
 */
export async function sendQRScanNotificationEmail(
  to: string,
  userName: string,
  qrCodeName: string,
  scanCount: number,
  timestamp: string,
  dashboardUrl: string,
  location?: string,
  device?: string
): Promise<EmailResponse> {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/templates/scan-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({
        to,
        userName,
        qrCodeName,
        scanCount,
        timestamp,
        dashboardUrl,
        location,
        device,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send scan notification email');
    }

    return await response.json();
  } catch (error) {
    console.error('Scan notification email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send generic email with custom HTML
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<EmailResponse> {
  return sendEmailViaAPI({ to, subject, html });
}

/**
 * Send bulk emails (queued processing)
 */
export async function sendBulkEmails(emails: SendEmailOptions[]): Promise<EmailResponse> {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/send-bulk-queued`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ emails }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send bulk emails');
    }

    return await response.json();
  } catch (error) {
    console.error('Bulk email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
