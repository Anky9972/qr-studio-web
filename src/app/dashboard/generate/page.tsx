'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import QRCodeStyling from 'qr-code-styling';
import {
  Download,
  Share2,
  Save,
  ChevronRight,
  Wand2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { QRContentForm } from '@/components/qr/QRContentForm';
import { QRDesignControls } from '@/components/qr/QRDesignControls';
import TemplateGallerySelector from '@/components/TemplateGallerySelector';
import AnimatedQRCode from '@/components/AnimatedQRCode';
import { useQRCodeStore } from '@/store/qrCodeStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { QRTemplate } from '@/lib/qr-templates';

export default function GeneratePage() {
  const { data: session } = useSession();
  const { addQRCode } = useQRCodeStore();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  // Steps: 0: Type, 1: Content, 2: Design
  const [step, setStep] = useState(0);

  // State
  const [qrType, setQrType] = useState('url');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Design State
  const [design, setDesign] = useState({
    foreground: '#000000',
    background: '#FFFFFF',
    pattern: 'square',
    cornerStyle: 'square',
    dotStyle: 'square',
    useGradient: false,
    gradientType: 'linear' as 'linear' | 'radial',
    gradientColor1: '#000000',
    gradientColor2: '#1976d2',
    gradientRotation: 0,
    logo: '',
    logoSize: 0.3,
    frameStyle: 'none',
    frameText: 'Scan Me',
    frameColor: '#000000',
  });

  // Animation State
  const [animation, setAnimation] = useState({
    enabled: false,
    type: 'pulse' as 'pulse' | 'gradient-wave' | 'rainbow' | 'glow',
    speed: 1.5
  });

  // Expiration State
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');

  const handleDesignChange = (key: string, value: any) => {
    setDesign(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (template: QRTemplate) => {
    // Apply template logic here
    if (template.dotsOptions?.color) handleDesignChange('foreground', template.dotsOptions.color);
    if (template.background) handleDesignChange('background', template.background);
    if (template.dotsOptions?.type) handleDesignChange('pattern', template.dotsOptions.type);
    if (template.dotsOptions?.gradient) {
      handleDesignChange('useGradient', true);
      handleDesignChange('gradientType', template.dotsOptions.gradient.type);
      if (template.dotsOptions.gradient.colorStops) {
        handleDesignChange('gradientColor1', template.dotsOptions.gradient.colorStops[0].color);
        handleDesignChange('gradientColor2', template.dotsOptions.gradient.colorStops[1].color);
      }
    } else {
      handleDesignChange('useGradient', false);
    }

    if (template.animated) {
      setAnimation({ enabled: true, type: 'pulse', speed: 1.5 }); // Logic to map template animation
    } else {
      setAnimation(prev => ({ ...prev, enabled: false }));
    }
  };

  // Sync QR Code instance
  useEffect(() => {
    if (!qrCodeRef.current) return;

    const options = {
      width: 300,
      height: 300,
      data: content || 'https://qrstudio.app',
      image: design.logo,
      dotsOptions: {
        color: design.useGradient ? undefined : design.foreground,
        type: design.pattern as any,
        gradient: design.useGradient ? {
          type: design.gradientType,
          rotation: design.gradientRotation * (Math.PI / 180),
          colorStops: [
            { offset: 0, color: design.gradientColor1 },
            { offset: 1, color: design.gradientColor2 }
          ]
        } : undefined
      },
      backgroundOptions: { color: design.background },
      cornersSquareOptions: { type: design.cornerStyle as any },
      imageOptions: { imageSize: design.logoSize, hideBackgroundDots: true }
    };

    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling(options);
      qrCodeInstance.current.append(qrCodeRef.current);
    } else {
      qrCodeInstance.current.update(options);
    }
  }, [content, design]);

  const handleSave = async () => {
    if (!content) return setError('Content is required');
    setSaving(true);
    try {
      const response = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || `QR Code - ${new Date().toLocaleDateString()}`,
          type: 'static', // Logic for dynamic if needed
          content,
          qrType,
          foreground: design.foreground,
          background: design.background,
          // ... map other design props
        })
      });
      if (response.ok) {
        const data = await response.json();
        addQRCode(data);
        setSaveSuccess(true);
      }
    } catch (e) {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Generate QR Code
          </h1>
          <p className="text-muted-foreground mt-1">Create stunning, custom QR codes in seconds.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </Button>
          <Button
            variant="glow"
            onClick={() => setStep(Math.min(2, step + 1))}
            disabled={step === 2 || (step === 1 && !content)}
            className={cn(step === 2 && "hidden")}
          >
            Next Step <ChevronRight size={16} className="ml-2" />
          </Button>
          {step === 2 && (
            <Button variant="glow" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save size={16} className="mr-2" />}
              Save QR Code
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls (Width 8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Steps Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {['Choose Type', 'Enter Content', 'Customize Design'].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors",
                  step >= i ? "bg-primary border-primary text-white" : "bg-transparent border-white/20 text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                <span className={cn(
                  "ml-2 text-sm font-medium",
                  step >= i ? "text-foreground" : "text-muted-foreground"
                )}>{s}</span>
                {i < 2 && <div className="w-12 h-[1px] bg-white/10 mx-4" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-xl font-semibold mb-4">What kind of QR code do you want?</h2>
                <QRTypeSelector selectedType={qrType} onSelect={(t) => { setQrType(t); setStep(1); }} />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold">Enter Content</h2>
                <QRContentForm
                  type={qrType}
                  onChange={setContent}
                  initialValue={content}
                />

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Expiration Settings</h3>
                      <p className="text-xs text-muted-foreground">Set an expiration date for this QR code</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Switch
                        checked={expirationEnabled}
                        onCheckedChange={setExpirationEnabled}
                      />
                    </div>
                  </div>

                  {expirationEnabled && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className="text-sm font-medium mb-1 block">Expiration Date</label>
                      <input
                        type="datetime-local"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Templates Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-amber-400" size={20} />
                    <h2 className="text-xl font-semibold">Templates</h2>
                  </div>
                  <TemplateGallerySelector onSelectTemplate={handleTemplateSelect} />
                </div>

                {/* Manual Customization */}
                <div className="border-t border-white/10 pt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Wand2 className="text-primary" size={20} />
                    <h2 className="text-xl font-semibold">Custom Design</h2>
                  </div>
                  <QRDesignControls design={design} onChange={handleDesignChange} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Preview (Width 4/12) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <Card variant="glass" className="p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
              <div className="absolute top-4 right-4 animate-pulse">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Live Preview</span>
              </div>

              {animation.enabled ? (
                <AnimatedQRCode
                  value={content || 'https://qrstudio.app'}
                  size={250}
                  animationType={animation.type}
                  pattern={design.pattern as any} // Simplification
                  baseColor={design.foreground}
                  design={design}
                />
              ) : (
                <div
                  ref={qrCodeRef}
                  className="bg-white p-4 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.2)]"
                />
              )}

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" size="sm" onClick={() => qrCodeInstance.current?.download({ extension: 'png' })}>
                  <Download size={14} className="mr-2" /> PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => qrCodeInstance.current?.download({ extension: 'svg' })}>
                  <Download size={14} className="mr-2" /> SVG
                </Button>
              </div>
            </Card>

            {/* Save/Name Input */}
            <Card className="p-4 space-y-4 bg-muted/20">
              <label className="text-sm font-medium">Name your QR Code</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome QR"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
