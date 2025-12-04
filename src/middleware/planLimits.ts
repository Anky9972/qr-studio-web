import { prisma } from '@/lib/prisma';
import { getPlanLimits, PlanType } from '@/lib/plan-limits';

export interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  percentage: number;
  message?: string;
}

/**
 * Check if user can create a new QR code
 */
export async function checkQRCodeLimit(userId: string, userPlan?: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = userPlan || user?.plan || 'FREE';
  const limits = getPlanLimits(plan);
  
  const count = await prisma.qRCode.count({ where: { userId } });
  const percentage = (count / limits.qrCodes) * 100;
  
  return {
    allowed: count < limits.qrCodes,
    current: count,
    limit: limits.qrCodes,
    percentage,
    message: count >= limits.qrCodes
      ? `You've reached your limit of ${limits.qrCodes} QR codes. Please upgrade your plan.`
      : undefined,
  };
}

/**
 * Check if user can create a dynamic QR code
 */
export async function checkDynamicQRCodeLimit(userId: string, userPlan?: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = userPlan || user?.plan || 'FREE';
  const limits = getPlanLimits(plan);
  
  const count = await prisma.qRCode.count({
    where: { userId, type: 'dynamic' },
  });
  const percentage = (count / limits.dynamicQrCodes) * 100;
  
  return {
    allowed: count < limits.dynamicQrCodes,
    current: count,
    limit: limits.dynamicQrCodes,
    percentage,
    message: count >= limits.dynamicQrCodes
      ? `You've reached your limit of ${limits.dynamicQrCodes} dynamic QR codes. Please upgrade your plan.`
      : undefined,
  };
}

/**
 * Check if user can perform bulk generation
 */
export async function checkBulkGenerationLimit(
  userId: string,
  batchSize: number,
  userPlan?: string
): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = userPlan || user?.plan || 'FREE';
  const limits = getPlanLimits(plan);
  
  const allowed = batchSize <= limits.bulkGeneration;
  const percentage = (batchSize / limits.bulkGeneration) * 100;
  
  return {
    allowed,
    current: batchSize,
    limit: limits.bulkGeneration,
    percentage,
    message: !allowed
      ? `Batch size of ${batchSize} exceeds your limit of ${limits.bulkGeneration}. Please upgrade your plan.`
      : undefined,
  };
}

/**
 * Check if user can add team members
 */
export async function checkTeamMemberLimit(userId: string, userPlan?: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = userPlan || user?.plan || 'FREE';
  const limits = getPlanLimits(plan);
  
  const count = await prisma.teamMember.count({ where: { userId } });
  const percentage = (count / limits.teamMembers) * 100;
  
  return {
    allowed: count < limits.teamMembers,
    current: count,
    limit: limits.teamMembers,
    percentage,
    message: count >= limits.teamMembers
      ? `You've reached your limit of ${limits.teamMembers} team members. Please upgrade your plan.`
      : undefined,
  };
}

/**
 * Check if user can create API keys
 */
export async function checkApiKeyLimit(userId: string, userPlan?: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = userPlan || user?.plan || 'FREE';
  const limits = getPlanLimits(plan);
  
  // Free plan cannot create API keys
  if (limits.apiCalls === 0) {
    return {
      allowed: false,
      current: 0,
      limit: 0,
      percentage: 0,
      message: 'API access is not available on your current plan. Please upgrade to PRO or higher.',
    };
  }
  
  const count = await prisma.apiKey.count({ where: { userId } });
  const maxKeys = plan === 'BUSINESS' ? 5 : plan === 'ENTERPRISE' ? 999999 : 3;
  const percentage = (count / maxKeys) * 100;
  
  return {
    allowed: count < maxKeys,
    current: count,
    limit: maxKeys,
    percentage,
    message: count >= maxKeys
      ? `You've reached your limit of ${maxKeys} API keys.`
      : undefined,
  };
}

/**
 * Get warning threshold for limits (80%, 90%, 95%)
 */
export function shouldShowLimitWarning(percentage: number): {
  show: boolean;
  severity: 'warning' | 'error';
  level: 80 | 90 | 95 | 100;
} {
  if (percentage >= 100) {
    return { show: true, severity: 'error', level: 100 };
  } else if (percentage >= 95) {
    return { show: true, severity: 'error', level: 95 };
  } else if (percentage >= 90) {
    return { show: true, severity: 'warning', level: 90 };
  } else if (percentage >= 80) {
    return { show: true, severity: 'warning', level: 80 };
  }
  return { show: false, severity: 'warning', level: 80 };
}

/**
 * Get all limits for a user
 */
export async function getUserLimitsStatus(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = user?.plan || 'FREE';
  const limits = getPlanLimits(plan);
  
  const [qrCodeCheck, dynamicQrCheck, teamMemberCheck, apiKeyCheck] = await Promise.all([
    checkQRCodeLimit(userId, plan),
    checkDynamicQRCodeLimit(userId, plan),
    checkTeamMemberLimit(userId, plan),
    checkApiKeyLimit(userId, plan),
  ]);
  
  return {
    plan,
    limits,
    qrCodes: qrCodeCheck,
    dynamicQrCodes: dynamicQrCheck,
    teamMembers: teamMemberCheck,
    apiKeys: apiKeyCheck,
  };
}
