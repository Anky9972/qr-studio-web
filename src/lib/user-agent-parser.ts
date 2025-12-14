/**
 * User Agent Parser
 * Extracts device, browser, and OS information from user agent strings
 */

export interface ParsedUserAgent {
  device: string;
  browser: string;
  os: string;
  browserVersion?: string;
  osVersion?: string;
}

/**
 * Parse user agent string to extract device, browser, and OS information
 */
export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const ua = userAgent.toLowerCase();

  // Detect Device Type
  let device = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent)) {
    device = 'Mobile';
  }

  // Detect Browser
  let browser = 'Other';
  let browserVersion = '';

  // Edge (must be checked before Chrome)
  if (ua.includes('edg/') || ua.includes('edge/')) {
    browser = 'Edge';
    const match = userAgent.match(/edg\/(\d+)/i) || userAgent.match(/edge\/(\d+)/i);
    browserVersion = match ? match[1] : '';
  }
  // Chrome (must be checked before Safari)
  else if (ua.includes('chrome/') && !ua.includes('edg')) {
    browser = 'Chrome';
    const match = userAgent.match(/chrome\/(\d+)/i);
    browserVersion = match ? match[1] : '';
  }
  // Safari
  else if (ua.includes('safari/') && !ua.includes('chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/version\/(\d+)/i);
    browserVersion = match ? match[1] : '';
  }
  // Firefox
  else if (ua.includes('firefox/')) {
    browser = 'Firefox';
    const match = userAgent.match(/firefox\/(\d+)/i);
    browserVersion = match ? match[1] : '';
  }
  // Opera
  else if (ua.includes('opr/') || ua.includes('opera/')) {
    browser = 'Opera';
    const match = userAgent.match(/(?:opr|opera)\/(\d+)/i);
    browserVersion = match ? match[1] : '';
  }
  // Samsung Browser
  else if (ua.includes('samsungbrowser/')) {
    browser = 'Samsung Browser';
    const match = userAgent.match(/samsungbrowser\/(\d+)/i);
    browserVersion = match ? match[1] : '';
  }
  // UC Browser
  else if (ua.includes('ucbrowser/')) {
    browser = 'UC Browser';
    const match = userAgent.match(/ucbrowser\/(\d+)/i);
    browserVersion = match ? match[1] : '';
  }
  // Internet Explorer
  else if (ua.includes('msie') || ua.includes('trident/')) {
    browser = 'Internet Explorer';
    const match = userAgent.match(/(?:msie |rv:)(\d+)/i);
    browserVersion = match ? match[1] : '';
  }

  // Detect Operating System
  let os = 'Other';
  let osVersion = '';

  if (ua.includes('windows')) {
    os = 'Windows';
    if (ua.includes('windows nt 10.0')) osVersion = '10/11';
    else if (ua.includes('windows nt 6.3')) osVersion = '8.1';
    else if (ua.includes('windows nt 6.2')) osVersion = '8';
    else if (ua.includes('windows nt 6.1')) osVersion = '7';
  } else if (ua.includes('mac os x')) {
    os = 'macOS';
    const match = userAgent.match(/mac os x (\d+[._]\d+)/i);
    if (match) {
      osVersion = match[1].replace('_', '.');
    }
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'iOS';
    const match = userAgent.match(/os (\d+[._]\d+)/i);
    if (match) {
      osVersion = match[1].replace('_', '.');
    }
  } else if (ua.includes('android')) {
    os = 'Android';
    const match = userAgent.match(/android (\d+\.?\d*)/i);
    osVersion = match ? match[1] : '';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('cros')) {
    os = 'Chrome OS';
  }

  return {
    device,
    browser,
    os,
    browserVersion,
    osVersion,
  };
}

/**
 * Get a human-readable device description
 */
export function getDeviceDescription(parsed: ParsedUserAgent): string {
  return `${parsed.device} - ${parsed.browser} on ${parsed.os}`;
}

/**
 * Check if user agent is likely a bot/crawler
 */
export function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http-client/i,
    /postman/i,
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}
