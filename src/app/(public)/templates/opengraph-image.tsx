import { ImageResponse } from 'next/og'

export const alt = 'Free QR Code Templates - QR Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #6d28d9 100%)',
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
        <div style={{ fontSize: 64, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, marginBottom: 16 }}>
          Free QR Code Templates
        </div>
        <div style={{ fontSize: 28, opacity: 0.8, textAlign: 'center' }}>
          Business Cards · Menus · WiFi · Events · Social Media
        </div>
        <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 32px', fontSize: 22 }}>
          50+ Templates — All Free
        </div>
      </div>
    ),
    { ...size }
  )
}
