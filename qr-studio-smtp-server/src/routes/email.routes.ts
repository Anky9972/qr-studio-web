import { Router } from 'express';
import { authenticateApiKey } from '../middleware/auth.middleware';
import {
  validateEmail,
  validateBulkEmail,
  validateWelcomeEmail,
  validatePasswordReset,
  validateTeamInvitation,
  validateScanNotification,
} from '../middleware/validation.middleware';
import { sendEmail, sendBulkEmails } from '../services/emailService';
import { addEmailToQueue, addBulkEmailsToQueue, getQueueStatus } from '../services/queueService';
import {
  generateWelcomeEmail,
  generatePasswordResetEmail,
  generateTeamInvitationEmail,
  generateQRScanNotificationEmail,
} from '../services/templateService';
import { logger } from '../utils/logger';

const router = Router();

// Apply authentication to all routes
router.use(authenticateApiKey);

// Send single email (direct)
router.post('/send', validateEmail, async (req, res) => {
  try {
    const result = await sendEmail(req.body);
    
    if (result.success) {
      return res.json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in /send endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Send single email (queued)
router.post('/send-queued', validateEmail, async (req, res) => {
  try {
    const job = await addEmailToQueue(req.body);
    
    return res.json({
      success: true,
      jobId: job.id,
      message: 'Email added to queue',
    });
  } catch (error) {
    logger.error('Error in /send-queued endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to add email to queue',
    });
  }
});

// Send bulk emails (direct)
router.post('/send-bulk', validateBulkEmail, async (req, res) => {
  try {
    const results = await sendBulkEmails(req.body.emails);
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    return res.json({
      success: true,
      total: results.length,
      successful: successCount,
      failed: failureCount,
      results,
    });
  } catch (error) {
    logger.error('Error in /send-bulk endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Send bulk emails (queued)
router.post('/send-bulk-queued', validateBulkEmail, async (req, res) => {
  try {
    const jobs = await addBulkEmailsToQueue(req.body.emails);
    
    return res.json({
      success: true,
      total: jobs.length,
      message: 'Emails added to queue',
      jobIds: jobs.map(j => j.id),
    });
  } catch (error) {
    logger.error('Error in /send-bulk-queued endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to add emails to queue',
    });
  }
});

// Queue status
router.get('/queue/status', async (_req, res) => {
  try {
    const status = await getQueueStatus();
    return res.json({
      success: true,
      queue: status,
    });
  } catch (error) {
    logger.error('Error in /queue/status endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to get queue status',
    });
  }
});

// Template: Welcome Email
router.post('/templates/welcome', validateWelcomeEmail, async (req, res) => {
  try {
    const html = generateWelcomeEmail(req.body);
    const result = await sendEmail({
      to: req.body.to,
      subject: 'Welcome to QR Studio! 🎉',
      html,
    });
    
    return res.json(result);
  } catch (error) {
    logger.error('Error in /templates/welcome endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to send welcome email',
    });
  }
});

// Template: Password Reset
router.post('/templates/password-reset', validatePasswordReset, async (req, res) => {
  try {
    const html = generatePasswordResetEmail(req.body);
    const result = await sendEmail({
      to: req.body.to,
      subject: 'Reset your QR Studio password',
      html,
    });
    
    return res.json(result);
  } catch (error) {
    logger.error('Error in /templates/password-reset endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to send password reset email',
    });
  }
});

// Template: Team Invitation
router.post('/templates/team-invitation', validateTeamInvitation, async (req, res) => {
  try {
    const html = generateTeamInvitationEmail(req.body);
    const result = await sendEmail({
      to: req.body.to,
      subject: `You've been invited to join ${req.body.teamName} on QR Studio`,
      html,
    });
    
    return res.json(result);
  } catch (error) {
    logger.error('Error in /templates/team-invitation endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to send team invitation email',
    });
  }
});

// Template: QR Scan Notification
router.post('/templates/scan-notification', validateScanNotification, async (req, res) => {
  try {
    const html = generateQRScanNotificationEmail(req.body);
    const result = await sendEmail({
      to: req.body.to,
      subject: `📊 Your QR code "${req.body.qrCodeName}" was just scanned!`,
      html,
    });
    
    return res.json(result);
  } catch (error) {
    logger.error('Error in /templates/scan-notification endpoint', { error });
    return res.status(500).json({
      success: false,
      error: 'Failed to send scan notification email',
    });
  }
});

export default router;
