import { Session } from 'next-auth';
import { User, QRCode, Team, Scan, Campaign } from '@prisma/client';

// Mock User
export const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  emailVerified: new Date(),
  image: null,
  password: null,
  isAdmin: false,
  role: 'user',
  plan: 'FREE',
  planExpiry: null,
  subscription: 'none',
  lastLoginAt: null,
  emailNotifications: true,
  scanAlerts: true,
  weeklyReports: true,
  limitWarnings: true,
  expirationReminders: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProUser: User = {
  ...mockUser,
  id: 'user-pro',
  email: 'pro@example.com',
  plan: 'PRO',
};

export const mockBusinessUser: User = {
  ...mockUser,
  id: 'user-business',
  email: 'business@example.com',
  plan: 'BUSINESS',
};

// Mock Session
export const mockSession: Session = {
  user: {
    name: mockUser.name,
    email: mockUser.email!,
    image: mockUser.image,
  },
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockProSession: Session = {
  ...mockSession,
  user: {
    name: mockProUser.name,
    email: mockProUser.email!,
    image: mockProUser.image,
  },
};

// Mock QR Code
export const mockQRCode: QRCode = {
  id: 'qr-1',
  name: 'Test QR Code',
  password: null,
  type: 'URL',
  qrType: 'url',
  content: 'https://example.com',
  destination: 'https://example.com',
  shortUrl: 'qr.st/abc123',
  userId: mockUser.id,
  campaignId: null,
  expiresAt: null,
  size: 512,
  foreground: '#000000',
  background: '#FFFFFF',
  logo: null,
  errorLevel: 'M',
  pattern: 'square',
  design: null,
  tags: [],
  favorite: false,
  scanCount: 0,
  lastScanned: null,
  maxScans: null,
  customDomain: null,
  frameId: null,
  micrositeId: null,
  linkInBioId: null,
  vCardPlusId: null,
  digitalMenuId: null,
  leadGateId: null,
  utmParams: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockDynamicQRCode: QRCode = {
  ...mockQRCode,
  id: 'qr-dynamic-1',
  name: 'Dynamic QR Code',
  content: 'https://example.com/redirect',
};

// Mock Team
export const mockTeam: Team = {
  id: 'team-1',
  name: 'Test Team',
  plan: 'BUSINESS',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock Scan
export const mockScan: Scan = {
  id: 'scan-1',
  qrCodeId: mockQRCode.id,
  scannedAt: new Date(),
  country: 'US',
  city: 'New York',
  device: 'iPhone',
  browser: 'Safari',
  os: 'iOS',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  referrer: null,
  visitorId: 'visitor-123',
  isUnique: true,
};

// Mock Campaign
export const mockCampaign: Campaign = {
  id: 'campaign-1',
  name: 'Test Campaign',
  description: 'Test campaign description',
  userId: mockUser.id,
  startDate: null,
  endDate: null,
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock API Responses
export const mockApiResponse = {
  success: <T>(data: T) => ({
    ok: true,
    status: 200,
    json: async () => data,
  }),
  error: (message: string, status = 400) => ({
    ok: false,
    status,
    json: async () => ({ error: message }),
  }),
};

// Mock File
export const mockFile = (name = 'test.csv', content = 'data') => {
  const blob = new Blob([content], { type: 'text/csv' });
  return new File([blob], name, { type: 'text/csv' });
};
