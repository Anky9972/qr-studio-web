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
import { Megaphone, Plus, Edit, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/Textarea';

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    active: boolean;
    targetAudience: string;
    sendEmail: boolean;
    sendWebNotification: boolean;
    emailSent: boolean;
    emailSentAt: string | null;
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
    isLoading?: boolean;
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
    onRefresh,
    isLoading = false
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
            sendEmail: announcement.sendEmail,
            sendWebNotification: announcement.sendWebNotification,
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
                sendEmail: false,
                sendWebNotification: true,
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
                            <TableHead className="text-gray-400">Channels</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Created</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length === 0 ? (
                            <TableRow className="border-white/5 bg-white/5 hover:bg-white/5">
                                <TableCell colSpan={7} className="h-24 text-center text-gray-400">
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
                                        <div className="flex gap-1.5">
                                            {announcement.sendWebNotification && (
                                                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20">Web</span>
                                            )}
                                            {announcement.sendEmail && (
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] border",
                                                    announcement.emailSent
                                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                )}>
                                                    {announcement.emailSent ? '📧 Sent' : '📧 Email'}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
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
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-electric-cyan" />
                            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                        </DialogTitle>
                        <p className="text-sm text-gray-400 mt-1">
                            {editingId ? 'Update announcement details' : 'Broadcast an important message to your users'}
                        </p>
                    </DialogHeader>
                    <div className="grid gap-5 py-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g., System Maintenance Notice"
                                className="bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Message <span className="text-red-400">*</span>
                            </label>
                            <Textarea
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="Enter detailed announcement message for your users..."
                                className="min-h-[120px] bg-black/30 border-white/10 text-white placeholder:text-gray-500 resize-none"
                            />
                            <p className="text-xs text-gray-500">{form.message?.length || 0} characters</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200">Type</label>
                                <Select
                                    value={form.type}
                                    onValueChange={(val) => setForm({ ...form, type: val })}
                                >
                                    <SelectTrigger className="bg-black/30 border-white/10">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">
                                            <div className="flex items-center gap-2">
                                                <Info className="w-4 h-4 text-blue-500" />
                                                <span>Info</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="success">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                <span>Success</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="warning">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                <span>Warning</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="error">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                                <span>Error</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200">Target Audience</label>
                                <Select
                                    value={form.targetAudience}
                                    onValueChange={(val) => setForm({ ...form, targetAudience: val })}
                                >
                                    <SelectTrigger className="bg-black/30 border-white/10">
                                        <SelectValue placeholder="Select audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">🌐 All Users</SelectItem>
                                        <SelectItem value="free">🆓 Free Tier</SelectItem>
                                        <SelectItem value="pro">⭐ Pro Tier</SelectItem>
                                        <SelectItem value="business">💼 Business Tier</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 hover:border-electric-cyan/30 transition-colors">
                            <div className="space-y-0.5 flex-1">
                                <label htmlFor="active-status-switch" className="text-sm font-medium text-gray-200 cursor-pointer">
                                    Active Status
                                </label>
                                <p className="text-xs text-gray-400">Immediately visible to users</p>
                            </div>
                            <Switch
                                id="active-status-switch"
                                checked={form.active ?? true}
                                onCheckedChange={(checked) => {
                                    console.log('Active status toggled:', checked);
                                    setForm({ ...form, active: checked });
                                }}
                            />
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-electric-cyan" />
                                <label className="text-sm font-medium text-gray-200">Notification Channels</label>
                            </div>
                            <p className="text-xs text-gray-500">Choose how to deliver this announcement</p>
                            
                            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/5 to-transparent p-4 hover:border-blue-500/30 transition-colors">
                                <div className="space-y-0.5 flex-1">
                                    <label htmlFor="web-notification-switch" className="text-sm font-medium text-gray-200 cursor-pointer flex items-center gap-2">
                                        <Bell className="w-4 h-4 text-blue-500" />
                                        Dashboard Notification
                                    </label>
                                    <p className="text-xs text-gray-400">Show in notification bell icon (recommended)</p>
                                </div>
                                <Switch
                                    id="web-notification-switch"
                                    checked={form.sendWebNotification ?? true}
                                    onCheckedChange={(checked) => setForm({ ...form, sendWebNotification: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br from-amber-500/5 to-transparent p-4 hover:border-amber-500/30 transition-colors">
                                <div className="space-y-0.5 flex-1">
                                    <label htmlFor="email-notification-switch" className="text-sm font-medium text-gray-200 cursor-pointer flex items-center gap-2">
                                        📧 Email Notification
                                    </label>
                                    <p className="text-xs text-gray-400">Send styled email to target audience (via SMTP server)</p>
                                </div>
                                <Switch
                                    id="email-notification-switch"
                                    checked={form.sendEmail ?? false}
                                    onCheckedChange={(checked) => setForm({ ...form, sendEmail: checked })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
                        <Button 
                            variant="ghost" 
                            onClick={() => handleDialogClose(false)}
                            className="w-full sm:w-auto"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="glow" 
                            onClick={editingId ? handleUpdate : handleCreate} 
                            disabled={!form.title || !form.message || isLoading}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {editingId ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>{editingId ? '✓ Update Announcement' : '✓ Create Announcement'}</>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
