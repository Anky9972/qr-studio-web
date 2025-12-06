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
import { Megaphone, Plus, Edit, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/Textarea';

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    active: boolean;
    targetAudience: string;
    createdAt: string;
}

interface AnnouncementsTabProps {
    announcements: Announcement[];
    onCreate: () => void;
    form: any;
    setForm: (form: any) => void;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleCreate: () => void;
    onRefresh: () => void;
}

const TypeBadge = ({ type }: { type: string }) => {
    const styles = {
        info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const icons = {
        info: Info,
        success: CheckCircle,
        warning: AlertTriangle,
        error: AlertCircle
    };

    const Icon = icons[type as keyof typeof icons] || Info;

    return (
        <span className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border", styles[type as keyof typeof styles])}>
            <Icon className="w-3 h-3" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
    );
};

export function AnnouncementsTab({
    announcements,
    form,
    setForm,
    dialogOpen,
    setDialogOpen,
    handleCreate,
    onRefresh
}: AnnouncementsTabProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setForm({
            title: announcement.title,
            message: announcement.message,
            type: announcement.type,
            active: announcement.active,
            targetAudience: announcement.targetAudience,
        });
        setDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        
        try {
            const response = await fetch(`/api/admin/announcements/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                setDialogOpen(false);
                setEditingId(null);
                setForm({
                    title: '',
                    message: '',
                    type: 'info',
                    active: true,
                    targetAudience: 'all',
                });
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to update announcement:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        
        setIsDeleting(id);
        try {
            const response = await fetch(`/api/admin/announcements/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to delete announcement:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setEditingId(null);
            setForm({
                title: '',
                message: '',
                type: 'info',
                active: true,
                targetAudience: 'all',
            });
        }
        setDialogOpen(open);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-electric-blue" />
                        Active Announcements
                    </h2>
                    <p className="text-sm text-gray-400">Manage system-wide notifications and alerts.</p>
                </div>
                <Button variant="glow" onClick={() => setDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> New Announcement
                </Button>
            </div>

            <Card variant="glass" className="overflow-hidden border-white/5">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead className="text-gray-400">Title</TableHead>
                            <TableHead className="text-gray-400">Type</TableHead>
                            <TableHead className="text-gray-400">Target</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Created</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length === 0 ? (
                            <TableRow className="border-white/5 bg-white/5 hover:bg-white/5">
                                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                    No announcements found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            announcements.map((announcement) => (
                                <TableRow key={announcement.id} className="border-white/5 hover:bg-white/5 whitespace-nowrap">
                                    <TableCell className="font-medium text-white">{announcement.title}</TableCell>
                                    <TableCell>
                                        <TypeBadge type={announcement.type} />
                                    </TableCell>
                                    <TableCell className="text-gray-300 capitalize">{announcement.targetAudience}</TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] border",
                                            announcement.active
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                        )}>
                                            {announcement.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-xs">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                                onClick={() => handleEdit(announcement)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleDelete(announcement.id)}
                                                disabled={isDeleting === announcement.id}
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-300">Title</label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Important Update"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-300">Message</label>
                            <Textarea
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="Enter your announcement details..."
                                className="min-h-[100px] bg-black/50 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Type</label>
                                <Select
                                    value={form.type}
                                    onValueChange={(val) => setForm({ ...form, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="success">Success</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="error">Error</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Audience</label>
                                <Select
                                    value={form.targetAudience}
                                    onValueChange={(val) => setForm({ ...form, targetAudience: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        <SelectItem value="free">Free Users</SelectItem>
                                        <SelectItem value="pro">Pro Users</SelectItem>
                                        <SelectItem value="business">Business Users</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-gray-200">Active Status</label>
                                <p className="text-xs text-gray-400">Immediately visible to users</p>
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
                            disabled={!form.title || !form.message}
                        >
                            {editingId ? 'Update Announcement' : 'Create Announcement'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
