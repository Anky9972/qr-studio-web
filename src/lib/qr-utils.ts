import QRCode from 'qrcode'

export interface QROptions {
  text: string
  size?: number
  foreground?: string
  background?: string
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  margin?: number
}

export async function generateQRCode(options: QROptions): Promise<string> {
  const {
    text,
    size = 512,
    foreground = '#000000',
    background = '#FFFFFF',
    errorCorrectionLevel = 'M',
    margin = 2,
  } = options

  try {
    const dataURL = await QRCode.toDataURL(text, {
      width: size,
      margin,
      color: {
        dark: foreground,
        light: background,
      },
      errorCorrectionLevel,
    })
    
    return dataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function downloadQRCode(dataURL: string, filename: string = 'qrcode.png') {
  const link = document.createElement('a')
  link.href = dataURL
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export const QR_TYPES = {
  url: 'URL',
  text: 'Plain Text',
  email: 'Email',
  phone: 'Phone',
  sms: 'SMS',
  wifi: 'WiFi',
  vcard: 'vCard',
  location: 'Location',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  bitcoin: 'Bitcoin',
  event: 'Calendar Event',
  instagram: 'Instagram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
} as const

export type QRType = keyof typeof QR_TYPES
