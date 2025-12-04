// Smart Routing Engine - Conditional QR Code Redirects
import {
  RoutingRule,
  RoutingCondition,
  RedirectContext,
  RoutingResult,
  DeviceCondition,
  TimeCondition,
  LanguageCondition,
  ScanLimitCondition,
  GeoCondition,
  UserAgentCondition,
} from '@/types/routing';

/**
 * Main routing engine - evaluates rules and returns destination
 */
export async function evaluateRoutingRules(
  rules: RoutingRule[],
  context: RedirectContext,
  defaultDestination: string
): Promise<RoutingResult> {
  // Sort by priority (higher first)
  const sortedRules = rules
    .filter(rule => rule.active)
    .sort((a, b) => b.priority - a.priority);

  // Evaluate each rule
  for (const rule of sortedRules) {
    const matches = await evaluateCondition(rule.condition, context);
    if (matches) {
      return {
        destination: rule.destination,
        matched: true,
        rule,
        reason: `Matched ${rule.type} rule`,
      };
    }
  }

  // No rules matched, return default
  return {
    destination: defaultDestination,
    matched: false,
    reason: 'No rules matched, using default destination',
  };
}

/**
 * Evaluate a single routing condition
 */
async function evaluateCondition(
  condition: RoutingCondition,
  context: RedirectContext
): Promise<boolean> {
  switch (condition.type) {
    case 'device':
      return evaluateDeviceCondition(condition, context);
    case 'time':
      return evaluateTimeCondition(condition, context);
    case 'language':
      return evaluateLanguageCondition(condition, context);
    case 'scanLimit':
      return evaluateScanLimitCondition(condition, context);
    case 'geo':
      return await evaluateGeoCondition(condition, context);
    case 'userAgent':
      return evaluateUserAgentCondition(condition, context);
    default:
      return false;
  }
}

/**
 * Device Detection (iOS, Android, etc.)
 */
function evaluateDeviceCondition(
  condition: DeviceCondition,
  context: RedirectContext
): boolean {
  const ua = context.userAgent.toLowerCase();
  const detectedOS = detectOS(ua);
  
  return condition.devices.includes(detectedOS);
}

function detectOS(userAgent: string): 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'other' {
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
  if (/android/i.test(userAgent)) return 'android';
  if (/windows/i.test(userAgent)) return 'windows';
  if (/macintosh|mac os x/i.test(userAgent)) return 'mac';
  if (/linux/i.test(userAgent)) return 'linux';
  return 'other';
}

/**
 * Time-based Routing (hours, days of week)
 */
function evaluateTimeCondition(
  condition: TimeCondition,
  context: RedirectContext
): boolean {
  const now = new Date(context.timestamp);
  const timezone = condition.timezone || 'UTC';
  
  // Convert to target timezone
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const dayOfWeek = localTime.getDay();
  const currentTime = `${localTime.getHours().toString().padStart(2, '0')}:${localTime.getMinutes().toString().padStart(2, '0')}`;

  // Check each schedule
  for (const schedule of condition.schedule) {
    // Check day of week
    if (schedule.days && !schedule.days.includes(dayOfWeek)) {
      continue;
    }

    // Check time range
    if (currentTime >= schedule.startTime && currentTime <= schedule.endTime) {
      return true;
    }
  }

  return false;
}

/**
 * Language Detection
 */
function evaluateLanguageCondition(
  condition: LanguageCondition,
  context: RedirectContext
): boolean {
  // Parse Accept-Language header
  const languages = parseAcceptLanguage(context.acceptLanguage);
  
  // Check if any preferred language matches
  for (const lang of languages) {
    if (condition.languages.includes(lang)) {
      return true;
    }
  }

  return false;
}

function parseAcceptLanguage(header: string): string[] {
  if (!header) return [];
  
  return header
    .split(',')
    .map(lang => {
      const [code] = lang.trim().split(';');
      return code.split('-')[0].toLowerCase(); // Get primary language code
    });
}

/**
 * Scan Limit Check
 */
function evaluateScanLimitCondition(
  condition: ScanLimitCondition,
  context: RedirectContext
): boolean {
  return context.scanCount >= condition.maxScans;
}

/**
 * Geographic Location (requires IP geolocation)
 */
async function evaluateGeoCondition(
  condition: GeoCondition,
  context: RedirectContext
): Promise<boolean> {
  // Get location from IP address
  const location = await getLocationFromIP(context.ipAddress);
  
  if (!location) return false;

  // Check countries
  if (condition.countries) {
    const matches = condition.countries.includes(location.country);
    return condition.exclude ? !matches : matches;
  }

  // Check cities
  if (condition.cities && location.city) {
    const matches = condition.cities.some(
      city => city.toLowerCase() === location.city?.toLowerCase()
    );
    return condition.exclude ? !matches : matches;
  }

  return false;
}

/**
 * User Agent Pattern Matching
 */
function evaluateUserAgentCondition(
  condition: UserAgentCondition,
  context: RedirectContext
): boolean {
  for (const pattern of condition.patterns) {
    try {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(context.userAgent)) {
        return true;
      }
    } catch (error) {
      console.error(`Invalid regex pattern: ${pattern}`, error);
    }
  }
  return false;
}

/**
 * IP Geolocation (placeholder - integrate with service)
 */
async function getLocationFromIP(ipAddress: string): Promise<{
  country: string;
  city?: string;
} | null> {
  // TODO: Integrate with IP geolocation service
  // Options: ipapi.co, ip-api.com, ipstack.com, ipinfo.io
  
  try {
    // Example using free ip-api.com
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,city`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.countryCode,
        city: data.city,
      };
    }
  } catch (error) {
    console.error('IP geolocation failed:', error);
  }
  
  return null;
}

/**
 * Helper: Check if QR code should redirect based on scan limit
 */
export function shouldBlockByScanLimit(
  scanCount: number,
  maxScans?: number
): boolean {
  if (!maxScans) return false;
  return scanCount >= maxScans;
}

/**
 * Helper: Get app store URL based on device
 */
export function getAppStoreURL(
  iosUrl: string,
  androidUrl: string,
  userAgent: string
): string {
  const os = detectOS(userAgent.toLowerCase());
  
  if (os === 'ios') return iosUrl;
  if (os === 'android') return androidUrl;
  
  // Default to iOS for unknown devices
  return iosUrl;
}

/**
 * Helper: Create routing rule for app store redirect
 */
export function createAppStoreRule(
  qrCodeId: string,
  iosUrl: string,
  androidUrl: string,
  priority: number = 100
): RoutingRule[] {
  return [
    {
      id: `${qrCodeId}-ios`,
      qrCodeId,
      type: 'device',
      condition: {
        type: 'device',
        devices: ['ios'],
      },
      destination: iosUrl,
      priority,
      active: true,
    },
    {
      id: `${qrCodeId}-android`,
      qrCodeId,
      type: 'device',
      condition: {
        type: 'device',
        devices: ['android'],
      },
      destination: androidUrl,
      priority,
      active: true,
    },
  ];
}
