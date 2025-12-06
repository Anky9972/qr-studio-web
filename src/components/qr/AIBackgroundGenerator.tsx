import { useState } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { clientAI } from '@/lib/ai/client-ai';
import { useAIStore } from '@/store/ai-store';
import { Alert, AlertDescription } from '@/components/ui/Alert';

interface AIBackgroundGeneratorProps {
    onImageSelected: (imageUrl: string) => void;
}

export function AIBackgroundGenerator({ onImageSelected }: AIBackgroundGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        const apiKey = useAIStore.getState().getApiKey('openai');
        if (!apiKey) {
            setError('OpenAI API Key is required for image art.');
            return;
        }

        setIsGenerating(true);
        setError('');
        setGeneratedImage(null);

        try {
            // Enhance prompt for QR suitability if needed, or leave raw
            const enhancedPrompt = `A high contrast, artistic background suitable for a QR code. ${prompt}. Ensure the center area has space or the pattern is subtle enough for a QR code overlay.`;

            const { imageUrl, error: aiError } = await clientAI.generateImage(enhancedPrompt);

            if (aiError) throw new Error(aiError);
            if (!imageUrl) throw new Error("No image returned");

            setGeneratedImage(imageUrl);
            onImageSelected(imageUrl); // Automatically select it? Or let user confirm? Let's auto-select for now or just wait.
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card variant="glass" className="p-6 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">AI Background Art</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Prompt</Label>
                    <div className="flex gap-2">
                        <Input
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Cyberpunk city neon lights, minimalist marble texture..."
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button onClick={handleGenerate} disabled={isGenerating || !prompt} variant="glow">
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Powered by DALL-E 3. Costs ~0.04$ per image.</p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {generatedImage && (
                    <div className="space-y-3 animation-in fade-in zoom-in duration-500">
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                            <img src={generatedImage} alt="Generated Art" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="secondary" size="sm" onClick={() => onImageSelected(generatedImage)}>
                                    Use as Background
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => window.open(generatedImage, '_blank')}>
                                    <Download size={14} />
                                </Button>
                            </div>
                        </div>
                        <div className="text-center">
                            <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={isGenerating} className="text-xs">
                                <RefreshCw size={12} className="mr-2" /> Generate Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
