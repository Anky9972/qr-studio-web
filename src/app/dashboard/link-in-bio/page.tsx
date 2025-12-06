'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, LayoutTemplate, Sparkles } from 'lucide-react';
import LinkInBioBuilder from '@/components/qr/LinkInBioBuilder';

export default function LinkInBioPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Link in Bio
          </h1>
          <p className="text-muted-foreground mt-1">
            Create beautiful, mobile-optimized landing pages for your social media.
          </p>
        </div>
        {!showBuilder && (
          <Button variant="glow" onClick={() => setShowBuilder(true)}>
            <Plus size={16} className="mr-2" /> Create New Page
          </Button>
        )}
        {showBuilder && (
          <Button variant="ghost" onClick={() => setShowBuilder(false)}>
            Cancel
          </Button>
        )}
      </div>

      {showBuilder ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <LinkInBioBuilder
            onSave={async (data) => {
              // Save to API
              await fetch('/api/link-in-bio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              setShowBuilder(false);
            }}
          />
        </div>
      ) : (
        <Card variant="glass" className="py-20 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6 relative group">
            <LayoutTemplate size={48} className="text-primary group-hover:scale-110 transition-transform duration-500" />
            <Sparkles size={20} className="text-yellow-400 absolute top-4 right-4 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Create Your Link in Bio</h3>
          <p className="text-muted-foreground max-w-md mb-8 px-4">
            Consolidate all your important links into one stunning page. Perfect for Instagram, TikTok, and Twitter bios.
          </p>
          <Button variant="glow" size="lg" onClick={() => setShowBuilder(true)} className="px-8">
            <Plus size={18} className="mr-2" /> Start Building
          </Button>
        </Card>
      )}
    </div>
  );
}
