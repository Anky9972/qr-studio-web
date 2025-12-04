import crypto from 'crypto';
import { prisma } from './prisma';

/**
 * Generate a unique short code for QR code URLs
 * Format: 6-8 characters, URL-safe
 */
export async function generateShortCode(length: number = 6): Promise<string> {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let shortCode = '';
  
  // Generate random code
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    shortCode += characters[randomIndex];
  }

  // Check if code already exists
  const existing = await prisma.qRCode.findUnique({
    where: { shortUrl: shortCode },
  });

  // If exists, try again with longer code
  if (existing) {
    return generateShortCode(length + 1);
  }

  return shortCode;
}

/**
 * Generate a branded short URL with custom domain
 */
export function createShortUrl(shortCode: string, customDomain?: string): string {
  const domain = customDomain || process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  return `${protocol}://${domain}/qr/${shortCode}`;
}

/**
 * Validate short code format
 */
export function isValidShortCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,12}$/.test(code);
}
