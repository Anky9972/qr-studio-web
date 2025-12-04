import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QRCodeDesign {
  size: number
  foreground: string
  background: string
  logo?: string
  errorLevel: 'L' | 'M' | 'Q' | 'H'
  pattern: 'square' | 'dots' | 'rounded'
  eyePattern?: 'square' | 'rounded' | 'circle'
  eyeColor?: string
  gradientType?: 'linear' | 'radial'
  gradientColors?: string[]
  cornerRadius?: number
  margin?: number
  frameStyle?: string
  frameText?: string
}

export interface QRCode {
  id: string
  name?: string
  type: 'static' | 'dynamic'
  content: string
  qrType: string
  design: QRCodeDesign
  shortUrl?: string
  destination?: string
  createdAt: Date
  scanCount: number
  favorite: boolean
  tags: string[]
}

interface QRCodeStore {
  qrCodes: QRCode[]
  currentQRCode: QRCode | null
  isGenerating: boolean
  
  // Actions
  setQRCodes: (qrCodes: QRCode[]) => void
  addQRCode: (qrCode: QRCode) => void
  updateQRCode: (id: string, updates: Partial<QRCode>) => void
  deleteQRCode: (id: string) => void
  setCurrentQRCode: (qrCode: QRCode | null) => void
  toggleFavorite: (id: string) => void
  setIsGenerating: (isGenerating: boolean) => void
}

export const useQRCodeStore = create<QRCodeStore>()(
  persist(
    (set) => ({
      qrCodes: [],
      currentQRCode: null,
      isGenerating: false,

      setQRCodes: (qrCodes) => set({ qrCodes }),
      
      addQRCode: (qrCode) =>
        set((state) => ({ qrCodes: [qrCode, ...state.qrCodes] })),
      
      updateQRCode: (id, updates) =>
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, ...updates } : qr
          ),
        })),
      
      deleteQRCode: (id) =>
        set((state) => ({
          qrCodes: state.qrCodes.filter((qr) => qr.id !== id),
        })),
      
      setCurrentQRCode: (qrCode) => set({ currentQRCode: qrCode }),
      
      toggleFavorite: (id) =>
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, favorite: !qr.favorite } : qr
          ),
        })),
      
      setIsGenerating: (isGenerating) => set({ isGenerating }),
    }),
    {
      name: 'qr-code-storage',
      partialize: (state) => ({ qrCodes: state.qrCodes }),
    }
  )
)
