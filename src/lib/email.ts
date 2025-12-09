// Use standalone SMTP server
const SMTP_SERVER_URL = process.env.SMTP_SERVER_URL || 'http://localhost:3001';
const SMTP_API_KEY = process.env.SMTP_API_KEY || '';

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/templates/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ to, userName: name, userEmail: to }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send welcome email');
    }

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
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/templates/team-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ 
        to, 
        inviterName, 
        inviterEmail: process.env.SMTP_FROM || 'noreply@qrstudio.com',
        teamName, 
        role, 
        inviteUrl 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send team invitation');
    }

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
  try {
    // Generate custom HTML for notification
    const html = `
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>${title}</h1></div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>${message}</p>
            ${actionUrl && actionText ? `<a href="${actionUrl}" class="button">${actionText}</a>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch(`${SMTP_SERVER_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ to, subject: title, html }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send notification email');
    }

    console.log(`Notification email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  try {
    const response = await fetch(`${SMTP_SERVER_URL}/api/email/templates/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify({ to, userName: name, resetUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send password reset email');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}
