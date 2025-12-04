'use client';

import { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Reject Non-Essential"
      enableDeclineButton
      cookieName="qrstudio-cookie-consent"
      style={{
        background: '#1a1a1a',
        padding: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
      buttonStyle={{
        background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '10px 24px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer'
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '10px 24px',
        fontWeight: 600,
        border: '1px solid rgba(255,255,255,0.3)',
        cursor: 'pointer'
      }}
      expires={365}
      onAccept={() => {
        // Enable all analytics
        if (typeof window !== 'undefined') {
          localStorage.setItem('analytics-consent', 'true');
          localStorage.setItem('marketing-consent', 'true');
        }
      }}
      onDecline={() => {
        // Disable non-essential cookies
        if (typeof window !== 'undefined') {
          localStorage.setItem('analytics-consent', 'false');
          localStorage.setItem('marketing-consent', 'false');
        }
      }}
    >
      <div style={{ maxWidth: '800px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
          🍪 We use cookies
        </p>
        <p style={{ margin: '0', fontSize: '14px', opacity: 0.9, lineHeight: '1.5' }}>
          We use cookies and similar technologies to enhance your experience, analyze traffic,
          and personalize content. By clicking "Accept All", you consent to our use of cookies.{' '}
          <Link
            href="/legal/cookies"
            style={{ color: '#06b6d4', textDecoration: 'underline' }}
          >
            Learn more
          </Link>
          {' '}or{' '}
          <Link
            href="/legal/gdpr"
            style={{ color: '#06b6d4', textDecoration: 'underline' }}
          >
            manage preferences
          </Link>
          .
        </p>
      </div>
    </CookieConsent>
  );
}
