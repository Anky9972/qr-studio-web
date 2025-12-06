import { useState } from 'react';
import { useAIStore, AIProvider } from '@/store/ai-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Key, Loader2, Bot } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { clientAI } from '@/lib/ai/client-ai';

interface AISettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AISettingsModal({ open, onOpenChange }: AISettingsModalProps) {
    const { apiKeys, setApiKey, activeProvider, setActiveProvider, selectedModel, setSelectedModel } = useAIStore();
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSave = (provider: AIProvider, key: string) => {
        setApiKey(provider, key);
        setTestResult(null); // Clear previous test results on change
    };

    const testConnection = async (provider: AIProvider) => {
        setTesting(true);
        setTestResult(null);
        const key = apiKeys[provider];

        if (!key) {
            setTestResult({ success: false, message: 'Please enter an API Key first.' });
            setTesting(false);
            return;
        }

        const success = await clientAI.generateKeyCheck(provider, key);

        if (success) {
            setTestResult({ success: true, message: 'Connection successful! Key is valid.' });
        } else {
            setTestResult({ success: false, message: 'Connection failed. Please check your key and try again.' });
        }
        setTesting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] w-full">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        AI Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Configure your AI providers to enable generative features. Your keys are stored locally in your browser.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue={activeProvider} onValueChange={(v) => setActiveProvider(v as AIProvider)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
                        <TabsTrigger value="openai">OpenAI</TabsTrigger>
                        <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
                    </TabsList>

                    {/* Gemini Tab */}
                    <TabsContent value="gemini" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Gemini API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={apiKeys.gemini}
                                    onChange={(e) => handleSave('gemini', e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="flex-1"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
                            </p>
                        </div>
                    </TabsContent>

                    {/* OpenAI Tab */}
                    <TabsContent value="openai" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>OpenAI API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={apiKeys.openai}
                                    onChange={(e) => handleSave('openai', e.target.value)}
                                    placeholder="sk-..."
                                    className="flex-1"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">OpenAI Platform</a>.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Model</Label>
                            <select
                                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                value={selectedModel || 'gpt-3.5-turbo'}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            >
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-4o">GPT-4o</option>
                            </select>
                        </div>
                    </TabsContent>

                    {/* Anthropic Tab */}
                    <TabsContent value="anthropic" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Anthropic API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={apiKeys.anthropic}
                                    onChange={(e) => handleSave('anthropic', e.target.value)}
                                    placeholder="sk-ant-..."
                                    className="flex-1"
                                />
                            </div>
                            <Alert variant="default" className="mt-2 text-yellow-500 border-yellow-500/20 bg-yellow-500/10">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    Claude API calls from the browser may be blocked by CORS unless you use a proxy or specific settings.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </TabsContent>

                    {/* Test Connection Section */}
                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium">Connection Status</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => testConnection(activeProvider)}
                                disabled={testing || !apiKeys[activeProvider]}
                            >
                                {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                                Test Key
                            </Button>
                        </div>

                        {testResult && (
                            <Alert variant={testResult.success ? "default" : "destructive"} className={testResult.success ? "border-green-500/20 bg-green-500/10 text-green-500" : ""}>
                                {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
                                <AlertDescription>
                                    {testResult.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button onClick={() => onOpenChange(false)}>Save & Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
