import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIProvider = 'openai' | 'gemini' | 'anthropic';

interface AIState {
    apiKeys: {
        openai: string;
        gemini: string;
        anthropic: string;
    };
    activeProvider: AIProvider;
    selectedModel: string;

    // Actions
    setApiKey: (provider: AIProvider, key: string) => void;
    setActiveProvider: (provider: AIProvider) => void;
    setSelectedModel: (model: string) => void;
    getApiKey: (provider?: AIProvider) => string;
}

export const useAIStore = create<AIState>()(
    persist(
        (set, get) => ({
            apiKeys: {
                openai: '',
                gemini: '',
                anthropic: '',
            },
            activeProvider: 'gemini', // Default to Gemini as it often has a free tier for devs
            selectedModel: 'gemini-pro',

            setApiKey: (provider, key) =>
                set((state) => ({
                    apiKeys: { ...state.apiKeys, [provider]: key }
                })),

            setActiveProvider: (provider) =>
                set({ activeProvider: provider }),

            setSelectedModel: (model) =>
                set({ selectedModel: model }),

            getApiKey: (provider) => {
                const state = get();
                const p = provider || state.activeProvider;
                return state.apiKeys[p] || '';
            },
        }),
        {
            name: 'qr-studio-ai-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                apiKeys: state.apiKeys,
                activeProvider: state.activeProvider,
                selectedModel: state.selectedModel
            }),
        }
    )
);
