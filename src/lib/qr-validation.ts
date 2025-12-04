// QR Code Testing and Validation Tools

import QRCode from 'qrcode';

export interface QRValidationResult {
  isValid: boolean;
  readability: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  recommendations: string[];
  contrast: number;
  size: number;
  errorLevel: string;
}

/**
 * Validate QR code readability and design
 */
export async function validateQRCode(options: {
  content: string;
  foreground: string;
  background: string;
  size: number;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  logo?: string;
}): Promise<QRValidationResult> {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let readability: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';

  // Check contrast ratio
  const contrast = calculateContrast(options.foreground, options.background);

  if (contrast < 3) {
    issues.push('Low contrast between foreground and background');
    recommendations.push('Use colors with higher contrast (minimum 3:1 ratio)');
    readability = 'poor';
  } else if (contrast < 5) {
    issues.push('Moderate contrast - may be difficult to scan in some conditions');
    recommendations.push('Consider using darker foreground or lighter background');
    readability = 'fair';
  } else if (contrast < 7) {
    readability = 'good';
  }

  // Check size
  if (options.size < 200) {
    issues.push('QR code size is very small');
    recommendations.push('Use minimum 200x200 pixels for reliable scanning');
    readability = 'poor';
  } else if (options.size < 300) {
    issues.push('QR code size is small - may be hard to scan from distance');
    recommendations.push('Use at least 300x300 pixels for better readability');
    if (readability === 'excellent') readability = 'good';
  }

  // Check content length
  if (options.content.length > 500) {
    issues.push('Content is very long - QR code will be complex');
    recommendations.push('Consider using a shortened URL or dynamic QR code');
    if (readability === 'excellent') readability = 'good';
  } else if (options.content.length > 1000) {
    issues.push('Content is too long - QR code may not be scannable');
    recommendations.push('Use a URL shortener or reduce content length');
    readability = 'poor';
  }

  // Check error correction level with logo
  if (options.logo) {
    if (options.errorLevel === 'L' || options.errorLevel === 'M') {
      issues.push('Error correction level too low for QR code with logo');
      recommendations.push('Use error level H (High) when adding a logo');
      readability = 'fair';
    }
  }

  // Check color combinations
  if (isLightColor(options.foreground) && isLightColor(options.background)) {
    issues.push('Both foreground and background are light colors');
    recommendations.push('Use a dark foreground with light background, or vice versa');
    readability = 'poor';
  }

  if (isDarkColor(options.foreground) && isDarkColor(options.background)) {
    issues.push('Both foreground and background are dark colors');
    recommendations.push('Ensure sufficient contrast between colors');
    readability = 'poor';
  }

  return {
    isValid: issues.length === 0 || readability !== 'poor',
    readability,
    issues,
    recommendations,
    contrast,
    size: options.size,
    errorLevel: options.errorLevel,
  };
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrast(color1: string, color2: string): number {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function calculateLuminance(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const [rs, gs, bs] = [r, g, b].map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if color is light
 */
function isLightColor(color: string): boolean {
  return calculateLuminance(color) > 0.5;
}

/**
 * Check if color is dark
 */
function isDarkColor(color: string): boolean {
  return calculateLuminance(color) < 0.2;
}

/**
 * Test if URL is reachable (link checker)
 */
export async function validateURL(url: string): Promise<{
  isValid: boolean;
  isReachable: boolean;
  statusCode?: number;
  error?: string;
}> {
  try {
    // Basic URL validation
    const urlObj = new URL(url);

    if (!urlObj.protocol.startsWith('http')) {
      return {
        isValid: false,
        isReachable: false,
        error: 'Only HTTP(S) URLs are supported',
      };
    }

    // Try to reach the URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        isValid: true,
        isReachable: response.ok,
        statusCode: response.status,
        error: !response.ok ? `Server returned ${response.status}` : undefined,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if ((fetchError as Error).name === 'AbortError') {
        return {
          isValid: true,
          isReachable: false,
          error: 'Request timed out',
        };
      }

      return {
        isValid: true,
        isReachable: false,
        error: 'Failed to connect to URL',
      };
    }
  } catch (error) {
    return {
      isValid: false,
      isReachable: false,
      error: 'Invalid URL format',
    };
  }
}

/**
 * Generate test QR code (for preview without saving)
 */
export async function generateTestQR(options: {
  content: string;
  size: number;
  foreground: string;
  background: string;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
}): Promise<string> {
  try {
    const dataURL = await QRCode.toDataURL(options.content, {
      width: options.size,
      margin: 2,
      color: {
        dark: options.foreground,
        light: options.background,
      },
      errorCorrectionLevel: options.errorLevel,
    });

    return dataURL;
  } catch (error) {
    console.error('Error generating test QR:', error);
    throw new Error('Failed to generate test QR code');
  }
}

/**
 * Scan anomaly detection
 * Detects suspicious scan patterns (bot attacks, scan farms)
 */
export function detectScanAnomaly(scans: {
  ipAddress?: string;
  userAgent?: string;
  scannedAt: Date;
}[]): {
  isAnomaly: boolean;
  reason?: string;
  suspiciousIPs: string[];
  botScans: number;
} {
  const ipCounts = new Map<string, number>();
  const userAgents = new Set<string>();
  let botScans = 0;
  const suspiciousIPs: string[] = [];

  // Known bot user agents
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
  ];

  for (const scan of scans) {
    // Count scans per IP
    if (scan.ipAddress) {
      const count = (ipCounts.get(scan.ipAddress) || 0) + 1;
      ipCounts.set(scan.ipAddress, count);

      // Flag IPs with excessive scans
      if (count > 10) {
        suspiciousIPs.push(scan.ipAddress);
      }
    }

    // Check for bot user agents
    if (scan.userAgent) {
      userAgents.add(scan.userAgent);
      if (botPatterns.some((pattern) => pattern.test(scan.userAgent!))) {
        botScans++;
      }
    }
  }

  // Detect anomalies
  const avgScansPerIP = scans.length / ipCounts.size;

  if (avgScansPerIP > 20) {
    return {
      isAnomaly: true,
      reason: 'High average scans per IP (possible scan farm)',
      suspiciousIPs: Array.from(suspiciousIPs),
      botScans,
    };
  }

  if (botScans / scans.length > 0.3) {
    return {
      isAnomaly: true,
      reason: 'High percentage of bot scans',
      suspiciousIPs: Array.from(suspiciousIPs),
      botScans,
    };
  }

  if (userAgents.size === 1 && scans.length > 50) {
    return {
      isAnomaly: true,
      reason: 'All scans from identical user agent (likely bot)',
      suspiciousIPs: Array.from(suspiciousIPs),
      botScans,
    };
  }

  return {
    isAnomaly: false,
    suspiciousIPs: Array.from(suspiciousIPs),
    botScans,
  };
}
