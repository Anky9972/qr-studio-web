import { ImageResponse } from 'next/og'

export const alt = 'QR Code Use Cases by Industry - QR Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 50%, #0f172a 100%)',
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
        <div style={{ fontSize: 60, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, marginBottom: 24 }}>
          QR Codes Across Industries
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 900 }}>
          {['Restaurant', 'Retail', 'Events', 'Healthcare', 'Education', 'Real Estate', 'Manufacturing', 'Marketing'].map((ind) => (
            <div
              key={ind}
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 18,
              }}
            >
              {ind}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
