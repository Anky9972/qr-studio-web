import { useState, useEffect } from 'react';

export interface LimitInfo {
  current: number;
  limit: number;
  percentage: number;
  message?: string;
  allowed: boolean;
}

export interface UserLimits {
  plan: string;
  limits: {
    qrCodes: number;
    dynamicQrCodes: number;
    bulkGeneration: number;
    teamMembers: number;
    apiCalls: number;
  };
  qrCodes: LimitInfo;
  dynamicQrCodes: LimitInfo;
  teamMembers: LimitInfo;
  apiKeys: LimitInfo;
}

export function useUserLimits() {
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLimits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/limits');
      
      if (!response.ok) {
        throw new Error('Failed to fetch limits');
      }
      
      const data = await response.json();
      setLimits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  return { limits, loading, error, refetch: fetchLimits };
}
