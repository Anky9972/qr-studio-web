import React, { useState } from 'react';
import {
  Sparkles,
  Grid3X3,
  Palette,
  Zap,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QRTemplate, QR_TEMPLATES, getTemplatesByCategory } from '@/lib/qr-templates';

interface TemplateGallerySelectorProps {
  onSelectTemplate: (template: QRTemplate) => void;
  selectedTemplateId?: string;
  showPremium?: boolean;
}

export const TemplateGallerySelector: React.FC<TemplateGallerySelectorProps> = ({
  onSelectTemplate,
  selectedTemplateId,
  showPremium = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All', value: 'all', icon: Sparkles },
    { label: 'Minimal', value: 'minimal', icon: Grid3X3 },
    { label: 'Gradient', value: 'gradient', icon: Palette },
    { label: 'Pattern', value: 'pattern', icon: Grid3X3 },
    { label: 'Animated', value: 'animated', icon: Zap },
    { label: 'Premium', value: 'premium', icon: Crown },
  ];

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return showPremium ? QR_TEMPLATES : QR_TEMPLATES.filter(t => !t.premium);
    }
    const templates = getTemplatesByCategory(selectedCategory as any);
    return showPremium ? templates : templates.filter(t => !t.premium);
  };

  const templates = getFilteredTemplates();

  const getGradientPreview = (template: QRTemplate) => {
    if (template.gradient) {
      const stops = template.gradient.colorStops
        .map((stop) => `${stop.color} ${stop.offset * 100}%`)
        .join(', ');

      if (template.gradient.type === 'linear') {
        return `linear-gradient(${template.gradient.rotation || 0}deg, ${stops})`;
      } else {
        return `radial-gradient(circle, ${stops})`;
      }
    }
    return template.foreground;
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin scrollbar-thumb-white/10">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => onSelectTemplate(template)}
                className={cn(
                  "w-full group relative flex flex-col items-center overflow-hidden rounded-xl border transition-all duration-300",
                  selectedTemplateId === template.id
                    ? "border-primary ring-1 ring-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary/5"
                    : "border-white/10 hover:border-primary/50 bg-white/5 hover:bg-white/10"
                )}
              >
                {/* Preview Area */}
                <div
                  className="w-full h-32 flex items-center justify-center relative bg-black/20"
                  style={{ background: template.background }}
                >
                  <div className="relative z-10 w-20 h-20 shadow-lg">
                    <div
                      className="w-full h-full rounded-lg"
                      style={{
                        background: getGradientPreview(template),
                        maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='black' d='M10,10 h30 v30 h-30 z M60,10 h30 v30 h-30 z M10,60 h30 v30 h-30 z'/%3E%3C/svg%3E")`,
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='black' d='M10,10 h30 v30 h-30 z M60,10 h30 v30 h-30 z M10,60 h30 v30 h-30 z'/%3E%3C/svg%3E")`,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        opacity: 0.8
                      }}
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {template.animated && (
                      <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                        <Zap size={10} /> AB
                      </span>
                    )}
                    {template.premium && (
                      <span className="flex items-center gap-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                        <Crown size={10} /> PRO
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Area */}
                <div className="w-full p-3 text-left border-t border-white/5">
                  <h4 className="font-semibold text-sm truncate">{template.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{template.pattern}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No templates found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateGallerySelector;
