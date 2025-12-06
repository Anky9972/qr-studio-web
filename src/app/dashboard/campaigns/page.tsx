'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreVertical,
  QrCode,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  Megaphone,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';


interface Campaign {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  tags: string[];
  createdAt: string;
  _count: { qrCodes: number };
  totalScans: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    tags: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, [searchTerm]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/campaigns', window.location.origin);
      if (searchTerm) url.searchParams.set('search', searchTerm);

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        }),
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        resetForm();
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      const response = await fetch(`/api/campaigns/${selectedCampaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        }),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setSelectedCampaign(null);
        resetForm();
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDeleteCampaign = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm('Are you sure you want to delete this campaign? QR codes will be unassigned.')) {
      return;
    }

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleEditClick = (campaign: Campaign, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
      endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      tags: campaign.tags?.join(', ') || '',
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', startDate: '', endDate: '', tags: '' });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatus = (start: string | null, end: string | null) => {
    const now = new Date();
    if (start && new Date(start) > now) return { label: 'Scheduled', color: 'blue' };
    if (end && new Date(end) < now) return { label: 'Ended', color: 'gray' };
    return { label: 'Active', color: 'emerald' };
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize, track, and manage your marketing campaigns.
          </p>
        </div>
        <Button variant="glow" onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
          <Plus size={16} className="mr-2" /> Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <Card variant="glass" className="py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Megaphone size={40} className="text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Create your first campaign to group your QR codes and track performance together.
          </p>
          <Button variant="outline" onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
            <Plus size={16} className="mr-2" /> Create Campaign
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const status = getStatus(campaign.startDate, campaign.endDate);
            return (
              <Card
                key={campaign.id}
                variant="glass"
                className="group relative flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg line-clamp-1" title={campaign.name}>{campaign.name}</h3>
                        <Badge variant="outline" className={cn(
                          "text-[10px] uppercase tracking-wider",
                          status.label === 'Active' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          status.label === 'Scheduled' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                          status.label === 'Ended' && "text-muted-foreground border-white/10"
                        )}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {campaign.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <QrCode size={12} />
                        <span>QR Codes</span>
                      </div>
                      <span className="text-lg font-mono font-medium">{campaign._count.qrCodes}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <Eye size={12} />
                        <span>Total Scans</span>
                      </div>
                      <span className="text-lg font-mono font-medium">{campaign.totalScans}</span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-auto space-y-3">
                    {(campaign.startDate || campaign.endDate) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>
                          {formatDate(campaign.startDate) || 'Now'} - {formatDate(campaign.endDate) || 'Forever'}
                        </span>
                      </div>
                    )}

                    {campaign.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                        {campaign.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-muted-foreground flex items-center gap-1">
                            <Tag size={8} /> {tag}
                          </span>
                        ))}
                        {campaign.tags.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                            +{campaign.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions (Always visible on mobile, hover on desktop) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={(e) => handleEditClick(campaign, e)}>
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400" onClick={(e) => handleDeleteCampaign(campaign.id, e)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDialogOpen ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Summer Sale 2025"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the goal of this campaign..."
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="marketing, social, print (comma separated)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => { setCreateDialogOpen(false); setEditDialogOpen(false); }}>
              Cancel
            </Button>
            <Button
              variant="glow"
              onClick={editDialogOpen ? handleUpdateCampaign : handleCreateCampaign}
              disabled={!formData.name}
            >
              {editDialogOpen ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
