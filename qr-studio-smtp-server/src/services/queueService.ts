import Bull, { Queue, Job } from 'bull';
import { redisConfig } from '../config/smtp.config';
import { EmailOptions, EmailResponse, QueueStatus } from '../types/email.types';
import { sendEmail } from './emailService';
import { logger } from '../utils/logger';

let emailQueue: Queue<EmailOptions> | null = null;

export function createEmailQueue(): Queue<EmailOptions> {
  if (!emailQueue) {
    emailQueue = new Bull<EmailOptions>('email-queue', {
      redis: {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        db: redisConfig.db,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    // Process jobs
    emailQueue.process(async (job: Job<EmailOptions>) => {
      logger.info('Processing email job', { jobId: job.id, to: job.data.to });
      const result = await sendEmail(job.data);
      
      if (!result.success) {
        throw new Error(result.error || 'Email sending failed');
      }
      
      return result;
    });

    // Event listeners
    emailQueue.on('completed', (job: Job, result: EmailResponse) => {
      logger.info('Email job completed', {
        jobId: job.id,
        messageId: result.messageId,
      });
    });

    emailQueue.on('failed', (job: Job, err: Error) => {
      logger.error('Email job failed', {
        jobId: job.id,
        error: err.message,
        attempts: job.attemptsMade,
      });
    });

    emailQueue.on('error', (error: Error) => {
      logger.error('Queue error', { error: error.message });
    });

    logger.info('Email queue created and configured');
  }

  return emailQueue;
}

export async function addEmailToQueue(
  emailOptions: EmailOptions,
  priority?: number
): Promise<Job<EmailOptions>> {
  const queue = createEmailQueue();
  
  const job = await queue.add(emailOptions, {
    priority: priority || 0,
  });

  logger.info('Email added to queue', {
    jobId: job.id,
    to: emailOptions.to,
    subject: emailOptions.subject,
  });

  return job;
}

export async function addBulkEmailsToQueue(
  emails: EmailOptions[],
  priority?: number
): Promise<Job<EmailOptions>[]> {
  const queue = createEmailQueue();
  
  const jobs = await queue.addBulk(
    emails.map((email) => ({
      data: email,
      opts: { priority: priority || 0 },
    }))
  );

  logger.info(`Added ${emails.length} emails to queue`);

  return jobs;
}

export async function getQueueStatus(): Promise<QueueStatus> {
  const queue = createEmailQueue();

  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
  ]);

  return { waiting, active, completed, failed };
}

export async function clearQueue(): Promise<void> {
  const queue = createEmailQueue();
  await queue.empty();
  logger.info('Email queue cleared');
}

export async function closeQueue(): Promise<void> {
  if (emailQueue) {
    await emailQueue.close();
    emailQueue = null;
    logger.info('Email queue closed');
  }
}
