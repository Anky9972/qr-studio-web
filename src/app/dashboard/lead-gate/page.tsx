'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Lock, Key } from 'lucide-react';
import LeadGateBuilder from '@/components/qr/LeadGateBuilder';

export default function LeadGatePage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Lead Gate
          </h1>
          <p className="text-muted-foreground mt-1">
            Gate your content behind lead capture forms. Grow your email list on autopilot.
          </p>
        </div>
        {!showBuilder && (
          <Button variant="glow" onClick={() => setShowBuilder(true)}>
            <Plus size={16} className="mr-2" /> Create Lead Gate
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
          <LeadGateBuilder
            onSave={async (data) => {
              // Save to API
              await fetch('/api/lead-gate', {
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
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 relative group">
            <Lock size={48} className="text-purple-400 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -bottom-2 -right-2 bg-purple-500 p-1.5 rounded-full shadow-lg border-4 border-[#0f0f0f]">
              <Key size={18} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">Capture More Leads</h3>
          <p className="text-muted-foreground max-w-md mb-8 px-4">
            Create beautiful forms that unlock content after submission. Perfect for ebooks, webinars, and exclusive offers.
          </p>
          <Button variant="glow" size="lg" onClick={() => setShowBuilder(true)} className="px-8">
            <Plus size={18} className="mr-2" /> Create First Gate
          </Button>
        </Card>
      )}
    </div>
  );
}
