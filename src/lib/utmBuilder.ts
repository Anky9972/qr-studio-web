// UTM Parameter Builder for Marketing Analytics
import { UTMParameters } from '@/types/routing';

/**
 * Append UTM parameters to a URL
 */
export function appendUTMParameters(
  url: string,
  params: UTMParameters
): string {
  try {
    const urlObj = new URL(url);
    
    // Add UTM parameters
    if (params.source) urlObj.searchParams.set('utm_source', params.source);
    if (params.medium) urlObj.searchParams.set('utm_medium', params.medium);
    if (params.campaign) urlObj.searchParams.set('utm_campaign', params.campaign);
    if (params.term) urlObj.searchParams.set('utm_term', params.term);
    if (params.content) urlObj.searchParams.set('utm_content', params.content);
    
    return urlObj.toString();
  } catch (error) {
    console.error('Invalid URL for UTM parameters:', error);
    return url;
  }
}

/**
 * Parse UTM parameters from a URL
 */
export function parseUTMParameters(url: string): UTMParameters {
  try {
    const urlObj = new URL(url);
    return {
      source: urlObj.searchParams.get('utm_source') || undefined,
      medium: urlObj.searchParams.get('utm_medium') || undefined,
      campaign: urlObj.searchParams.get('utm_campaign') || undefined,
      term: urlObj.searchParams.get('utm_term') || undefined,
      content: urlObj.searchParams.get('utm_content') || undefined,
    };
  } catch (error) {
    return {};
  }
}

/**
 * Validate UTM parameters
 */
export function validateUTMParameters(params: UTMParameters): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // At minimum, source and medium should be provided
  if (!params.source) {
    errors.push('utm_source is required for effective tracking');
  }

  if (!params.medium) {
    errors.push('utm_medium is required for effective tracking');
  }

  // Validate format (no spaces, lowercase recommended)
  Object.entries(params).forEach(([key, value]) => {
    if (value && /\s/.test(value)) {
      errors.push(`${key} should not contain spaces (use underscores or hyphens)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * UTM parameter presets for common campaigns
 */
export const UTM_PRESETS = {
  // Social Media
  facebook: {
    source: 'facebook',
    medium: 'social',
  },
  instagram: {
    source: 'instagram',
    medium: 'social',
  },
  twitter: {
    source: 'twitter',
    medium: 'social',
  },
  linkedin: {
    source: 'linkedin',
    medium: 'social',
  },
  tiktok: {
    source: 'tiktok',
    medium: 'social',
  },
  
  // Email
  newsletter: {
    source: 'newsletter',
    medium: 'email',
  },
  email_signature: {
    source: 'email',
    medium: 'signature',
  },
  
  // Print & Physical
  print_flyer: {
    source: 'print',
    medium: 'flyer',
  },
  print_poster: {
    source: 'print',
    medium: 'poster',
  },
  business_card: {
    source: 'print',
    medium: 'business_card',
  },
  packaging: {
    source: 'packaging',
    medium: 'product',
  },
  
  // Events
  conference: {
    source: 'event',
    medium: 'conference',
  },
  trade_show: {
    source: 'event',
    medium: 'trade_show',
  },
  webinar: {
    source: 'webinar',
    medium: 'online_event',
  },
  
  // Advertising
  google_ads: {
    source: 'google',
    medium: 'cpc',
  },
  facebook_ads: {
    source: 'facebook',
    medium: 'cpc',
  },
  display_ads: {
    source: 'display',
    medium: 'banner',
  },
  
  // Direct
  qr_code: {
    source: 'qr_code',
    medium: 'scan',
  },
  sms: {
    source: 'sms',
    medium: 'text',
  },
} as const;

/**
 * Get UTM preset by key
 */
export function getUTMPreset(presetKey: keyof typeof UTM_PRESETS): UTMParameters {
  return { ...UTM_PRESETS[presetKey] };
}

/**
 * Generate campaign-specific UTM parameters
 */
export function generateCampaignUTM(
  campaignName: string,
  source: string,
  medium: string,
  options?: {
    addTimestamp?: boolean;
    qrCodeId?: string;
  }
): UTMParameters {
  const params: UTMParameters = {
    source,
    medium,
    campaign: campaignName.toLowerCase().replace(/\s+/g, '_'),
  };

  // Add QR code ID as content
  if (options?.qrCodeId) {
    params.content = `qr_${options.qrCodeId}`;
  }

  // Add timestamp for A/B testing
  if (options?.addTimestamp) {
    params.term = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }

  return params;
}

/**
 * Build UTM URL from base URL and parameters
 */
export function buildUTMUrl(baseUrl: string, params: UTMParameters): string {
  return appendUTMParameters(baseUrl, params);
}

/**
 * Clean UTM parameter value (remove spaces, lowercase)
 */
export function cleanUTMValue(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');
}

/**
 * Get UTM tracking URL for Google Analytics
 */
export function getGoogleAnalyticsTrackingUrl(
  params: UTMParameters,
  websiteUrl: string = 'https://example.com'
): string {
  const baseUrl = 'https://ga-dev-tools.google/campaign-url-builder/';
  const query = new URLSearchParams({
    website: websiteUrl,
    ...(params.source && { source: params.source }),
    ...(params.medium && { medium: params.medium }),
    ...(params.campaign && { campaign: params.campaign }),
    ...(params.term && { term: params.term }),
    ...(params.content && { content: params.content }),
  });
  
  return `${baseUrl}?${query.toString()}`;
}

/**
 * Extract campaign info from UTM parameters
 */
export function extractCampaignInfo(params: UTMParameters): {
  name: string;
  channel: string;
  type: string;
} {
  return {
    name: params.campaign || 'unknown',
    channel: params.source || 'unknown',
    type: params.medium || 'unknown',
  };
}

/**
 * Compare two UTM parameter sets
 */
export function compareUTMParameters(
  params1: UTMParameters,
  params2: UTMParameters
): boolean {
  return (
    params1.source === params2.source &&
    params1.medium === params2.medium &&
    params1.campaign === params2.campaign &&
    params1.term === params2.term &&
    params1.content === params2.content
  );
}

/**
 * Merge UTM parameters (second set overrides first)
 */
export function mergeUTMParameters(
  base: UTMParameters,
  override: UTMParameters
): UTMParameters {
  return {
    source: override.source || base.source,
    medium: override.medium || base.medium,
    campaign: override.campaign || base.campaign,
    term: override.term || base.term,
    content: override.content || base.content,
  };
}
