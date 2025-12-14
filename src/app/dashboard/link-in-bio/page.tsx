'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, LayoutTemplate, Sparkles, ExternalLink, Trash2, Eye, Edit } from 'lucide-react';
import LinkInBioBuilder from '@/components/qr/LinkInBioBuilder';
import { toast } from 'sonner';

interface LinkInBioItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  profileImage?: string;
  viewCount: number;
  published: boolean;
  createdAt: string;
  links?: any[];
  socialLinks?: any[];
  theme?: any;
}

export default function LinkInBioPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [items, setItems] = useState<LinkInBioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<LinkInBioItem | null>(null);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/link-in-bio');
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
            Link in Bio
          </h1>
          <p className="text-muted-foreground mt-1">
            Create beautiful, mobile-optimized landing pages for your social media.
          </p>
        </div>
        {!showBuilder && (
          <Button variant="glow" onClick={() => {
            setEditingItem(null);
            setShowBuilder(true);
          }}>
            <Plus size={16} className="mr-2" /> Create New Page
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
          <LinkInBioBuilder
            initialData={editingItem ? { ...editingItem, socialLinks: editingItem.socialLinks || [] } as any : undefined}
            onSave={async (data) => {
              try {
                // Frontend validation
                if (!data.title || data.title.trim().length === 0) {
                  toast.error('Title is required', {
                    description: 'Please enter a title for your Link in Bio'
                  });
                  return;
                }

                if (data.title.length > 100) {
                  toast.error('Title too long', {
                    description: 'Title must be less than 100 characters'
                  });
                  return;
                }

                // Validate links
                for (const link of data.links || []) {
                  if (!link.title || link.title.trim().length === 0) {
                    toast.error('Link title required', {
                      description: 'All links must have a title'
                    });
                    return;
                  }
                  if (!link.url || !link.url.match(/^https?:\/\/.+/)) {
                    toast.error('Invalid link URL', {
                      description: `"${link.title}" must have a valid URL starting with http:// or https://`
                    });
                    return;
                  }
                }

                let response;
                let slug = editingItem?.slug;

                if (editingItem) {
                  // Update existing item (PATCH doesn't change slug)
                  response = await fetch(`/api/link-in-bio?id=${editingItem.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });
                } else {
                  // Generate slug from title for new items
                  slug = data.title.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                  // Ensure slug is at least 3 characters
                  if (slug.length < 3) {
                    slug = `bio-${Date.now()}`;
                  }

                  // Make slug unique by adding timestamp
                  slug = `${slug}-${Date.now()}`;

                  response = await fetch('/api/link-in-bio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, slug }),
                  });
                }

                const result = await response.json();

                if (!response.ok) {
                  // Show specific field error if available
                  if (result.field) {
                    throw new Error(`${result.field}: ${result.error}`);
                  }
                  throw new Error(result.error || 'Failed to save');
                }

                toast.success(editingItem ? 'Link in Bio updated!' : 'Link in Bio created successfully!', {
                  description: `View it at: ${window.location.origin}/bio/${result.slug}`
                });
                setShowBuilder(false);
                setEditingItem(null);
                fetchItems(); // Refresh the list
              } catch (error: any) {
                console.error('Error saving Link in Bio:', error);
                toast.error('Failed to save', {
                  description: error.message || 'Please try again'
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
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6 relative group">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
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
                  onClick={() => window.open(`/bio/${item.slug}`, '_blank')}
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
                    if (confirm('Are you sure you want to delete this Link in Bio?')) {
                      try {
                        const response = await fetch(`/api/link-in-bio?id=${item.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          toast.success('Link in Bio deleted');
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
