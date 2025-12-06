'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Utensils, ChefHat } from 'lucide-react';
import DigitalMenuBuilder from '@/components/qr/DigitalMenuBuilder';

export default function DigitalMenuPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Digital Menu
          </h1>
          <p className="text-muted-foreground mt-1">
            Create contactless menus, portfolios, and galleries.
          </p>
        </div>
        {!showBuilder && (
          <Button variant="glow" onClick={() => setShowBuilder(true)}>
            <Plus size={16} className="mr-2" /> Create New Menu
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
          <DigitalMenuBuilder
            onSave={async (data) => {
              // Save to API
              await fetch('/api/digital-menu', {
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
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-6 relative group">
            <Utensils size={48} className="text-orange-400 group-hover:scale-110 transition-transform duration-500" />
            <ChefHat size={24} className="text-white absolute -bottom-2 -right-2 bg-orange-500 p-1.5 rounded-full shadow-lg" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Create Your Digital Menu</h3>
          <p className="text-muted-foreground max-w-md mb-8 px-4">
            Showcase your items with a beautiful, mobile-friendly digital menu or catalog.
          </p>
          <Button variant="glow" size="lg" onClick={() => setShowBuilder(true)} className="px-8">
            <Plus size={18} className="mr-2" /> Start Creating
          </Button>
        </Card>
      )}
    </div>
  );
}
