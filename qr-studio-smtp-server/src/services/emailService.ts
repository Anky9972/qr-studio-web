import { createTransporter } from './transporter';
import { smtpConfig } from '../config/smtp.config';
import { EmailOptions, EmailResponse } from '../types/email.types';
import { logger } from '../utils/logger';

export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: options.from || `"${smtpConfig.from}" <${smtpConfig.auth.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error('Failed to send email', {
      error,
      to: options.to,
      subject: options.subject,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendBulkEmails(emails: EmailOptions[]): Promise<EmailResponse[]> {
  logger.info(`Processing bulk email send for ${emails.length} emails`);

  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      logger.error('Bulk email failed', {
        index,
        error: result.reason,
        to: emails[index].to,
      });
      return {
        success: false,
        error: result.reason?.message || 'Unknown error',
      };
    }
  });
}
