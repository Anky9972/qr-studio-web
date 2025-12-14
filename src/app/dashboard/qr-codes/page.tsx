'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Share2,
  Heart,
  Filter,
  Link as LinkIcon,
  Copy,
  Check,
  QrCode,
  Loader2,
  Calendar,
  BarChart3,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/switch';

interface QRCode {
  id: string;
  name: string | null;
  type: 'static' | 'dynamic';
  content: string;
  destination: string;
  qrType: string;
  scanCount: number;
  favorite: boolean;
  createdAt: string;
  shortUrl: string;
  tags: string[];
  campaign?: {
    id: string;
    name: string;
  };
}

export default function QRCodesPage() {
  const router = useRouter();
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);

  // Dialog States
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    qrCode: QRCode | null;
    name: string;
    destination: string;
    tags: string;
    campaignId: string;
  }>({ open: false, qrCode: null, name: '', destination: '', tags: '', campaignId: 'none' });

  const [shareDialog, setShareDialog] = useState<{
    open: boolean;
    qrCode: QRCode | null;
  }>({ open: false, qrCode: null });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQRCodes();
    fetchCampaigns();
  }, [page, search, typeFilter, favoriteFilter, campaignFilter]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns?limit=100');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(favoriteFilter && { favorite: 'true' }),
        ...(campaignFilter !== 'all' && { campaignId: campaignFilter }),
      });

      const response = await fetch(`/api/qr-codes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQRCodes(data.qrCodes);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (qrCode: QRCode) => {
    try {
      // Optimistic update
      setQRCodes(prev => prev.map(q => q.id === qrCode.id ? { ...q, favorite: !q.favorite } : q));

      await fetch(`/api/qr-codes/${qrCode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !qrCode.favorite }),
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      fetchQRCodes(); // Revert on error
    }
  };

  const handleDelete = async (qrCode: QRCode) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;
    try {
      const response = await fetch(`/api/qr-codes/${qrCode.id}`, { method: 'DELETE' });
      if (response.ok) fetchQRCodes();
    } catch (error) {
      console.error('Failed to delete QR code:', error);
    }
  };

  const handleDownload = async (qrCode: QRCode) => {
    try {
      const response = await fetch('/api/qr-codes/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeIds: [qrCode.id], format: 'png' }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${qrCode.name || 'qrcode'}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleSaveDestination = async () => {
    if (!editDialog.qrCode) return;
    try {
      setSaving(true);
      const tagsArray = editDialog.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

      const updateData: any = {
        name: editDialog.name || null,
        tags: tagsArray,
        campaignId: editDialog.campaignId === 'none' ? null : editDialog.campaignId
      };

      if (editDialog.qrCode.type === 'dynamic') {
        updateData.destination = editDialog.destination;
      } else {
        updateData.content = editDialog.destination;
      }

      const response = await fetch(`/api/qr-codes/${editDialog.qrCode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchQRCodes();
        setEditDialog({ open: false, qrCode: null, name: '', destination: '', tags: '', campaignId: 'none' });
      }
    } catch (error) {
      console.error('Failed to update QR code:', error);
    } finally {
      setSaving(false);
    }
  };

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const QRTypeBadge = ({ type }: { type: string }) => {
    const colors: Record<string, string> = {
      url: 'blue',
      wifi: 'cyan',
      vcard: 'green',
      email: 'amber',
      phone: 'rose',
    };
    const color = colors[type] || 'default';

    return <Badge variant="outline" className={cn("uppercase text-[10px]",
      color === 'cyan' && "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
      color === 'blue' && "text-blue-400 border-blue-400/30 bg-blue-400/10",
      color === 'green' && "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
      color === 'amber' && "text-amber-400 border-amber-400/30 bg-amber-400/10",
      color === 'rose' && "text-rose-400 border-rose-400/30 bg-rose-400/10",
    )}>{type}</Badge>
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            My QR Codes
          </h1>
          <p className="text-muted-foreground mt-1">Manage, track, and customize your QR codes.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchQRCodes}
            disabled={loading}
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="glow" onClick={() => router.push('/dashboard/generate')}>
            <Plus size={18} className="mr-2" /> Create New
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            placeholder="Search QR codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="w-[180px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="dynamic">Dynamic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={favoriteFilter ? "secondary" : "outline"}
            onClick={() => setFavoriteFilter(!favoriteFilter)}
            className={cn(favoriteFilter && "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30")}
          >
            <Heart size={16} className={cn("mr-2", favoriteFilter && "fill-current")} /> Favorites
          </Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
          <QrCode className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-xl font-semibold">No QR Codes Found</h3>
          <p className="text-muted-foreground mt-2 mb-6">Create your first QR code to get started</p>
          <Button variant="outline" onClick={() => router.push('/dashboard/generate')}>
            Create QR Code
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {qrCodes.map(qr => (
            <Card key={qr.id} variant="glass" className="group overflow-hidden flex flex-col">
              <div className="p-5 flex gap-5 items-start">
                {/* QR Preview Thumb */}
                <div className="w-24 h-24 bg-white rounded-lg p-2 shrink-0 shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qr.content)}`}
                    alt="QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold truncate pr-2" title={qr.name || 'Untitled'}>
                      {qr.name || 'Untitled QR'}
                    </h3>
                    <DropdownMenuPrimitive.Root>
                      <DropdownMenuPrimitive.Trigger className="text-muted-foreground hover:text-white transition-colors focus:outline-none">
                        <MoreVertical size={18} />
                      </DropdownMenuPrimitive.Trigger>
                      <DropdownMenuPrimitive.Content align="end" className="w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <DropdownMenuPrimitive.Item
                          className="flex items-center px-2 py-2 text-sm rounded hover:bg-white/10 cursor-pointer outline-none text-gray-200"
                          onSelect={() => setEditDialog({
                            open: true,
                            qrCode: qr,
                            name: qr.name || '',
                            destination: qr.type === 'dynamic' ? qr.destination : qr.content,
                            tags: qr.tags?.join(', ') || '',
                            campaignId: qr.campaign?.id || 'none'
                          })}
                        >
                          <Edit size={14} className="mr-2" /> Edit Details
                        </DropdownMenuPrimitive.Item>
                        <DropdownMenuPrimitive.Item
                          className="flex items-center px-2 py-2 text-sm rounded hover:bg-white/10 cursor-pointer outline-none text-gray-200"
                          onSelect={() => handleDownload(qr)}
                        >
                          <Download size={14} className="mr-2" /> Download
                        </DropdownMenuPrimitive.Item>
                        <DropdownMenuPrimitive.Item
                          className="flex items-center px-2 py-2 text-sm rounded hover:bg-white/10 cursor-pointer outline-none text-red-400 hover:text-red-300"
                          onSelect={() => handleDelete(qr)}
                        >
                          <Trash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuPrimitive.Item>
                      </DropdownMenuPrimitive.Content>
                    </DropdownMenuPrimitive.Root>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={qr.type === 'dynamic' ? 'premium' : 'outline'} className="text-[10px] uppercase">
                      {qr.type}
                    </Badge>
                    <QRTypeBadge type={qr.qrType} />
                  </div>

                  <p className="text-xs text-muted-foreground truncate font-mono bg-black/20 p-1 rounded">
                    {qr.content}
                  </p>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-auto border-t border-white/5 bg-white/5 px-5 py-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <BarChart3 size={14} /> {qr.scanCount} scans
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(qr.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleFavorite(qr)}
                    className={cn("hover:text-rose-400 transition-colors", qr.favorite && "text-rose-500")}
                  >
                    <Heart size={16} className={cn(qr.favorite && "fill-current")} />
                  </button>
                  <button onClick={() => setShareDialog({ open: true, qrCode: qr })} className="hover:text-primary transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className="flex items-center px-4 text-sm font-medium">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog(prev => ({ ...prev, open: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editDialog.name}
                onChange={(e) => setEditDialog(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{editDialog.qrCode?.type === 'dynamic' ? 'Destination URL' : 'Content'}</Label>
              <Input
                value={editDialog.destination}
                onChange={(e) => setEditDialog(prev => ({ ...prev, destination: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={editDialog.tags}
                onChange={(e) => setEditDialog(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Campaign</Label>
              <Select
                value={editDialog.campaignId}
                onValueChange={(val) => setEditDialog(prev => ({ ...prev, campaignId: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Campaign</SelectItem>
                  {campaigns.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="glow" onClick={handleSaveDestination} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialog.open} onOpenChange={(open) => !open && setShareDialog(prev => ({ ...prev, open: false }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-6">
            {shareDialog.qrCode && (
              <div className="p-4 bg-white rounded-xl shadow-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareDialog.qrCode.content)}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" className="w-full" onClick={() => copyLink(shareDialog.qrCode?.content || '')}>
                <Copy size={16} className="mr-2" /> Copy Link
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'QR Code',
                    text: 'Check out this QR code',
                    url: shareDialog.qrCode?.content
                  }).catch(console.error);
                }
              }}>
                <Share2 size={16} className="mr-2" /> Native Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
