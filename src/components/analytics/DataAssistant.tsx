import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAIStore } from '@/store/ai-store';
import { clientAI } from '@/lib/ai/client-ai';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface DataAssistantProps {
    data: any; // Context data to feed to AI
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function DataAssistant({ data }: DataAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I can analyze your QR code performance. Ask me anything like "Which day had the most scans?" or "How can I improve my scan rate?"' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const apiKey = useAIStore.getState().getApiKey();
            if (!apiKey) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Please configure your AI API Key in Settings to enable this feature.' }]);
                setLoading(false);
                return;
            }

            // Compact data context to save tokens
            const contextStr = JSON.stringify(data).substring(0, 10000); // Limit context size

            const systemPrompt = `You are a Data Analyst for QR Studio. 
      Analyze the provided JSON data about QR code scans and performance.
      Answer the user's question concisely and provide actionable insights if possible.
      
      Current Data Context:
      ${contextStr}`;

            const { text, error } = await clientAI.generateText(userMsg, {
                systemPrompt,
                temperature: 0.5
            });

            if (error) throw new Error(error);

            setMessages(prev => [...prev, { role: 'assistant', content: text || 'I could not generate an answer.' }]);
        } catch (e: any) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + e.message }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="origin-bottom-right"
                    >
                        <Card variant="glass" className="w-[350px] md:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20 bg-black/80 backdrop-blur-xl">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-primary/10">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <Bot size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Data Assistant</h3>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Sparkles size={8} className="text-emerald-400" /> AI Powered
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setIsOpen(false)}>
                                    <X size={16} />
                                </Button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                                            msg.role === 'user'
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-white/10 text-white/90 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/10 rounded-2xl px-4 py-3 rounded-tl-none flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Analyzing data...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t border-white/10 bg-black/20">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about your metrics..."
                                        className="flex-1 bg-white/5 border-white/10 focus:border-primary/50"
                                    />
                                    <Button type="submit" size="icon" variant="glow" disabled={!input.trim() || loading} className="h-10 w-10">
                                        <Send size={16} />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                variant="glow"
                size="lg"
                className={cn(
                    "rounded-full shadow-lg h-14 w-14 p-0 transition-all duration-300",
                    isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
                )}
                onClick={() => setIsOpen(true)}
            >
                <MessageSquare className="w-6 h-6" />
            </Button>
        </div>
    );
}
