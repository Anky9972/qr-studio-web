// Type definitions for Smart Routing, Pixels, and Advanced Features

export type RoutingRuleType = 'device' | 'time' | 'language' | 'scanLimit' | 'geo' | 'userAgent';

export interface DeviceCondition {
  type: 'device';
  devices: ('ios' | 'android' | 'windows' | 'mac' | 'linux' | 'other')[];
}

export interface TimeCondition {
  type: 'time';
  timezone?: string;
  schedule: {
    days?: number[]; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  }[];
}

export interface LanguageCondition {
  type: 'language';
  languages: string[]; // ISO 639-1 codes (e.g., 'en', 'es', 'fr')
  fallback?: string; // Fallback URL if no match
}

export interface ScanLimitCondition {
  type: 'scanLimit';
  maxScans: number;
  exceededUrl?: string; // URL to redirect after limit
}

export interface GeoCondition {
  type: 'geo';
  countries?: string[]; // ISO 3166-1 alpha-2 codes
  cities?: string[];
  exclude?: boolean; // If true, exclude these locations
}

export interface UserAgentCondition {
  type: 'userAgent';
  patterns: string[]; // Regex patterns to match
}

export type RoutingCondition =
  | DeviceCondition
  | TimeCondition
  | LanguageCondition
  | ScanLimitCondition
  | GeoCondition
  | UserAgentCondition;

export interface RoutingRule {
  id: string;
  qrCodeId: string;
  type: RoutingRuleType;
  condition: RoutingCondition;
  destination: string;
  priority: number;
  active: boolean;
}

// Pixel & Marketing Types
export type PixelProvider = 'facebook' | 'google' | 'linkedin' | 'tiktok' | 'twitter' | 'custom';

export interface PixelConfig {
  id: string;
  qrCodeId: string;
  provider: PixelProvider;
  pixelId: string;
  events: string[];
  delayRedirect: number;
  active: boolean;
  scriptContent?: string;
}

export interface UTMParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// Custom Domain Types
export interface CustomDomain {
  id: string;
  userId: string;
  domain: string;
  verified: boolean;
  sslEnabled: boolean;
  cnameTarget: string;
  verificationToken: string;
  verifiedAt?: Date;
  lastChecked?: Date;
}

// Microsite Types
export type MicrositeType = 'linkinbio' | 'menu' | 'portfolio' | 'event' | 'custom';

export interface MicrositeTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: number;
}

export interface MicrositeBlock {
  id: string;
  type: 'link' | 'text' | 'image' | 'video' | 'social' | 'contact' | 'menu-item';
  order: number;
  visible: boolean;
  content: any;
}

export interface Microsite {
  id: string;
  userId: string;
  slug: string;
  title: string;
  description?: string;
  type: MicrositeType;
  theme?: MicrositeTheme;
  content: MicrositeBlock[];
  seo?: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string[];
  };
  customCss?: string;
  published: boolean;
  viewCount: number;
}

// CTA Frame Types
export interface CTAFrame {
  id: string;
  name: string;
  category: 'social' | 'wifi' | 'menu' | 'scan' | 'custom';
  svgContent: string;
  preview?: string;
  variables: {
    [key: string]: {
      type: 'text' | 'color';
      default: string;
      label: string;
    };
  };
  premium: boolean;
}

// Redirect Context (passed to routing engine)
export interface RedirectContext {
  qrCodeId: string;
  userAgent: string;
  ipAddress: string;
  acceptLanguage: string;
  referer?: string;
  timestamp: Date;
  scanCount: number;
}

// Routing Result
export interface RoutingResult {
  destination: string;
  matched: boolean;
  rule?: RoutingRule;
  reason?: string;
}
