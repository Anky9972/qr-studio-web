'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Contact, IdCard, ExternalLink, Trash2, Eye, Edit } from 'lucide-react';
import VCardPlusBuilder from '@/components/qr/VCardPlusBuilder';
import { toast } from 'sonner';

interface VCardItem {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  viewCount: number;
  published: boolean;
  createdAt: string;
}

export default function VCardPlusPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [items, setItems] = useState<VCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/vcard-plus');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
          <Button variant="glow" onClick={() => {
            setEditingItem(null);
            setShowBuilder(true);
          }}>
            <Plus size={16} className="mr-2" /> Create New Card
          </Button>
        )}
        {showBuilder && (
          <Button variant="ghost" onClick={() => {
            setShowBuilder(false);
            setEditingItem(null);
          }}>
            Cancel
          </Button>
        )}
      </div>

      {showBuilder ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <VCardPlusBuilder
            initialData={editingItem || undefined}
            onSave={async (data) => {
              try {
                let response;
                let slug = data.slug;

                if (editingItem) {
                  // Update existing item
                  response = await fetch(`/api/vcard-plus?id=${editingItem.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });
                } else {
                  // Create new item with unique slug
                  slug = `${data.firstName}-${data.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `vcard-${Date.now()}`;
                  slug = `${slug}-${Date.now()}`;
                  
                  response = await fetch('/api/vcard-plus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, slug }),
                  });
                }
                
                const result = await response.json();
                
                if (!response.ok) {
                  throw new Error(result.error || 'Failed to save');
                }
                
                toast.success(editingItem ? 'vCard Plus updated!' : 'vCard Plus created successfully!', {
                  description: `View it at: ${window.location.origin}/card/${result.slug}`
                });
                setShowBuilder(false);
                setEditingItem(null);
                fetchItems();
              } catch (error: any) {
                console.error('Error saving vCard Plus:', error);
                const errorMsg = error.message?.includes('Validation failed') 
                  ? 'Please check all required fields are filled correctly'
                  : error.message || 'Please try again';
                toast.error('Failed to save', {
                  description: errorMsg
                });
              }
            }}
          />
        </div>
      ) : loading ? (
        <Card variant="glass" className="py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </Card>
      ) : items.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{item.firstName} {item.lastName}</h3>
                  {item.jobTitle && item.company && (
                    <p className="text-sm text-muted-foreground">{item.jobTitle} at {item.company}</p>
                  )}
                </div>
                {item.published ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Live</span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Draft</span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{item.viewCount} views</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`/card/${item.slug}`, '_blank')}
                >
                  <ExternalLink size={14} className="mr-1" /> View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingItem(item);
                    setShowBuilder(true);
                  }}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this vCard?')) {
                      try {
                        const response = await fetch(`/api/vcard-plus?id=${item.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          toast.success('vCard deleted');
                          fetchItems();
                        } else {
                          throw new Error('Failed to delete');
                        }
                      } catch (error) {
                        toast.error('Failed to delete');
                      }
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
