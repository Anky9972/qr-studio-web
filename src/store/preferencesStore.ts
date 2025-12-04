import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  
  // Scanning preferences
  autoCopy: boolean
  autoOpen: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  defaultScanMode: 'camera' | 'upload'
  
  // Generation preferences
  defaultSize: number
  defaultErrorLevel: 'L' | 'M' | 'Q' | 'H'
  defaultFormat: 'png' | 'svg' | 'pdf' | 'webp'
  
  // History preferences
  maxHistoryItems: number
  autoCleanup: boolean
  
  // Notifications
  notificationsEnabled: boolean
}

interface PreferencesStore {
  preferences: UserPreferences
  
  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => void
  resetPreferences: () => void
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  autoCopy: true,
  autoOpen: false,
  soundEnabled: true,
  vibrationEnabled: true,
  defaultScanMode: 'camera',
  defaultSize: 512,
  defaultErrorLevel: 'M',
  defaultFormat: 'png',
  maxHistoryItems: 100,
  autoCleanup: true,
  notificationsEnabled: true,
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),

      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'user-preferences-storage',
    }
  )
)
