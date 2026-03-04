import { ImageResponse } from 'next/og'

export const alt = 'About QR Studio - Our Mission, Team & Story'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e1b4b 100%)',
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
          Our Mission & Story
        </div>
        <div style={{ fontSize: 28, opacity: 0.8, textAlign: 'center', maxWidth: 800 }}>
          Building the most powerful QR code platform for 10,000+ businesses worldwide
        </div>
      </div>
    ),
    { ...size }
  )
}
