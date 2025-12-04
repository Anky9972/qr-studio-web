// IP Geolocation Service
// Supports multiple providers with fallback

export interface GeolocationResult {
  country: string;
  countryCode: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
}

interface IPApiResponse {
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  regionName?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  status?: string;
  message?: string;
}

/**
 * Get geolocation data from IP address
 * Uses ip-api.com (free, 45 req/min limit)
 * Falls back to ipapi.co if needed
 */
export async function getGeolocation(ipAddress: string): Promise<GeolocationResult> {
  // Return default for localhost/private IPs
  if (!ipAddress || isPrivateIP(ipAddress)) {
    return {
      country: 'Unknown',
      countryCode: 'XX',
      city: 'Unknown',
    };
  }

  try {
    // Try ip-api.com first (free, no key required)
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp`, {
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!response.ok) {
      throw new Error(`ip-api.com returned ${response.status}`);
    }

    const data: IPApiResponse = await response.json();

    if (data.status === 'fail') {
      console.warn(`Geolocation failed: ${data.message}`);
      return getDefaultGeolocation();
    }

    return {
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'XX',
      city: data.city || 'Unknown',
      region: data.regionName || data.region,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    
    // Try fallback provider (ipapi.co)
    try {
      return await getGeolocationFallback(ipAddress);
    } catch (fallbackError) {
      console.error('Fallback geolocation error:', fallbackError);
      return getDefaultGeolocation();
    }
  }
}

/**
 * Fallback geolocation provider (ipapi.co)
 * Free tier: 1000 requests/day
 */
async function getGeolocationFallback(ipAddress: string): Promise<GeolocationResult> {
  const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    throw new Error(`ipapi.co returned ${response.status}`);
  }

  const data = await response.json();

  return {
    country: data.country_name || 'Unknown',
    countryCode: data.country_code || 'XX',
    city: data.city || 'Unknown',
    region: data.region,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    isp: data.org,
  };
}

/**
 * Check if IP is private/localhost
 */
function isPrivateIP(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return true;
  }

  // Check private IP ranges
  const parts = ip.split('.');
  if (parts.length !== 4) return false;

  const first = parseInt(parts[0]);
  const second = parseInt(parts[1]);

  // 10.0.0.0 - 10.255.255.255
  if (first === 10) return true;

  // 172.16.0.0 - 172.31.255.255
  if (first === 172 && second >= 16 && second <= 31) return true;

  // 192.168.0.0 - 192.168.255.255
  if (first === 192 && second === 168) return true;

  return false;
}

/**
 * Get default/unknown geolocation
 */
function getDefaultGeolocation(): GeolocationResult {
  return {
    country: 'Unknown',
    countryCode: 'XX',
    city: 'Unknown',
  };
}

/**
 * Batch geolocation lookup (for analytics)
 * Groups IPs and makes efficient requests
 */
export async function batchGeolocation(ipAddresses: string[]): Promise<Map<string, GeolocationResult>> {
  const results = new Map<string, GeolocationResult>();
  const uniqueIPs = [...new Set(ipAddresses)].filter(ip => ip && !isPrivateIP(ip));

  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < uniqueIPs.length; i += batchSize) {
    const batch = uniqueIPs.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (ip) => {
        try {
          const result = await getGeolocation(ip);
          results.set(ip, result);
        } catch (error) {
          console.error(`Failed to geolocate ${ip}:`, error);
          results.set(ip, getDefaultGeolocation());
        }
      })
    );

    // Rate limiting delay (ip-api.com: 45 req/min)
    if (i + batchSize < uniqueIPs.length) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return results;
}

/**
 * Cache geolocation results (optional, for high-traffic sites)
 * Store in Redis with TTL
 */
export async function getCachedGeolocation(
  ipAddress: string,
  cacheGetter?: (key: string) => Promise<string | null>,
  cacheSetter?: (key: string, value: string, ttl: number) => Promise<void>
): Promise<GeolocationResult> {
  if (!cacheGetter || !cacheSetter) {
    return getGeolocation(ipAddress);
  }

  const cacheKey = `geo:${ipAddress}`;
  
  try {
    const cached = await cacheGetter(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }

  const result = await getGeolocation(ipAddress);

  try {
    // Cache for 24 hours
    await cacheSetter(cacheKey, JSON.stringify(result), 86400);
  } catch (error) {
    console.error('Cache write error:', error);
  }

  return result;
}
