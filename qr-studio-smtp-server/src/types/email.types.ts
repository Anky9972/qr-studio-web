export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
}

export interface BulkEmailRequest {
  emails: EmailOptions[];
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

// Template-specific interfaces
export interface WelcomeEmailData {
  to: string;
  userName: string;
  userEmail: string;
}

export interface PasswordResetEmailData {
  to: string;
  userName: string;
  resetUrl: string;
  expiryTime?: string;
}

export interface TeamInvitationEmailData {
  to: string;
  inviterName: string;
  inviterEmail: string;
  teamName: string;
  role: string;
  inviteUrl: string;
}

export interface QRScanNotificationEmailData {
  to: string;
  userName: string;
  qrCodeName: string;
  scanCount: number;
  timestamp: string;
  dashboardUrl: string;
  location?: string;
  device?: string;
}
