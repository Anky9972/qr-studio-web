import nodemailer from 'nodemailer';
import { smtpConfig } from '../config/smtp.config';
import { logger } from '../utils/logger';

let transporter: nodemailer.Transporter | null = null;

export function createTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });

    logger.info('SMTP transporter created', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
    });
  }

  return transporter;
}

export async function verifyTransporter() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('SMTP connection verified successfully');
    return true;
  } catch (error) {
    logger.error('SMTP connection verification failed', { error });
    return false;
  }
}

export function closeTransporter() {
  if (transporter) {
    transporter.close();
    transporter = null;
    logger.info('SMTP transporter closed');
  }
}
