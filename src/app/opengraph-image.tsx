import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'QR Studio - Professional QR Code Generator'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            display: 'flex',
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* QR Code Icon */}
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: 'white',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="#667eea"
            >
              <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8 0h2V3h-2v2zm4 0h2v2h-2V5zm-4 4h2V7h-2v2zm0 2h2v2h-2v-2zm2-2h2v2h-2V9zm2 0h2V7h-2v2zm-2 6h2v-2h-2v2zm-2 2h2v2h-2v-2zm0-2h-2v2h2v-2zm-2-2h2v-2h-2v2zm-8 8h8v-8H3v8zm2-6h4v4H5v-4z"/>
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            QR Studio
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              opacity: 0.95,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Professional QR Code Generator & Manager
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 50,
              fontSize: 22,
              opacity: 0.9,
            }}
          >
            <span>✨ Custom Design</span>
            <span>📊 Analytics</span>
            <span>🔄 Dynamic</span>
            <span>🎨 Bulk Create</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
