'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Switch } from "@/components/ui/switch";
import { Tag, Plus, Edit, Trash2, Calendar, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/Textarea';

interface Offer {
    id: string;
    title: string;
    description: string;
    discountPercent: number;
    couponCode: string;
    validFrom: string;
    validUntil: string;
    targetPlan: string;
    active: boolean;
}

interface OffersTabProps {
    offers: Offer[];
    onCreate: () => void;
    form: any;
    setForm: (form: any) => void;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleCreate: () => void;
    onRefresh: () => void;
}

export function OffersTab({
    offers,
    form,
    setForm,
    dialogOpen,
    setDialogOpen,
    handleCreate,
    onRefresh
}: OffersTabProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleEdit = (offer: Offer) => {
        setEditingId(offer.id);
        setForm({
            title: offer.title,
            description: offer.description,
            discountPercent: offer.discountPercent,
            couponCode: offer.couponCode,
            validFrom: new Date(offer.validFrom).toISOString().split('T')[0],
            validUntil: new Date(offer.validUntil).toISOString().split('T')[0],
            targetPlan: offer.targetPlan,
            active: offer.active,
        });
        setDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        
        try {
            const response = await fetch(`/api/admin/offers/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                setDialogOpen(false);
                setEditingId(null);
                setForm({
                    title: '',
                    description: '',
                    discountPercent: 0,
                    couponCode: '',
                    validFrom: '',
                    validUntil: '',
                    targetPlan: 'all',
                    active: true,
                });
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to update offer:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        
        setIsDeleting(id);
        try {
            const response = await fetch(`/api/admin/offers/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to delete offer:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setEditingId(null);
            setForm({
                title: '',
                description: '',
                discountPercent: 0,
                couponCode: '',
                validFrom: '',
                validUntil: '',
                targetPlan: 'all',
                active: true,
            });
        }
        setDialogOpen(open);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Tag className="w-5 h-5 text-electric-violet" />
                        Special Offers & Deals
                    </h2>
                    <p className="text-sm text-gray-400">Manage promotional offers and discount codes.</p>
                </div>
                <Button variant="glow" onClick={() => setDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> New Offer
                </Button>
            </div>

            <Card variant="glass" className="overflow-hidden border-white/5">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead className="text-gray-400">Title</TableHead>
                            <TableHead className="text-gray-400">Discount</TableHead>
                            <TableHead className="text-gray-400">Code</TableHead>
                            <TableHead className="text-gray-400">Valid Until</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.length === 0 ? (
                            <TableRow className="border-white/5 bg-white/5 hover:bg-white/5">
                                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                    No offers or deals found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            offers.map((offer) => (
                                <TableRow key={offer.id} className="border-white/5 hover:bg-white/5 whitespace-nowrap">
                                    <TableCell className="font-medium text-white">{offer.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-electric-cyan font-bold">
                                            <Percent className="w-3 h-3" />
                                            {offer.discountPercent}%
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="bg-white/10 px-2 py-1 rounded text-xs font-mono text-electric-blue">
                                            {offer.couponCode}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(offer.validUntil).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] border",
                                            offer.active
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                        )}>
                                            {offer.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                                onClick={() => handleEdit(offer)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleDelete(offer.id)}
                                                disabled={isDeleting === offer.id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-300">Title</label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Summer Sale"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-300">Description</label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Describe the offer details..."
                                className="bg-black/50 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Discount (%)</label>
                                <Input
                                    type="number"
                                    value={form.discountPercent}
                                    onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value) })}
                                    placeholder="20"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Coupon Code</label>
                                <Input
                                    value={form.couponCode}
                                    onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER2024"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Valid From</label>
                                <Input
                                    type="date"
                                    value={form.validFrom}
                                    onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                                    className="bg-black/50"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Valid Until</label>
                                <Input
                                    type="date"
                                    value={form.validUntil}
                                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                                    className="bg-black/50"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-300">Target Plan</label>
                            <Select
                                value={form.targetPlan}
                                onValueChange={(val) => setForm({ ...form, targetPlan: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select target plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Plans</SelectItem>
                                    <SelectItem value="pro">Pro Only</SelectItem>
                                    <SelectItem value="business">Business Only</SelectItem>
                                    <SelectItem value="enterprise">Enterprise Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-gray-200">Active Status</label>
                                <p className="text-xs text-gray-400">Offer is redeemable immediately</p>
                            </div>
                            <Switch
                                checked={form.active}
                                onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => handleDialogClose(false)}>Cancel</Button>
                        <Button 
                            variant="glow" 
                            onClick={editingId ? handleUpdate : handleCreate} 
                            disabled={!form.title || !form.validUntil}
                        >
                            {editingId ? 'Update Offer' : 'Create Offer'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
