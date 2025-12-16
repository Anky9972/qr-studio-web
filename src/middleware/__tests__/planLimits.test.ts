import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkQRCodeLimit,
  checkDynamicQRCodeLimit,
  checkBulkGenerationLimit,
  checkTeamMemberLimit,
  checkApiKeyLimit,
  getUserLimitsStatus,
} from '../planLimits';
import { prisma } from '@/lib/prisma';
import { mockUser, mockProUser, mockBusinessUser } from '@/test/mocks';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    qRCode: {
      count: vi.fn(),
    },
    teamMember: {
      count: vi.fn(),
    },
    apiKey: {
      count: vi.fn(),
    },
  },
}));

describe('Plan Limits Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkQRCodeLimit', () => {
    it('should allow creation for FREE user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(25);

      const result = await checkQRCodeLimit(mockUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(25);
      expect(result.limit).toBe(50);
      expect(result.percentage).toBe(50);
    });

    it('should block creation for FREE user at limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(50);

      const result = await checkQRCodeLimit(mockUser.id);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(50);
      expect(result.limit).toBe(50);
      expect(result.percentage).toBe(100);
    });

    it('should allow PRO user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(50);

      const result = await checkQRCodeLimit(mockProUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(50);
      expect(result.limit).toBe(100); // PRO limit is 100
      expect(result.percentage).toBe(50);
    });

    it('should allow BUSINESS user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(500);

      const result = await checkQRCodeLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(500);
      expect(result.limit).toBe(1000); // BUSINESS limit is 1000
      expect(result.percentage).toBe(50);
    });

    it('should handle user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(0);

      const result = await checkQRCodeLimit('non-existent');

      // Falls back to FREE plan limits
      expect(result.allowed).toBe(true);
      expect(result.current).toBe(0);
      expect(result.limit).toBe(50);
    });
  });

  describe('checkDynamicQRCodeLimit', () => {
    it('should block dynamic QR for FREE user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(0);

      const result = await checkDynamicQRCodeLimit(mockUser.id);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(0);
      expect(result.limit).toBe(0);
    });

    it('should allow dynamic QR for PRO user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(50);

      const result = await checkDynamicQRCodeLimit(mockProUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(50);
      expect(result.limit).toBe(100);
      expect(result.percentage).toBe(50);
    });

    it('should block dynamic QR for PRO user at limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(100);

      const result = await checkDynamicQRCodeLimit(mockProUser.id);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(100);
      expect(result.limit).toBe(100);
    });

    it('should allow dynamic QR for BUSINESS user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(500);

      const result = await checkDynamicQRCodeLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(500);
      expect(result.limit).toBe(1000); // BUSINESS dynamic limit is 1000
    });
  });

  describe('checkBulkGenerationLimit', () => {
    it('should block bulk generation for FREE user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await checkBulkGenerationLimit(mockUser.id, 10);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(0);
    });

    it('should allow small bulk for PRO user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(50);

      const result = await checkBulkGenerationLimit(mockProUser.id, 50);

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(1000); // PRO bulk limit is 1000
    });

    it('should block oversized bulk for PRO user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(50);

      const result = await checkBulkGenerationLimit(mockProUser.id, 1500);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(1000);
    });

    it('should allow large bulk for BUSINESS user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(100);

      const result = await checkBulkGenerationLimit(mockBusinessUser.id, 5000);

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(10000); // BUSINESS bulk limit is 10000
    });

    it('should check batch size against limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(50);

      const result = await checkBulkGenerationLimit(mockProUser.id, 1001);

      expect(result.allowed).toBe(false); // 1001 > 1000 limit
    });
  });

  describe('checkTeamMemberLimit', () => {
    it('should allow team member for FREE user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(0);

      const result = await checkTeamMemberLimit(mockUser.id);

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(1); // FREE has 1 team member
    });

    it('should block team member for FREE user at limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(1);

      const result = await checkTeamMemberLimit(mockUser.id);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(1);
    });

    it('should allow team members for BUSINESS user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(3);

      const result = await checkTeamMemberLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(3);
      expect(result.limit).toBe(10);
    });

    it('should block team members for BUSINESS user at limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(10);

      const result = await checkTeamMemberLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(10);
      expect(result.limit).toBe(10);
    });
  });

  describe('checkApiKeyLimit', () => {
    it('should block API keys for FREE user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await checkApiKeyLimit(mockUser.id);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(0);
    });

    it('should block API keys for PRO user (no API access)', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(0);

      const result = await checkApiKeyLimit(mockProUser.id);

      // PRO plan has apiCalls=0, so API access is blocked
      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(0);
    });

    it('should allow API keys for BUSINESS user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(2);

      const result = await checkApiKeyLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(2);
      expect(result.limit).toBe(5); // BUSINESS gets 5 API keys
    });

    it('should block API keys for BUSINESS user at limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(5);

      const result = await checkApiKeyLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(5);
      expect(result.limit).toBe(5);
    });
  });

  describe('getUserLimitsStatus', () => {
    it('should return complete status for FREE user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(30); // Total QR codes
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(0); // Dynamic QR codes
      vi.mocked(prisma.teamMember.count).mockResolvedValue(0);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(0);

      const result = await getUserLimitsStatus(mockUser.id);

      expect(result.plan).toBe('FREE');
      expect(result.qrCodes.current).toBe(30);
      expect(result.qrCodes.limit).toBe(50);
      expect(result.qrCodes.allowed).toBe(true);
      expect(result.dynamicQrCodes.limit).toBe(0);
      expect(result.dynamicQrCodes.allowed).toBe(false);
      expect(result.teamMembers.limit).toBe(1);
      expect(result.apiKeys.limit).toBe(0);
      expect(result.apiKeys.allowed).toBe(false);
    });

    it('should return complete status for PRO user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(50);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(50);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(0);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(0);

      const result = await getUserLimitsStatus(mockProUser.id);

      expect(result.plan).toBe('PRO');
      expect(result.qrCodes.current).toBe(50);
      expect(result.qrCodes.limit).toBe(100);
      expect(result.qrCodes.allowed).toBe(true);
      expect(result.dynamicQrCodes.current).toBe(50);
      expect(result.dynamicQrCodes.limit).toBe(100);
      expect(result.dynamicQrCodes.allowed).toBe(true);
      expect(result.teamMembers.limit).toBe(1);
      expect(result.apiKeys.limit).toBe(0); // PRO has no API access
      expect(result.apiKeys.allowed).toBe(false);
    });

    it('should return complete status for BUSINESS user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(500);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(200);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(5);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(3);

      const result = await getUserLimitsStatus(mockBusinessUser.id);

      expect(result.plan).toBe('BUSINESS');
      expect(result.qrCodes.current).toBe(500);
      expect(result.qrCodes.limit).toBe(1000);
      expect(result.qrCodes.allowed).toBe(true);
      expect(result.dynamicQrCodes.current).toBe(200);
      expect(result.dynamicQrCodes.limit).toBe(1000);
      expect(result.dynamicQrCodes.allowed).toBe(true);
      expect(result.teamMembers.current).toBe(5);
      expect(result.teamMembers.limit).toBe(10);
      expect(result.teamMembers.allowed).toBe(true);
      expect(result.apiKeys.current).toBe(3);
      expect(result.apiKeys.limit).toBe(5);
      expect(result.apiKeys.allowed).toBe(true);
    });
  });
});
