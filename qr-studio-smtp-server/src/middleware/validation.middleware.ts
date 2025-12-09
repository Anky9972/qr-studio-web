import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';

const emailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  html: z.string().min(1, 'Email content is required'),
  from: z.string().email('Invalid from email').optional(),
  replyTo: z.string().email('Invalid reply-to email').optional(),
});

const bulkEmailSchema = z.object({
  emails: z.array(emailSchema).min(1, 'At least one email required').max(100, 'Maximum 100 emails per batch'),
});

const welcomeEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  userName: z.string().min(1, 'User name is required'),
  userEmail: z.string().email('Invalid user email'),
});

const passwordResetSchema = z.object({
  to: z.string().email('Invalid email address'),
  userName: z.string().min(1, 'User name is required'),
  resetUrl: z.string().url('Invalid reset URL'),
  expiryTime: z.string().optional(),
});

const teamInvitationSchema = z.object({
  to: z.string().email('Invalid email address'),
  inviterName: z.string().min(1, 'Inviter name is required'),
  inviterEmail: z.string().email('Invalid inviter email'),
  teamName: z.string().min(1, 'Team name is required'),
  role: z.string().min(1, 'Role is required'),
  inviteUrl: z.string().url('Invalid invite URL'),
});

const scanNotificationSchema = z.object({
  to: z.string().email('Invalid email address'),
  userName: z.string().min(1, 'User name is required'),
  qrCodeName: z.string().min(1, 'QR code name is required'),
  scanCount: z.number().int().positive('Invalid scan count'),
  timestamp: z.string().min(1, 'Timestamp is required'),
  dashboardUrl: z.string().url('Invalid dashboard URL'),
  location: z.string().optional(),
  device: z.string().optional(),
});

export function validateEmail(req: Request, res: Response, next: NextFunction) {
  try {
    emailSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Email validation failed', { errors: error.errors });
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }
    return next(error);
  }
}

export function validateBulkEmail(req: Request, res: Response, next: NextFunction) {
  try {
    bulkEmailSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Bulk email validation failed', { errors: error.errors });
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }
    return next(error);
  }
}

export function validateWelcomeEmail(req: Request, res: Response, next: NextFunction) {
  try {
    welcomeEmailSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Welcome email validation failed', { errors: error.errors });
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }
    return next(error);
  }
}

export function validatePasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    passwordResetSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Password reset validation failed', { errors: error.errors });
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }
    return next(error);
  }
}

export function validateTeamInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    teamInvitationSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Team invitation validation failed', { errors: error.errors });
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }
    return next(error);
  }
}

export function validateScanNotification(req: Request, res: Response, next: NextFunction) {
  try {
    scanNotificationSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Scan notification validation failed', { errors: error.errors });
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }
    return next(error);
  }
}
