'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Contact, IdCard } from 'lucide-react';
import VCardPlusBuilder from '@/components/qr/VCardPlusBuilder';

export default function VCardPlusPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            vCard Plus
          </h1>
          <p className="text-muted-foreground mt-1">
            Create next-gen digital business cards. Share your contact info instantly.
          </p>
        </div>
        {!showBuilder && (
          <Button variant="glow" onClick={() => setShowBuilder(true)}>
            <Plus size={16} className="mr-2" /> Create New Card
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
          <VCardPlusBuilder
            onSave={async (data) => {
              // Save to API
              await fetch('/api/vcard-plus', {
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
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center mb-6 relative group">
            <IdCard size={48} className="text-blue-400 group-hover:scale-110 transition-transform duration-500" />
            <Contact size={20} className="text-white absolute -bottom-2 -right-2 bg-blue-500 p-1 rounded-full shadow-lg" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Create Your Digital Business Card</h3>
          <p className="text-muted-foreground max-w-md mb-8 px-4">
            Ditch paper cards. Create a dynamic vCard that people can save directly to their phones.
          </p>
          <Button variant="glow" size="lg" onClick={() => setShowBuilder(true)} className="px-8">
            <Plus size={18} className="mr-2" /> Create vCard
          </Button>
        </Card>
      )}
    </div>
  );
}
