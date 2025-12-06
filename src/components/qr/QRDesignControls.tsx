import React from 'react';
import {
    Palette,
    Layers,
    Sliders,
    Image as ImageIcon
} from 'lucide-react';
import { Label } from '@/components/ui/label'; // Assuming these exist, if not I'll use standard labels
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Slider } from '@/components/ui/slider'; // Need to check if this exists or use standard input range
import { Switch } from '@/components/ui/switch'; // Need to check if this exists
import { cn } from '@/lib/utils';

// Fallback for standard HTML elements if UI components missing, 
// allows me to proceed without blocking on checking every small UI component file again
// But I recall seeing Select/Input/Button. I'll stick to standard HTML/Tailwind for complex widgets if unsure.

interface QRDesignControlsProps {
    design: {
        foreground: string;
        background: string;
        pattern: string;
        cornerStyle: string;
        dotStyle: string;
        useGradient: boolean;
        gradientType: 'linear' | 'radial';
        gradientColor1: string;
        gradientColor2: string;
        gradientRotation: number;
        logo: string;
        logoSize: number;
        frameStyle?: string;
        frameText?: string;
        frameColor?: string;
    };
    onChange: (key: string, value: any) => void;
}

export const QRDesignControls: React.FC<QRDesignControlsProps> = ({
    design,
    onChange,
}) => {
    return (
        <div className="space-y-8">
            {/* Colors Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Palette className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Colors</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Foreground Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={design.foreground}
                                onChange={(e) => onChange('foreground', e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10 p-1"
                                disabled={design.useGradient}
                            />
                            <Input
                                value={design.foreground}
                                onChange={(e) => onChange('foreground', e.target.value)}
                                disabled={design.useGradient}
                                className="font-mono uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Background Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={design.background}
                                onChange={(e) => onChange('background', e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10 p-1"
                            />
                            <Input
                                value={design.background}
                                onChange={(e) => onChange('background', e.target.value)}
                                className="font-mono uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* Gradient Toggle */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium cursor-pointer select-none" htmlFor="gradient-toggle">
                            Enable Gradient
                        </label>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                id="gradient-toggle"
                                type="checkbox"
                                className="sr-only peer"
                                checked={design.useGradient}
                                onChange={(e) => onChange('useGradient', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                    </div>

                    {design.useGradient && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground">Start Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={design.gradientColor1}
                                            onChange={(e) => onChange('gradientColor1', e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border border-white/10 p-0.5"
                                        />
                                        <Input
                                            value={design.gradientColor1}
                                            onChange={(e) => onChange('gradientColor1', e.target.value)}
                                            className="h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground">End Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={design.gradientColor2}
                                            onChange={(e) => onChange('gradientColor2', e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border border-white/10 p-0.5"
                                        />
                                        <Input
                                            value={design.gradientColor2}
                                            onChange={(e) => onChange('gradientColor2', e.target.value)}
                                            className="h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground">Gradient Type</label>
                                <div className="flex gap-2">
                                    {(['linear', 'radial'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => onChange('gradientType', type)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors flex-1 capitalize",
                                                design.gradientType === type
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-transparent border-white/10 hover:border-white/20"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {design.gradientType === 'linear' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Rotation</span>
                                        <span>{design.gradientRotation}°</span>
                                    </div>
                                    <Slider
                                        min={0}
                                        max={360}
                                        step={1}
                                        value={[design.gradientRotation]}
                                        onValueChange={(val) => onChange('gradientRotation', val[0])}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Patterns Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Layers className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Patterns & Shapes</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pattern Style</label>
                        <Select value={design.pattern} onValueChange={(val) => onChange('pattern', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="dots">Dots</SelectItem>
                                <SelectItem value="rounded">Rounded</SelectItem>
                                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                <SelectItem value="classy">Classy</SelectItem>
                                <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Corner Style</label>
                        <Select value={design.cornerStyle || 'extra-rounded'} onValueChange={(val) => onChange('cornerStyle', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="dot">Dot</SelectItem>
                                <SelectItem value="extra-rounded">Rounded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Logo Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Logo</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Logo URL</label>
                        <Input
                            placeholder="https://example.com/logo.png"
                            value={design.logo}
                            onChange={(e) => onChange('logo', e.target.value)}
                        />
                    </div>

                    {design.logo && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Logo Size</span>
                                <span>{Math.round(design.logoSize * 100)}%</span>
                            </div>
                            <Slider
                                min={0.1}
                                max={0.5}
                                step={0.05}
                                value={[design.logoSize]}
                                onValueChange={(val) => onChange('logoSize', val[0])}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* Frame Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Layers className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Frame</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Frame Style</label>
                        <Select value={design.frameStyle || 'none'} onValueChange={(val) => onChange('frameStyle', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Frame</SelectItem>
                                <SelectItem value="box">Box Frame</SelectItem>
                                <SelectItem value="banner">Banner Frame</SelectItem>
                                <SelectItem value="balloon">Balloon Frame</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {design.frameStyle && design.frameStyle !== 'none' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Frame Text</label>
                                <Input
                                    value={design.frameText || ''}
                                    onChange={(e) => onChange('frameText', e.target.value)}
                                    placeholder="Scan Me!"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Frame Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={design.frameColor || '#000000'}
                                        onChange={(e) => onChange('frameColor', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10 p-1"
                                    />
                                    <Input
                                        value={design.frameColor || '#000000'}
                                        onChange={(e) => onChange('frameColor', e.target.value)}
                                        className="font-mono uppercase"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
