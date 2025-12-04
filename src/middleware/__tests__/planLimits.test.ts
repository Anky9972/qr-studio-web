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
      vi.mocked(prisma.qRCode.count).mockResolvedValue(100);

      const result = await checkQRCodeLimit(mockProUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(100);
      expect(result.limit).toBe(500);
      expect(result.percentage).toBe(20);
    });

    it('should allow BUSINESS user unlimited QR codes', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(10000);

      const result = await checkQRCodeLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(10000);
      expect(result.limit).toBe(Infinity);
      expect(result.percentage).toBe(0);
    });

    it('should handle user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await checkQRCodeLimit('non-existent');

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(0);
      expect(result.limit).toBe(0);
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

    it('should allow unlimited dynamic QR for BUSINESS user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(500);

      const result = await checkDynamicQRCodeLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(500);
      expect(result.limit).toBe(Infinity);
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
      expect(result.limit).toBe(100);
    });

    it('should block oversized bulk for PRO user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(50);

      const result = await checkBulkGenerationLimit(mockProUser.id, 150);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(100);
    });

    it('should allow large bulk for BUSINESS user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(100);

      const result = await checkBulkGenerationLimit(mockBusinessUser.id, 500);

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(1000);
    });

    it('should check remaining QR code capacity', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(480);

      const result = await checkBulkGenerationLimit(mockProUser.id, 30);

      expect(result.allowed).toBe(false); // 480 + 30 = 510 > 500 limit
    });
  });

  describe('checkTeamMemberLimit', () => {
    it('should block team members for FREE user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await checkTeamMemberLimit(mockUser.id);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(0);
    });

    it('should block team members for PRO user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);

      const result = await checkTeamMemberLimit(mockProUser.id);

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(0);
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

    it('should allow API keys for PRO user under limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(1);

      const result = await checkApiKeyLimit(mockProUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(1);
      expect(result.limit).toBe(3);
    });

    it('should block API keys for PRO user at limit', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(3);

      const result = await checkApiKeyLimit(mockProUser.id);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(3);
      expect(result.limit).toBe(3);
    });

    it('should allow more API keys for BUSINESS user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(5);

      const result = await checkApiKeyLimit(mockBusinessUser.id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(5);
      expect(result.limit).toBe(10);
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

      expect(result).toEqual({
        plan: 'FREE',
        qrCodes: {
          current: 30,
          limit: 50,
          percentage: 60,
          allowed: true,
        },
        dynamicQrCodes: {
          current: 0,
          limit: 0,
          percentage: 0,
          allowed: false,
        },
        teamMembers: {
          current: 0,
          limit: 0,
          percentage: 0,
          allowed: false,
        },
        apiKeys: {
          current: 0,
          limit: 0,
          percentage: 0,
          allowed: false,
        },
      });
    });

    it('should return complete status for PRO user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(200);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(50);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(0);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(2);

      const result = await getUserLimitsStatus(mockProUser.id);

      expect(result).toEqual({
        plan: 'PRO',
        qrCodes: {
          current: 200,
          limit: 500,
          percentage: 40,
          allowed: true,
        },
        dynamicQrCodes: {
          current: 50,
          limit: 100,
          percentage: 50,
          allowed: true,
        },
        teamMembers: {
          current: 0,
          limit: 0,
          percentage: 0,
          allowed: false,
        },
        apiKeys: {
          current: 2,
          limit: 3,
          percentage: 66.67,
          allowed: true,
        },
      });
    });

    it('should return complete status for BUSINESS user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockBusinessUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(1000);
      vi.mocked(prisma.qRCode.count).mockResolvedValueOnce(200);
      vi.mocked(prisma.teamMember.count).mockResolvedValue(5);
      vi.mocked(prisma.apiKey.count).mockResolvedValue(3);

      const result = await getUserLimitsStatus(mockBusinessUser.id);

      expect(result).toEqual({
        plan: 'BUSINESS',
        qrCodes: {
          current: 1000,
          limit: Infinity,
          percentage: 0,
          allowed: true,
        },
        dynamicQrCodes: {
          current: 200,
          limit: Infinity,
          percentage: 0,
          allowed: true,
        },
        teamMembers: {
          current: 5,
          limit: 10,
          percentage: 50,
          allowed: true,
        },
        apiKeys: {
          current: 3,
          limit: 10,
          percentage: 30,
          allowed: true,
        },
      });
    });
  });
});
