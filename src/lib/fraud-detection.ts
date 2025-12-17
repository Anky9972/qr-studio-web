// Fraud Detection & Security
// Bot detection, IP blocking, anomaly detection

import { prisma } from './prisma';

export interface FraudCheckResult {
  isBlocked: boolean;
  reason?: string;
  riskScore: number; // 0-100
  flags: string[];
}

// Known bot user agents patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /java/i,
  /go-http-client/i,
  /okhttp/i,
  /headless/i,
];

// Suspicious TLDs often used for spam/phishing
const SUSPICIOUS_TLDS = [
  '.tk',
  '.ml',
  '.ga',
  '.cf',
  '.gq',
  '.xyz',
  '.top',
  '.win',
  '.download',
  '.loan',
];

/**
 * Check if user agent is a bot
 */
export function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

/**
 * Check if IP is in blocklist
 * Uses in-memory cache for known bad IPs and ranges
 */
// In-memory blocklist (can be moved to Redis/database for production)
const blockedIPs = new Set<string>();
const blockedIPRanges: string[] = [];

// Add common known malicious IP ranges (example)
const KNOWN_BAD_RANGES = [
  '0.0.0.0/8',     // "This" network
  '10.0.0.0/8',    // Private - shouldn't access from outside
  '127.0.0.0/8',   // Loopback (if not expected)
];

export function blockIP(ipAddress: string): void {
  blockedIPs.add(ipAddress);
}

export function unblockIP(ipAddress: string): void {
  blockedIPs.delete(ipAddress);
}

export function isIPInRange(ip: string, range: string): boolean {
  try {
    const [rangeIP, bits] = range.split('/');
    const mask = ~(2 ** (32 - parseInt(bits)) - 1);

    const ipNum = ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
    const rangeNum = rangeIP.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);

    return (ipNum & mask) === (rangeNum & mask);
  } catch {
    return false;
  }
}

export async function isIPBlocked(ipAddress: string): Promise<boolean> {
  try {
    // Check explicit blocklist
    if (blockedIPs.has(ipAddress)) {
      return true;
    }

    // Check blocked IP ranges
    for (const range of [...blockedIPRanges, ...KNOWN_BAD_RANGES]) {
      if (isIPInRange(ipAddress, range)) {
        return true;
      }
    }

    // TODO: Extend with database check if needed
    // const blocked = await prisma.blockedIP.findUnique({ where: { ipAddress } });
    // return !!blocked;

    return false;
  } catch (error) {
    console.error('Error checking IP block status:', error);
    return false;
  }
}

/**
 * Check if URL is suspicious/malicious
 */
export function isSuspiciousURL(url: string): {
  isSuspicious: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  try {
    const urlObj = new URL(url);

    // Check for suspicious TLDs
    const hostname = urlObj.hostname.toLowerCase();
    if (SUSPICIOUS_TLDS.some((tld) => hostname.endsWith(tld))) {
      reasons.push('Suspicious top-level domain');
    }

    // Check for IP address as hostname (often used in phishing)
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      reasons.push('Direct IP address used instead of domain');
    }

    // Check for excessive subdomains (common in phishing)
    const parts = hostname.split('.');
    if (parts.length > 4) {
      reasons.push('Excessive subdomain levels');
    }

    // Check for suspicious keywords in URL
    const suspiciousKeywords = [
      'verify',
      'secure',
      'account',
      'update',
      'login',
      'signin',
      'banking',
      'paypal',
      'apple',
      'microsoft',
      'amazon',
    ];

    const fullUrl = url.toLowerCase();
    const matchedKeywords = suspiciousKeywords.filter((keyword) =>
      fullUrl.includes(keyword)
    );

    if (matchedKeywords.length >= 2) {
      reasons.push('Multiple suspicious keywords in URL');
    }

    // Check for URL shorteners (can hide malicious links)
    const shortenerDomains = [
      'bit.ly',
      'tinyurl.com',
      'goo.gl',
      't.co',
      'ow.ly',
      'is.gd',
    ];

    if (shortenerDomains.some((domain) => hostname.includes(domain))) {
      reasons.push('Uses URL shortener service');
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  } catch (error) {
    return {
      isSuspicious: true,
      reasons: ['Invalid URL format'],
    };
  }
}

/**
 * Comprehensive fraud check for QR scan
 */
export async function performFraudCheck(scanData: {
  ipAddress: string;
  userAgent: string;
  qrCodeId: string;
}): Promise<FraudCheckResult> {
  const flags: string[] = [];
  let riskScore = 0;

  // Check if bot
  if (isBot(scanData.userAgent)) {
    flags.push('Bot user agent detected');
    riskScore += 40;
  }

  // Check if IP is blocked
  const ipBlocked = await isIPBlocked(scanData.ipAddress);
  if (ipBlocked) {
    return {
      isBlocked: true,
      reason: 'IP address is blocked',
      riskScore: 100,
      flags: ['Blocked IP'],
    };
  }

  // Check scan rate from this IP
  const recentScans = await getRecentScansFromIP(
    scanData.ipAddress,
    scanData.qrCodeId
  );

  if (recentScans > 10) {
    flags.push('High scan rate from single IP');
    riskScore += 30;
  }

  // Check for missing user agent
  if (!scanData.userAgent) {
    flags.push('Missing user agent');
    riskScore += 20;
  }

  // Determine if should block
  const isBlocked = riskScore >= 70;

  return {
    isBlocked,
    reason: isBlocked ? 'High risk score - possible fraud' : undefined,
    riskScore,
    flags,
  };
}

/**
 * Get recent scans from same IP (last 5 minutes)
 */
async function getRecentScansFromIP(
  ipAddress: string,
  qrCodeId: string
): Promise<number> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const count = await prisma.scan.count({
      where: {
        qrCodeId,
        ipAddress,
        scannedAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    return count;
  } catch (error) {
    console.error('Error checking recent scans:', error);
    return 0;
  }
}

/**
 * Rate limiting check
 */
export async function checkRateLimit(
  ipAddress: string,
  limitPerMinute: number = 60
): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}> {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const recentCount = await prisma.scan.count({
      where: {
        ipAddress,
        scannedAt: {
          gte: oneMinuteAgo,
        },
      },
    });

    const remaining = Math.max(0, limitPerMinute - recentCount);
    const resetAt = new Date(Date.now() + 60 * 1000);

    return {
      allowed: recentCount < limitPerMinute,
      remaining,
      resetAt,
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // Allow on error to avoid blocking legitimate users
    return {
      allowed: true,
      remaining: limitPerMinute,
      resetAt: new Date(Date.now() + 60 * 1000),
    };
  }
}

/**
 * Analyze scan patterns for anomalies
 */
export async function analyzeScanPatterns(
  qrCodeId: string,
  timeWindow: number = 60
): Promise<{
  isAnomaly: boolean;
  reason?: string;
  metrics: {
    scanRate: number;
    uniqueIPs: number;
    botPercentage: number;
  };
}> {
  try {
    const windowStart = new Date(Date.now() - timeWindow * 60 * 1000);

    const scans = await prisma.scan.findMany({
      where: {
        qrCodeId,
        scannedAt: {
          gte: windowStart,
        },
      },
      select: {
        ipAddress: true,
        userAgent: true,
      },
    });

    if (scans.length === 0) {
      return {
        isAnomaly: false,
        metrics: {
          scanRate: 0,
          uniqueIPs: 0,
          botPercentage: 0,
        },
      };
    }

    const uniqueIPs = new Set(scans.map((s) => s.ipAddress)).size;
    const botScans = scans.filter((s) => isBot(s.userAgent || '')).length;
    const botPercentage = (botScans / scans.length) * 100;
    const scanRate = scans.length / timeWindow; // scans per minute

    let isAnomaly = false;
    let reason: string | undefined;

    // Anomaly detection rules
    if (scanRate > 100) {
      isAnomaly = true;
      reason = 'Abnormally high scan rate (possible DDoS)';
    } else if (botPercentage > 50) {
      isAnomaly = true;
      reason = 'High percentage of bot scans';
    } else if (scans.length > 100 && uniqueIPs < 5) {
      isAnomaly = true;
      reason = 'Many scans from very few IPs (scan farm)';
    }

    return {
      isAnomaly,
      reason,
      metrics: {
        scanRate: parseFloat(scanRate.toFixed(2)),
        uniqueIPs,
        botPercentage: parseFloat(botPercentage.toFixed(2)),
      },
    };
  } catch (error) {
    console.error('Error analyzing scan patterns:', error);
    return {
      isAnomaly: false,
      metrics: {
        scanRate: 0,
        uniqueIPs: 0,
        botPercentage: 0,
      },
    };
  }
}
