'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Hand,
  TrendingUp,
  QrCode,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface WelcomeBackBannerProps {
  userName?: string;
}

interface LoginInfo {
  lastLoginAt: string | null;
  newScans: number;
  newQRCodes: number;
  daysSinceLastLogin: number;
}

export default function WelcomeBackBanner({ userName }: WelcomeBackBannerProps) {
  const [open, setOpen] = useState(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginInfo();
  }, []);

  const fetchLoginInfo = async () => {
    try {
      const response = await fetch('/api/user/login-info');
      if (response.ok) {
        const data = await response.json();
        setLoginInfo(data);

        // Show banner if user has been away for more than 1 day or has new activity
        if (data.daysSinceLastLogin > 0 || data.newScans > 0 || data.newQRCodes > 0) {
          setOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch login info:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastLogin = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return 'your first time here';

    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading || !loginInfo || !open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-electric-blue to-electric-cyan p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Hand className="w-5 h-5 animate-wave" />
                  <h3 className="text-lg font-bold">Welcome back, {userName || 'there'}!</h3>
                </div>
                <p className="text-sm text-white/90 mb-3">
                  {loginInfo.lastLoginAt
                    ? `Your last visit was ${formatLastLogin(loginInfo.lastLoginAt)}.`
                    : "This is your first time here! Let's get started."}
                </p>

                {(loginInfo.newScans > 0 || loginInfo.newQRCodes > 0 || loginInfo.daysSinceLastLogin >= 7) && (
                  <div className="flex flex-wrap gap-2">
                    {loginInfo.newScans > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                        <Eye className="w-3.5 h-3.5" />
                        {loginInfo.newScans} new scan{loginInfo.newScans !== 1 ? 's' : ''}
                      </span>
                    )}
                    {loginInfo.newQRCodes > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                        <QrCode className="w-3.5 h-3.5" />
                        {loginInfo.newQRCodes} new QR{loginInfo.newQRCodes !== 1 ? 's' : ''}
                      </span>
                    )}
                    {loginInfo.daysSinceLastLogin >= 7 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Long time no see!
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
