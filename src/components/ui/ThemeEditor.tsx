
'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { Check, Upload, Palette, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { themePresets, fontOptions } from '@/lib/theme-presets';
import { backgroundPatterns, stockImages } from '@/lib/theme-assets';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ThemeEditorProps {
    theme: ThemeConfig;
    onChange: (theme: ThemeConfig) => void;
}

export default function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'restaurant' | 'corporate' | 'creative' | 'beauty'>('all');
    const [assetTab, setAssetTab] = useState<'upload' | 'gallery'>('gallery');

    const filteredPresets = themePresets.filter(p => selectedCategory === 'all' || p.category === selectedCategory);


    const handlePresetSelect = (presetId: string) => {
        const preset = themePresets.find(p => p.id === presetId);
        if (preset) {
            onChange(preset.config);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({
                    ...theme,
                    backgroundType: 'image',
                    backgroundImage: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette size={18} className="text-primary" /> Theme Customization
            </h3>

            <Tabs defaultValue="presets" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4 bg-white/5">
                    <TabsTrigger value="presets">Presets</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>

                <TabsContent value="presets" className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(['all', 'general', 'restaurant', 'corporate', 'creative', 'beauty'] as const).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium border border-white/10 transition-colors capitalize",
                                    selectedCategory === cat ? "bg-primary text-white border-primary" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {filteredPresets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset.id)}
                                className="group relative flex flex-col items-center gap-2 p-3 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all text-left"
                            >
                                <div
                                    className="w-full h-24 rounded-md shadow-inner mb-1"
                                    style={{ background: preset.thumbnail }}
                                />
                                <span className="text-sm font-medium w-full truncate text-center">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-6">
                    {/* Background Section */}
                    <div className="space-y-3">
                        <Label>Background Style</Label>
                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                            <button
                                onClick={() => onChange({ ...theme, backgroundType: 'solid' })}
                                className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", theme.backgroundType === 'solid' ? "bg-primary text-white" : "hover:bg-white/5 text-muted-foreground")}
                            >
                                Solid
                            </button>
                            <button
                                onClick={() => onChange({ ...theme, backgroundType: 'gradient' })}
                                className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", theme.backgroundType === 'gradient' ? "bg-primary text-white" : "hover:bg-white/5 text-muted-foreground")}
                            >
                                Gradient
                            </button>
                            <button
                                onClick={() => onChange({ ...theme, backgroundType: 'image' })}
                                className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", theme.backgroundType === 'image' ? "bg-primary text-white" : "hover:bg-white/5 text-muted-foreground")}
                            >
                                Image
                            </button>
                            <button
                                onClick={() => onChange({ ...theme, backgroundType: 'pattern' })}
                                className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", theme.backgroundType === 'pattern' ? "bg-primary text-white" : "hover:bg-white/5 text-muted-foreground")}
                            >
                                Pattern
                            </button>
                        </div>

                        {theme.backgroundType === 'solid' && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded border border-white/20 overflow-hidden relative">
                                    <input
                                        type="color"
                                        value={theme.backgroundColor}
                                        onChange={(e) => onChange({ ...theme, backgroundColor: e.target.value })}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                    />
                                </div>
                                <Input value={theme.backgroundColor} onChange={(e) => onChange({ ...theme, backgroundColor: e.target.value })} className="font-mono flex-1" />
                            </div>
                        )}

                        {theme.backgroundType === 'gradient' && (
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">CSS Gradient Value</Label>
                                <Input
                                    value={theme.backgroundGradient}
                                    onChange={(e) => onChange({ ...theme, backgroundGradient: e.target.value })}
                                    placeholder="linear-gradient(...)"
                                />
                            </div>
                        )}

                        {theme.backgroundType === 'image' && (
                            <div className="space-y-3">
                                <div className="flex gap-2 bg-white/5 p-1 rounded-lg w-fit">
                                    <button onClick={() => setAssetTab('gallery')} className={cn("px-3 py-1 text-xs rounded-md", assetTab === 'gallery' ? "bg-white/10 text-white" : "text-muted-foreground")}>Gallery</button>
                                    <button onClick={() => setAssetTab('upload')} className={cn("px-3 py-1 text-xs rounded-md", assetTab === 'upload' ? "bg-white/10 text-white" : "text-muted-foreground")}>Upload</button>
                                </div>

                                {assetTab === 'gallery' ? (
                                    <div className="grid grid-cols-3 gap-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {Object.entries(stockImages).map(([cat, images]) => (
                                            images.map((img, idx) => (
                                                <button
                                                    key={`${cat}-${idx}`}
                                                    onClick={() => onChange({ ...theme, backgroundImage: img })}
                                                    className="relative aspect-square rounded-md overflow-hidden border border-white/10 hover:border-primary/50 transition-all group"
                                                >
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    {theme.backgroundImage === img && <div className="absolute inset-0 bg-primary/20 ring-2 ring-primary inset-ring" />}
                                                </button>
                                            ))
                                        ))}
                                    </div>
                                ) : (
                                    <Label htmlFor="bg-image-upload" className="cursor-pointer block">
                                        <div className="border border-dashed border-white/20 rounded-lg p-4 hover:bg-white/5 transition-colors text-center">
                                            {theme.backgroundImage && !Object.values(stockImages).flat().includes(theme.backgroundImage) ? (
                                                <div className="relative h-20 w-full rounded overflow-hidden">
                                                    <img src={theme.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-xs text-white">Change Image</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <ImageIcon size={20} />
                                                    <span className="text-xs">Upload Background Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <input id="bg-image-upload" type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    </Label>
                                )}
                            </div>
                        )}

                        {theme.backgroundType === 'pattern' && (
                            <div className="grid grid-cols-3 gap-2">
                                {backgroundPatterns.map((pat) => (
                                    <button
                                        key={pat.id}
                                        onClick={() => onChange({ ...theme, backgroundImage: pat.value })}
                                        className={cn(
                                            "aspect-square rounded-md border border-white/10 hover:border-primary/50 transition-all flex items-center justify-center p-2 bg-white/5",
                                            theme.backgroundImage === pat.value && "ring-2 ring-primary border-primary bg-primary/10"
                                        )}
                                    >
                                        <div className="w-full h-full rounded opacity-70" style={{ background: pat.value, backgroundSize: pat.size }}></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Button / Primary</Label>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-white/20 overflow-hidden relative shrink-0">
                                    <input
                                        type="color"
                                        value={theme.primaryColor}
                                        onChange={(e) => onChange({ ...theme, primaryColor: e.target.value })}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                    />
                                </div>
                                <Input value={theme.primaryColor} onChange={(e) => onChange({ ...theme, primaryColor: e.target.value })} className="font-mono text-xs h-8" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Text Color</Label>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-white/20 overflow-hidden relative shrink-0">
                                    <input
                                        type="color"
                                        value={theme.textColor}
                                        onChange={(e) => onChange({ ...theme, textColor: e.target.value })}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                    />
                                </div>
                                <Input value={theme.textColor} onChange={(e) => onChange({ ...theme, textColor: e.target.value })} className="font-mono text-xs h-8" />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Typography & Shapes */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select value={theme.fontFamily} onValueChange={(val) => onChange({ ...theme, fontFamily: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select font" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontOptions.map((font) => (
                                        <SelectItem key={font.value} value={font.value}>
                                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Button Style</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['rounded', 'pill', 'square', 'soft'] as const).map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => onChange({ ...theme, buttonStyle: style })}
                                        className={cn(
                                            "h-8 border border-white/10 text-xs transition-all flex items-center justify-center hover:bg-white/5",
                                            theme.buttonStyle === style ? "bg-primary text-white border-primary" : "text-muted-foreground",
                                            style === 'rounded' && "rounded-md",
                                            style === 'pill' && "rounded-full",
                                            style === 'square' && "rounded-none",
                                            style === 'soft' && "rounded-xl"
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Card Style</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['glass', 'solid', 'outline', 'none'] as const).map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => onChange({ ...theme, cardStyle: style })}
                                        className={cn(
                                            "h-8 border border-white/10 text-xs transition-all flex items-center justify-center hover:bg-white/5 rounded-md",
                                            theme.cardStyle === style ? "bg-primary text-white border-primary" : "text-muted-foreground",
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                </TabsContent>
            </Tabs>
        </div>
    );
}
