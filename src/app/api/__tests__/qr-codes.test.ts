import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../qr-codes/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { mockSession, mockQRCode, mockUser } from '@/test/mocks';
import { checkQRCodeLimit, checkDynamicQRCodeLimit } from '@/middleware/planLimits';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma', () => ({
  prisma: {
    qRCode: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));
vi.mock('@/middleware/planLimits', () => ({
  checkQRCodeLimit: vi.fn(),
  checkDynamicQRCodeLimit: vi.fn(),
}));

describe('QR Codes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/qr-codes', () => {
    it('should return 401 for unauthenticated requests', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/qr-codes');
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return QR codes for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.qRCode.findMany).mockResolvedValue([mockQRCode]);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/qr-codes');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.qrCodes).toHaveLength(1);
      expect(data.pagination.total).toBe(1);
      expect(data.qrCodes[0].id).toBe(mockQRCode.id);
    });

    it('should filter QR codes by search query', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.qRCode.findMany).mockResolvedValue([mockQRCode]);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/qr-codes?search=test');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.qRCode.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });

    it('should paginate results', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.qRCode.findMany).mockResolvedValue([mockQRCode]);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(100);

      const request = new NextRequest('http://localhost:3000/api/qr-codes?page=2&limit=10');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.qRCode.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
      const data = await response.json();
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.totalPages).toBe(10);
    });

    it('should filter by type', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.qRCode.findMany).mockResolvedValue([mockQRCode]);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/qr-codes?type=URL');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.qRCode.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'URL',
          }),
        })
      );
    });

    it('should filter favorites', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.qRCode.findMany).mockResolvedValue([mockQRCode]);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/qr-codes?favorite=true');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.qRCode.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            favorite: true,
          }),
        })
      );
    });

    it('should handle database errors', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.qRCode.findMany).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/qr-codes');
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch QR codes');
    });
  });

  describe('POST /api/qr-codes', () => {
    const validQRData = {
      name: 'Test QR',
      type: 'static',
      content: 'https://example.com',
      qrType: 'URL',
      size: 512,
      foreground: '#000000',
      background: '#FFFFFF',
      errorLevel: 'M',
      pattern: 'square',
    };

    it('should return 401 for unauthenticated requests', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/qr-codes', {
        method: 'POST',
        body: JSON.stringify(validQRData),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should create QR code for authenticated user under limit', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(10);
      vi.mocked(prisma.qRCode.create).mockResolvedValue(mockQRCode);
      vi.mocked(checkQRCodeLimit).mockResolvedValue({
        allowed: true,
        current: 10,
        limit: 50,
        percentage: 20,
      });

      const request = new NextRequest('http://localhost:3000/api/qr-codes', {
        method: 'POST',
        body: JSON.stringify(validQRData),
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toBe(mockQRCode.id);
      expect(prisma.qRCode.create).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const invalidData = { name: 'Test' }; // Missing required fields

      const request = new NextRequest('http://localhost:3000/api/qr-codes', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeTruthy();
    });

    it('should handle JSON parse errors', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/qr-codes', {
        method: 'POST',
        body: 'invalid json',
      });
      const response = await POST(request);

      expect(response.status).toBe(500); // JSON parse errors result in 500
    });

    it('should handle database errors during creation', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.qRCode.count).mockResolvedValue(10);
      vi.mocked(prisma.qRCode.create).mockRejectedValue(new Error('Database error'));
      vi.mocked(checkQRCodeLimit).mockResolvedValue({
        allowed: true,
        current: 10,
        limit: 50,
        percentage: 20,
      });

      const request = new NextRequest('http://localhost:3000/api/qr-codes', {
        method: 'POST',
        body: JSON.stringify(validQRData),
      });
      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to create QR code');
    });
  });
});
