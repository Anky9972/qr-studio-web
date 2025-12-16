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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { MoreHorizontal, Shield, Mail, Calendar, Activity, Edit, Trash2, Ban, UserCog, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    subscription: string;
    isAdmin: boolean;
    emailVerified: Date | null;
    createdAt: string;
    lastLoginAt: string | null;
    _count: {
        qrCodes: number;
        teamMembers: number;
    };
}

interface UserTableProps {
    users: User[];
    loading: boolean;
    onRefresh?: () => void;
}

export function UserTable({ users, loading, onRefresh }: UserTableProps) {
    const [actionUserId, setActionUserId] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [newSubscription, setNewSubscription] = useState('');

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditName(user.name || '');
        setEditEmail(user.email || '');
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        setActionUserId(selectedUser.id);
        try {
            const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, email: editEmail }),
            });
            if (response.ok && onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        } finally {
            setActionUserId(null);
            setEditDialogOpen(false);
        }
    };

    const handleChangeSubscription = (user: User) => {
        setSelectedUser(user);
        setNewSubscription(user.subscription);
        setSubscriptionDialogOpen(true);
    };

    const handleSaveSubscription = async () => {
        if (!selectedUser) return;
        setActionUserId(selectedUser.id);
        try {
            const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription: newSubscription }),
            });
            if (response.ok && onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to change subscription:', error);
        } finally {
            setActionUserId(null);
            setSubscriptionDialogOpen(false);
        }
    };

    const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
        if (!confirm(`Are you sure you want to ${currentIsAdmin ? 'remove' : 'grant'} admin access for this user?`)) return;

        setActionUserId(userId);
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAdmin: !currentIsAdmin }),
            });

            if (response.ok && onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to toggle admin status:', error);
        } finally {
            setActionUserId(null);
        }
    };

    const handleSuspendUser = async (userId: string) => {
        if (!confirm('Are you sure you want to suspend this user?')) return;

        setActionUserId(userId);
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suspended: true }),
            });

            if (response.ok && onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to suspend user:', error);
        } finally {
            setActionUserId(null);
        }
    };

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (!confirm(`Are you sure you want to permanently delete ${userEmail}? This action cannot be undone.`)) return;

        setActionUserId(userId);
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok && onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setActionUserId(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-cyan"></div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-xl border border-white/5 bg-black/20 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead className="text-gray-400">User</TableHead>
                            <TableHead className="text-gray-400">Plan</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Activity</TableHead>
                            <TableHead className="text-gray-400">Stats</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow className="border-white/5 bg-white/5 hover:bg-white/5">
                                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="border-white/5 hover:bg-white/5 whitespace-nowrap">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-white/10">
                                                <AvatarImage src={user.image || ''} />
                                                <AvatarFallback className="bg-electric-violet/20 text-electric-violet">
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white flex items-center gap-1">
                                                    {user.name || 'Unnamed User'}
                                                    {user.isAdmin && <Shield className="w-3 h-3 text-emerald-400" />}
                                                </span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider",
                                            user.subscription === 'FREE' && "bg-gray-500/10 text-gray-400 border-gray-500/20",
                                            user.subscription === 'PRO' && "bg-electric-blue/10 text-electric-blue border-electric-blue/20",
                                            user.subscription === 'BUSINESS' && "bg-electric-violet/10 text-electric-violet border-electric-violet/20",
                                            user.subscription === 'ENTERPRISE' && "bg-electric-amber/10 text-electric-amber border-electric-amber/20"
                                        )}>
                                            {user.subscription}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className={cn(
                                                "text-xs flex items-center gap-1.5",
                                                user.emailVerified ? "text-emerald-400" : "text-amber-400"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full", user.emailVerified ? "bg-emerald-400" : "bg-amber-400")} />
                                                {user.emailVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs text-gray-400 gap-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Joined {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                            {user.lastLoginAt && (
                                                <span className="flex items-center gap-1 text-gray-500">
                                                    <Activity className="w-3 h-3" />
                                                    Last seen {new Date(user.lastLoginAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3 text-xs">
                                            <div className="text-gray-300">
                                                <span className="font-bold text-white">{user._count.qrCodes}</span> QRs
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    disabled={actionUserId === user.id}
                                                >
                                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit User
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeSubscription(user)}>
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    Change Plan
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleSuspendUser(user.id)} className="text-amber-500">
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    Suspend User
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteUser(user.id, user.email || '')}
                                                    className="text-red-500 focus:text-red-500"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} disabled={!!actionUserId}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Subscription Dialog */}
            <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Subscription</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Current Plan: <span className="font-bold">{selectedUser?.subscription}</span></Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subscription">New Plan</Label>
                            <Select value={newSubscription} onValueChange={setNewSubscription}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FREE">Free</SelectItem>
                                    <SelectItem value="PRO">Pro</SelectItem>
                                    <SelectItem value="BUSINESS">Business</SelectItem>
                                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSubscriptionDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveSubscription} disabled={!!actionUserId}>Update Plan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
