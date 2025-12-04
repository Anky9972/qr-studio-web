import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateQRCode, downloadQRCode, copyToClipboard } from '../qr-utils';

// Mock QRCode library
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(),
  },
}));

import QRCode from 'qrcode';

describe('QR Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateQRCode', () => {
    it('should generate QR code with default options', async () => {
      const mockDataURL = 'data:image/png;base64,mockdata';
      vi.mocked(QRCode.toDataURL).mockResolvedValue(mockDataURL);

      const result = await generateQRCode({ text: 'https://example.com' });

      expect(result).toBe(mockDataURL);
      expect(QRCode.toDataURL).toHaveBeenCalledWith('https://example.com', {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
    });

    it('should generate QR code with custom options', async () => {
      const mockDataURL = 'data:image/png;base64,customdata';
      vi.mocked(QRCode.toDataURL).mockResolvedValue(mockDataURL);

      const result = await generateQRCode({
        text: 'Custom Text',
        size: 256,
        foreground: '#FF0000',
        background: '#00FF00',
        errorCorrectionLevel: 'H',
        margin: 4,
      });

      expect(result).toBe(mockDataURL);
      expect(QRCode.toDataURL).toHaveBeenCalledWith('Custom Text', {
        width: 256,
        margin: 4,
        color: {
          dark: '#FF0000',
          light: '#00FF00',
        },
        errorCorrectionLevel: 'H',
      });
    });

    it('should handle generation errors', async () => {
      vi.mocked(QRCode.toDataURL).mockRejectedValue(new Error('QR generation failed'));

      await expect(generateQRCode({ text: 'Test' })).rejects.toThrow('Failed to generate QR code');
    });

    it('should handle empty text', async () => {
      const mockDataURL = 'data:image/png;base64,emptydata';
      vi.mocked(QRCode.toDataURL).mockResolvedValue(mockDataURL);

      const result = await generateQRCode({ text: '' });

      expect(result).toBe(mockDataURL);
      expect(QRCode.toDataURL).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('should handle long URLs', async () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2000);
      const mockDataURL = 'data:image/png;base64,longdata';
      vi.mocked(QRCode.toDataURL).mockResolvedValue(mockDataURL);

      const result = await generateQRCode({ text: longUrl });

      expect(result).toBe(mockDataURL);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(longUrl, expect.any(Object));
    });

    it('should handle special characters', async () => {
      const specialText = '日本語 한국어 中文 🎉';
      const mockDataURL = 'data:image/png;base64,specialdata';
      vi.mocked(QRCode.toDataURL).mockResolvedValue(mockDataURL);

      const result = await generateQRCode({ text: specialText });

      expect(result).toBe(mockDataURL);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(specialText, expect.any(Object));
    });
  });

  describe('downloadQRCode', () => {
    beforeEach(() => {
      // Mock DOM elements
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
      vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());
    });

    it('should trigger download with default filename', async () => {
      const dataURL = 'data:image/png;base64,testdata';

      await downloadQRCode(dataURL);

      const link = document.createElement('a');
      expect(link.href).toBe(dataURL);
      expect(link.download).toBe('qrcode.png');
      expect(link.click).toHaveBeenCalled();
    });

    it('should trigger download with custom filename', async () => {
      const dataURL = 'data:image/png;base64,testdata';

      await downloadQRCode(dataURL, 'my-custom-qr.png');

      const link = document.createElement('a');
      expect(link.download).toBe('my-custom-qr.png');
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    });

    it('should copy text to clipboard', async () => {
      const text = 'https://example.com';

      await copyToClipboard(text);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    it('should handle copy errors', async () => {
      const text = 'Test text';
      vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Copy failed'));

      await expect(copyToClipboard(text)).rejects.toThrow('Copy failed');
    });

    it('should copy long text', async () => {
      const longText = 'a'.repeat(10000);

      await copyToClipboard(longText);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longText);
    });
  });
});
