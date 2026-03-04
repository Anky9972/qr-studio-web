import { ImageResponse } from 'next/og'

export const alt = 'QR Studio Pricing - Free, Pro & Business Plans'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.7, marginBottom: 24, letterSpacing: 4, textTransform: 'uppercase' }}>QR Studio</div>
        <div style={{ fontSize: 64, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, marginBottom: 24 }}>
          Simple, Transparent Pricing
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 16 }}>
          {['Free', 'Pro $19/mo', 'Business $49/mo', 'Enterprise'].map((plan) => (
            <div
              key={plan}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '16px 24px',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {plan}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
