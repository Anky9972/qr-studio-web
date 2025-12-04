import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ScanResult {
  id: string
  content: string
  type: string
  format: string
  barcodeType?: string // Barcode format (EAN_13, CODE_128, etc.)
  timestamp: Date
  source: 'camera' | 'upload' | 'page'
  parsed?: {
    type: 'url' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'text'
    data: any
  }
}

interface ScanHistoryStore {
  scans: ScanResult[]
  favorites: string[]
  
  // Actions
  addScan: (scan: ScanResult) => void
  removeScan: (id: string) => void
  clearHistory: () => void
  toggleFavorite: (id: string) => void
  getRecentScans: (limit?: number) => ScanResult[]
}

export const useScanHistoryStore = create<ScanHistoryStore>()(
  persist(
    (set, get) => ({
      scans: [],
      favorites: [],

      addScan: (scan) =>
        set((state) => {
          // Check for duplicates
          const exists = state.scans.some(
            (s) => s.content === scan.content && 
                   Date.now() - new Date(s.timestamp).getTime() < 60000 // Within 1 minute
          )
          if (exists) return state
          
          // Keep only last 100 scans
          const newScans = [scan, ...state.scans].slice(0, 100)
          return { scans: newScans }
        }),

      removeScan: (id) =>
        set((state) => ({
          scans: state.scans.filter((s) => s.id !== id),
          favorites: state.favorites.filter((fid) => fid !== id),
        })),

      clearHistory: () => set({ scans: [], favorites: [] }),

      toggleFavorite: (id) =>
        set((state) => {
          const isFavorite = state.favorites.includes(id)
          return {
            favorites: isFavorite
              ? state.favorites.filter((fid) => fid !== id)
              : [...state.favorites, id],
          }
        }),

      getRecentScans: (limit = 5) => {
        const { scans } = get()
        return scans.slice(0, limit)
      },
    }),
    {
      name: 'scan-history-storage',
    }
  )
)
