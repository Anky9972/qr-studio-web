// Custom Domain Manager - CNAME Verification & SSL
import { prisma } from './prisma';
import crypto from 'crypto';

export interface DomainVerificationResult {
  verified: boolean;
  sslEnabled: boolean;
  errors: string[];
  dnsRecords?: {
    cname?: string;
    txt?: string;
  };
}

/**
 * Generate verification token for domain
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify domain CNAME configuration
 */
export async function verifyDomainCNAME(
  domain: string,
  expectedTarget: string
): Promise<boolean> {
  try {
    // Use DNS lookup to check CNAME record
    const dns = await import('dns').then(m => m.promises);
    
    try {
      const records = await dns.resolveCname(domain);
      return records.some(record => 
        record.toLowerCase() === expectedTarget.toLowerCase()
      );
    } catch (error: any) {
      // If CNAME doesn't exist, check A record pointing to our IP
      if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
        return false;
      }
      throw error;
    }
  } catch (error) {
    console.error('Domain CNAME verification failed:', error);
    return false;
  }
}

/**
 * Verify domain TXT record (alternative verification)
 */
export async function verifyDomainTXT(
  domain: string,
  expectedToken: string
): Promise<boolean> {
  try {
    const dns = await import('dns').then(m => m.promises);
    const records = await dns.resolveTxt(domain);
    
    // Flatten TXT records (they come as arrays)
    const flatRecords = records.flat();
    
    // Check if any record matches our verification token
    return flatRecords.some(record => 
      record.includes(`qrstudio-verification=${expectedToken}`)
    );
  } catch (error) {
    console.error('Domain TXT verification failed:', error);
    return false;
  }
}

/**
 * Perform complete domain verification
 */
export async function verifyCustomDomain(
  domainId: string
): Promise<DomainVerificationResult> {
  const result: DomainVerificationResult = {
    verified: false,
    sslEnabled: false,
    errors: [],
  };

  try {
    // Get domain from database
    const domain = await prisma.customDomain.findUnique({
      where: { id: domainId },
    });

    if (!domain) {
      result.errors.push('Domain not found');
      return result;
    }

    // Check CNAME record
    const cnameValid = await verifyDomainCNAME(domain.domain, domain.cnameTarget);
    
    if (!cnameValid) {
      // Try TXT record as fallback
      const txtValid = await verifyDomainTXT(domain.domain, domain.verificationToken);
      
      if (!txtValid) {
        result.errors.push('CNAME or TXT record not found or incorrect');
        result.dnsRecords = {
          cname: `CNAME ${domain.domain} -> ${domain.cnameTarget}`,
          txt: `TXT qrstudio-verification=${domain.verificationToken}`,
        };
        return result;
      }
    }

    // Check SSL (try HTTPS request)
    const sslValid = await checkSSL(domain.domain);
    
    // Update domain in database
    await prisma.customDomain.update({
      where: { id: domainId },
      data: {
        verified: true,
        verifiedAt: new Date(),
        sslEnabled: sslValid,
        lastChecked: new Date(),
      },
    });

    result.verified = true;
    result.sslEnabled = sslValid;
    
    if (!sslValid) {
      result.errors.push('SSL certificate not yet active (may take 24-48 hours)');
    }

    return result;
  } catch (error: any) {
    result.errors.push(`Verification failed: ${error.message}`);
    return result;
  }
}

/**
 * Check if domain has valid SSL certificate
 */
async function checkSSL(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Create custom domain
 */
export async function createCustomDomain(
  userId: string,
  domain: string
): Promise<{
  success: boolean;
  domain?: any;
  error?: string;
}> {
  try {
    // Validate domain format
    if (!isValidDomain(domain)) {
      return { success: false, error: 'Invalid domain format' };
    }

    // Check if domain already exists
    const existing = await prisma.customDomain.findUnique({
      where: { domain },
    });

    if (existing) {
      return { success: false, error: 'Domain already registered' };
    }

    // Create domain
    const newDomain = await prisma.customDomain.create({
      data: {
        userId,
        domain,
        verified: false,
        sslEnabled: false,
        cnameTarget: process.env.NEXT_PUBLIC_CNAME_TARGET || 'qrstudio.app',
        verificationToken: generateVerificationToken(),
      },
    });

    return { success: true, domain: newDomain };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete custom domain
 */
export async function deleteCustomDomain(domainId: string): Promise<boolean> {
  try {
    await prisma.customDomain.delete({
      where: { id: domainId },
    });
    return true;
  } catch (error) {
    console.error('Failed to delete domain:', error);
    return false;
  }
}

/**
 * Get user's custom domains
 */
export async function getUserDomains(userId: string) {
  return await prisma.customDomain.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get domain by name
 */
export async function getDomainByName(domain: string) {
  return await prisma.customDomain.findUnique({
    where: { domain },
  });
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return domainRegex.test(domain);
}

/**
 * Get domain setup instructions
 */
export function getDomainSetupInstructions(
  domain: string,
  cnameTarget: string,
  verificationToken: string
): {
  method1: { title: string; steps: string[] };
  method2: { title: string; steps: string[] };
} {
  return {
    method1: {
      title: 'CNAME Record (Recommended)',
      steps: [
        'Log in to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)',
        'Navigate to DNS settings',
        `Add a CNAME record: ${domain} -> ${cnameTarget}`,
        'Save the changes',
        'Wait 5-10 minutes for DNS propagation',
        'Click "Verify Domain" button',
      ],
    },
    method2: {
      title: 'TXT Record (Alternative)',
      steps: [
        'Log in to your domain registrar',
        'Navigate to DNS settings',
        `Add a TXT record: ${domain} -> qrstudio-verification=${verificationToken}`,
        'Save the changes',
        'Wait 5-10 minutes for DNS propagation',
        'Click "Verify Domain" button',
      ],
    },
  };
}

/**
 * Auto-refresh domain verification status
 */
export async function refreshDomainStatus(domainId: string): Promise<DomainVerificationResult> {
  const result = await verifyCustomDomain(domainId);
  
  // Update last checked timestamp
  await prisma.customDomain.update({
    where: { id: domainId },
    data: { lastChecked: new Date() },
  });
  
  return result;
}

/**
 * Check if user can add more domains (based on plan)
 */
export async function canAddDomain(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { customDomains: true },
  });

  if (!user) {
    return { allowed: false, reason: 'User not found', current: 0, limit: 0 };
  }

  // Domain limits by plan
  const limits: Record<string, number> = {
    free: 0,
    pro: 0,
    business: 3,
    enterprise: 10,
  };

  const limit = limits[user.plan] || 0;
  const current = user.customDomains.length;

  if (current >= limit) {
    return {
      allowed: false,
      reason: `Your ${user.plan} plan allows up to ${limit} custom domain(s). Please upgrade.`,
      current,
      limit,
    };
  }

  return { allowed: true, current, limit };
}

/**
 * Get recommended CNAME target based on environment
 */
export function getCNAMETarget(): string {
  // In production, this would be your actual domain
  return process.env.NEXT_PUBLIC_CNAME_TARGET || 'qrstudio.app';
}
