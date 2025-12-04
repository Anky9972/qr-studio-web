export type PlanType = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface PlanLimits {
  qrCodes: number;
  dynamicQrCodes: number;
  bulkGeneration: number;
  teamMembers: number;
  apiCalls: number;
  scansPerMonth: number | 'unlimited';
  features: {
    advancedAnalytics: boolean;
    customDomain: boolean;
    whiteLabel: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    teamCollaboration: boolean;
    templates: boolean;
    campaigns: boolean;
  };
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  FREE: {
    qrCodes: 50,
    dynamicQrCodes: 0,
    bulkGeneration: 0,
    teamMembers: 1,
    apiCalls: 0,
    scansPerMonth: 'unlimited',
    features: {
      advancedAnalytics: false,
      customDomain: false,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: false,
      teamCollaboration: false,
      templates: false,
      campaigns: false,
    },
  },
  PRO: {
    qrCodes: 100,
    dynamicQrCodes: 100,
    bulkGeneration: 1000,
    teamMembers: 1,
    apiCalls: 0,
    scansPerMonth: 'unlimited',
    features: {
      advancedAnalytics: true,
      customDomain: false,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: true,
      teamCollaboration: false,
      templates: true,
      campaigns: true,
    },
  },
  BUSINESS: {
    qrCodes: 1000,
    dynamicQrCodes: 1000,
    bulkGeneration: 10000,
    teamMembers: 10,
    apiCalls: 10000,
    scansPerMonth: 'unlimited',
    features: {
      advancedAnalytics: true,
      customDomain: true,
      whiteLabel: false,
      apiAccess: true,
      prioritySupport: true,
      teamCollaboration: true,
      templates: true,
      campaigns: true,
    },
  },
  ENTERPRISE: {
    qrCodes: 999999,
    dynamicQrCodes: 999999,
    bulkGeneration: 999999,
    teamMembers: 999999,
    apiCalls: 999999,
    scansPerMonth: 'unlimited',
    features: {
      advancedAnalytics: true,
      customDomain: true,
      whiteLabel: true,
      apiAccess: true,
      prioritySupport: true,
      teamCollaboration: true,
      templates: true,
      campaigns: true,
    },
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  const planType = (plan?.toUpperCase() || 'FREE') as PlanType;
  return PLAN_LIMITS[planType] || PLAN_LIMITS.FREE;
}

export function canCreateQRCode(
  currentCount: number,
  isDynamic: boolean,
  dynamicCount: number,
  plan: string
): { allowed: boolean; reason?: string } {
  const limits = getPlanLimits(plan);

  if (currentCount >= limits.qrCodes) {
    return {
      allowed: false,
      reason: `You've reached your plan limit of ${limits.qrCodes} QR codes. Upgrade to create more.`,
    };
  }

  if (isDynamic && dynamicCount >= limits.dynamicQrCodes) {
    return {
      allowed: false,
      reason: `You've reached your plan limit of ${limits.dynamicQrCodes} dynamic QR codes. Upgrade to PRO or higher.`,
    };
  }

  return { allowed: true };
}

export function canAccessFeature(feature: keyof PlanLimits['features'], plan: string): boolean {
  const limits = getPlanLimits(plan);
  return limits.features[feature];
}
