// CTA Frame Templates - SVG frames with call-to-action text
import { CTAFrame } from '@/types/routing';

export const CTA_FRAMES: CTAFrame[] = [
  {
    id: 'scan-me-1',
    name: 'Scan Me - Classic',
    category: 'scan',
    preview: '/frames/scan-me-1.png',
    variables: {
      text: { type: 'text', default: 'SCAN ME', label: 'Frame Text' },
      textColor: { type: 'color', default: '#000000', label: 'Text Color' },
      bgColor: { type: 'color', default: '#FFFFFF', label: 'Background Color' },
    },
    premium: false,
    svgContent: `
<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="380" fill="{{bgColor}}" rx="10"/>
  <rect x="30" y="30" width="240" height="240" fill="#f5f5f5" rx="10"/>
  
  <!-- QR Code Placeholder -->
  <rect x="30" y="30" width="240" height="240" fill="white" stroke="#ddd" stroke-width="2" rx="10"/>
  
  <!-- Corner Indicators -->
  <path d="M 40 40 L 60 40 L 60 45 L 45 45 L 45 60 L 40 60 Z" fill="{{textColor}}"/>
  <path d="M 260 40 L 240 40 L 240 45 L 255 45 L 255 60 L 260 60 Z" fill="{{textColor}}"/>
  <path d="M 40 260 L 40 240 L 45 240 L 45 255 L 60 255 L 60 260 Z" fill="{{textColor}}"/>
  <path d="M 260 260 L 260 240 L 255 240 L 255 255 L 240 255 L 240 260 Z" fill="{{textColor}}"/>
  
  <!-- Text -->
  <text x="150" y="310" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        text-anchor="middle" fill="{{textColor}}">{{text}}</text>
  <text x="150" y="340" font-family="Arial, sans-serif" font-size="16" 
        text-anchor="middle" fill="{{textColor}}" opacity="0.7">Point your camera here</text>
</svg>
    `,
  },
  {
    id: 'wifi-connect',
    name: 'WiFi Connect',
    category: 'wifi',
    preview: '/frames/wifi-connect.png',
    variables: {
      networkName: { type: 'text', default: 'Free WiFi', label: 'Network Name' },
      textColor: { type: 'color', default: '#4CAF50', label: 'Accent Color' },
    },
    premium: false,
    svgContent: `
<svg viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="360" fill="#ffffff" rx="15"/>
  <rect x="30" y="50" width="240" height="240" fill="#f5f5f5" rx="10"/>
  
  <!-- WiFi Icon -->
  <path d="M150 20 Q160 20 165 25 L170 30 Q175 35 175 45 Q175 55 165 60 Q160 63 150 63 Q140 63 135 60 Q125 55 125 45 Q125 35 130 30 L135 25 Q140 20 150 20" 
        fill="{{textColor}}" opacity="0.9"/>
  
  <!-- QR Code Placeholder -->
  <rect x="30" y="50" width="240" height="240" fill="white" stroke="{{textColor}}" stroke-width="3" rx="10"/>
  
  <!-- Text -->
  <text x="150" y="320" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="{{textColor}}">Connect to {{networkName}}</text>
  <text x="150" y="345" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="#666">Scan to connect automatically</text>
</svg>
    `,
  },
  {
    id: 'menu-qr',
    name: 'Digital Menu',
    category: 'menu',
    preview: '/frames/menu-qr.png',
    variables: {
      text: { type: 'text', default: 'VIEW MENU', label: 'Call to Action' },
      accentColor: { type: 'color', default: '#FF5722', label: 'Accent Color' },
    },
    premium: false,
    svgContent: `
<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="380" fill="#ffffff" rx="12"/>
  <rect x="20" y="20" width="260" height="340" fill="#fafafa" stroke="{{accentColor}}" stroke-width="3" rx="10"/>
  
  <!-- Fork & Knife Icon -->
  <path d="M 80 30 L 80 60 M 90 30 L 90 60 M 85 60 L 85 90" 
        stroke="{{accentColor}}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 220 30 L 220 90 M 210 30 Q 210 45 220 45" 
        stroke="{{accentColor}}" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- QR Code Placeholder -->
  <rect x="50" y="110" width="200" height="200" fill="white" stroke="#ddd" stroke-width="2" rx="8"/>
  
  <!-- Text -->
  <text x="150" y="340" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
        text-anchor="middle" fill="{{accentColor}}">{{text}}</text>
  <text x="150" y="365" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="#666">Scan for our digital menu</text>
</svg>
    `,
  },
  {
    id: 'social-follow',
    name: 'Follow Us',
    category: 'social',
    preview: '/frames/social-follow.png',
    variables: {
      platform: { type: 'text', default: 'Instagram', label: 'Platform Name' },
      handle: { type: 'text', default: '@yourhandle', label: 'Social Handle' },
      color: { type: 'color', default: '#E4405F', label: 'Brand Color' },
    },
    premium: true,
    svgContent: `
<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="socialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{{color}};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{{color}};stop-opacity:0.7" />
    </linearGradient>
  </defs>
  
  <rect width="300" height="380" fill="url(#socialGradient)" rx="15"/>
  <rect x="25" y="25" width="250" height="330" fill="#ffffff" rx="12"/>
  
  <!-- QR Code Placeholder -->
  <rect x="50" y="80" width="200" height="200" fill="#f9f9f9" stroke="#ddd" stroke-width="2" rx="10"/>
  
  <!-- Text -->
  <text x="150" y="60" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="{{color}}">Follow us on {{platform}}</text>
  <text x="150" y="310" font-family="Arial, sans-serif" font-size="20" font-weight="600" 
        text-anchor="middle" fill="#333">{{handle}}</text>
  <text x="150" y="335" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="#666">Scan to connect</text>
</svg>
    `,
  },
  {
    id: 'download-app',
    name: 'Download App',
    category: 'custom',
    preview: '/frames/download-app.png',
    variables: {
      appName: { type: 'text', default: 'Our App', label: 'App Name' },
      tagline: { type: 'text', default: 'Download Now', label: 'Tagline' },
      primaryColor: { type: 'color', default: '#2196F3', label: 'Primary Color' },
    },
    premium: true,
    svgContent: `
<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="400" fill="#ffffff" rx="15"/>
  
  <!-- Phone Icon -->
  <rect x="120" y="20" width="60" height="90" fill="none" stroke="{{primaryColor}}" stroke-width="3" rx="8"/>
  <rect x="125" y="27" width="50" height="70" fill="{{primaryColor}}" opacity="0.1" rx="4"/>
  <circle cx="150" cy="103" r="3" fill="{{primaryColor}}"/>
  
  <!-- QR Code Placeholder -->
  <rect x="40" y="130" width="220" height="220" fill="#f5f5f5" stroke="{{primaryColor}}" stroke-width="3" rx="10"/>
  
  <!-- Text -->
  <text x="150" y="375" font-family="Arial, sans-serif" font-size="26" font-weight="bold" 
        text-anchor="middle" fill="{{primaryColor}}">{{tagline}}</text>
  <text x="150" y="395" font-family="Arial, sans-serif" font-size="16" 
        text-anchor="middle" fill="#666">{{appName}}</text>
</svg>
    `,
  },
];

/**
 * Get frame by ID
 */
export function getFrameById(id: string): CTAFrame | undefined {
  return CTA_FRAMES.find(frame => frame.id === id);
}

/**
 * Get frames by category
 */
export function getFramesByCategory(category: string): CTAFrame[] {
  return CTA_FRAMES.filter(frame => frame.category === category);
}

/**
 * Apply variables to frame SVG
 */
export function applyFrameVariables(
  frame: CTAFrame,
  variables: Record<string, string>
): string {
  let svg = frame.svgContent;
  
  // Replace all variables in the format {{varName}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    svg = svg.replace(regex, value);
  });
  
  // Replace any remaining variables with defaults
  Object.entries(frame.variables).forEach(([key, config]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    svg = svg.replace(regex, config.default);
  });
  
  return svg;
}

/**
 * Generate frame preview
 */
export function generateFramePreview(
  frame: CTAFrame,
  qrCodeDataUrl: string,
  variables?: Record<string, string>
): string {
  const appliedSvg = variables ? applyFrameVariables(frame, variables) : frame.svgContent;
  
  // Note: In production, this would composite the QR code into the frame
  // For now, return the frame SVG
  return `data:image/svg+xml;base64,${btoa(appliedSvg)}`;
}

/**
 * Get all frame categories
 */
export function getFrameCategories(): Array<{ value: string; label: string; count: number }> {
  const categories = new Map<string, number>();
  
  CTA_FRAMES.forEach(frame => {
    categories.set(frame.category, (categories.get(frame.category) || 0) + 1);
  });
  
  const categoryLabels: Record<string, string> = {
    scan: 'Scan Me',
    wifi: 'WiFi',
    menu: 'Menus',
    social: 'Social Media',
    custom: 'Custom',
  };
  
  return Array.from(categories.entries()).map(([value, count]) => ({
    value,
    label: categoryLabels[value] || value,
    count,
  }));
}
