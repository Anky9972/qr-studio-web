import { useAIStore } from '@/store/ai-store';

export type AIServiceResponse = {
    text?: string;
    error?: string;
    images?: string[];
    imageUrl?: string;
};


export interface AICompletionOptions {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
}

class ClientAIService {
    private async callOpenAI(apiKey: string, prompt: string, options: AICompletionOptions): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: useAIStore.getState().selectedModel || 'gpt-3.5-turbo',
                messages: [
                    ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
                    { role: 'user', content: prompt }
                ],
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens,
                response_format: options.jsonMode ? { type: 'json_object' } : undefined
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API Error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    private async callGemini(apiKey: string, prompt: string, options: AICompletionOptions): Promise<string> {
        const model = useAIStore.getState().selectedModel || 'gemini-pro';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${options.systemPrompt ? options.systemPrompt + '\n\n' : ''}${prompt}`
                    }]
                }],
                generationConfig: {
                    temperature: options.temperature ?? 0.7,
                    maxOutputTokens: options.maxTokens,
                    responseMimeType: options.jsonMode ? 'application/json' : 'text/plain'
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API Error');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    private async callAnthropic(apiKey: string, prompt: string, options: AICompletionOptions): Promise<string> {
        // Anthropic requires a proxy or browser-safe setting usually, but for direct:
        // Note: Anthropic CORS might block direct browser calls. 
        // We will attempt direct, but might need to warn user to use a proxy if they encounter CORS.
        // However, for this implementation we assume standard fetch.

        // WARNING: Anthropic official API typically doesn't support CORS from browser for security.
        // We will implement it, but it might fail without a proxy.

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                // 'anthropic-dangerous-direct-browser-access': 'true' // This header is sometimes needed for client-side demo
            },
            body: JSON.stringify({
                model: useAIStore.getState().selectedModel || 'claude-3-opus-20240229',
                system: options.systemPrompt,
                messages: [
                    { role: 'user', content: prompt }
                ],
                max_tokens: options.maxTokens || 1024,
                temperature: options.temperature ?? 0.7,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Anthropic API Error');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    private async callOpenAIImage(apiKey: string, prompt: string): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI Image API Error');
        }

        const data = await response.json();
        return data.data[0].url;
    }

    async generateText(prompt: string, options: AICompletionOptions = {}): Promise<AIServiceResponse> {
        const store = useAIStore.getState();
        const provider = store.activeProvider;
        const apiKey = store.getApiKey(provider);

        if (!apiKey) {
            return { error: `No API key found for ${provider}. Please configure it in Settings.` };
        }

        try {
            let text = '';
            if (provider === 'openai') {
                text = await this.callOpenAI(apiKey, prompt, options);
            } else if (provider === 'gemini') {
                text = await this.callGemini(apiKey, prompt, options);
            } else if (provider === 'anthropic') {
                text = await this.callAnthropic(apiKey, prompt, options);
            }
            return { text };
        } catch (error: any) {
            console.error('AI Generation Error:', error);
            return { error: error.message || 'Failed to generate content' };
        }
    }

    async generateImage(prompt: string): Promise<AIServiceResponse> {
        const store = useAIStore.getState();
        const apiKey = store.getApiKey('openai');

        if (!apiKey) {
            return { error: 'Please configure OpenAI API Key for image generation.' };
        }

        try {
            const imageUrl = await this.callOpenAIImage(apiKey, prompt);
            return { imageUrl };
        } catch (error: any) {
            console.error('AI Image Generation Error:', error);
            return { error: error.message || 'Failed to generate image' };
        }
    }

    async generateKeyCheck(provider: any, key: string): Promise<boolean> {
        try {
            if (provider === 'openai') {
                await this.callOpenAI(key, 'test', { maxTokens: 5 });
            } else if (provider === 'gemini') {
                await this.callGemini(key, 'test', { maxTokens: 5 });
            } else if (provider === 'anthropic') {
                return true;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}

export const clientAI = new ClientAIService();
