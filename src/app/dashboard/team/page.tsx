'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatar?: string;
  joinedAt: string;
  lastActive?: string;
  status: 'active' | 'pending';
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Invite Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('VIEWER');
  const [inviteMessage, setInviteMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Custom "Menu" State
  const [activeMenuMemberId, setActiveMenuMemberId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
    // Close menu on click outside
    const handleClickOutside = () => setActiveMenuMemberId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          message: inviteMessage,
        }),
      });

      if (response.ok) {
        setInviteDialogOpen(false);
        setInviteEmail('');
        setInviteRole('VIEWER');
        setInviteMessage('');
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const roleColors = {
    ADMIN: 'destructive' as const,
    EDITOR: 'default' as const,
    VIEWER: 'secondary' as const,
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Team Members
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your team access and roles.
          </p>
        </div>
        <Button variant="glow" onClick={() => setInviteDialogOpen(true)}>
          <UserPlus size={16} className="mr-2" /> Invite Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Members</p>
            <h3 className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}</h3>
          </div>
        </Card>
        <Card variant="glass" className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Invites</p>
            <h3 className="text-2xl font-bold">{members.filter(m => m.status === 'pending').length}</h3>
          </div>
        </Card>
        <Card variant="glass" className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Admins</p>
            <h3 className="text-2xl font-bold">{members.filter(m => m.role === 'ADMIN').length}</h3>
          </div>
        </Card>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
        <AlertCircle size={16} className="text-blue-400" />
        <AlertTitle>Business Plan</AlertTitle>
        <AlertDescription>
          You can have up to 10 team members. <span className="underline cursor-pointer hover:text-blue-300">Upgrade to Enterprise</span> for unlimited seats.
        </AlertDescription>
      </Alert>

      {/* Members List */}
      <Card variant="glass" className="overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading team...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Users size={40} className="text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No team members yet</h3>
            <p className="text-muted-foreground mb-6">
              Invite your first team member to start collaborating.
            </p>
            <Button variant="outline" onClick={() => setInviteDialogOpen(true)}>
              <UserPlus size={16} className="mr-2" /> Invite Member
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white/10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary">{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={roleColors[member.role] || 'secondary'}>
                        {member.role === 'ADMIN' && <ShieldAlert size={12} className="mr-1" />}
                        {member.role === 'EDITOR' && <ShieldCheck size={12} className="mr-1" />}
                        {member.role === 'VIEWER' && <Shield size={12} className="mr-1" />}
                        {member.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", member.status === 'active' ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                        <span className="capitalize">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {member.lastActive ? (
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(member.lastActive).toLocaleDateString()}
                        </div>
                      ) : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuMemberId(activeMenuMemberId === member.id ? null : member.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </Button>

                      {/* Dropdown Menu (Custom Implementation) */}
                      {activeMenuMemberId === member.id && (
                        <div className="absolute right-8 top-12 w-48 bg-[#0F172A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-white/5">
                            Change Role
                          </div>
                          <button
                            className="text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2 transition-colors text-white"
                            onClick={() => handleUpdateRole(member.id, 'ADMIN')}
                          >
                            <ShieldAlert size={14} className="text-red-400" /> Admin
                          </button>
                          <button
                            className="text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2 transition-colors text-white"
                            onClick={() => handleUpdateRole(member.id, 'EDITOR')}
                          >
                            <ShieldCheck size={14} className="text-blue-400" /> Editor
                          </button>
                          <button
                            className="text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2 transition-colors text-white"
                            onClick={() => handleUpdateRole(member.id, 'VIEWER')}
                          >
                            <Shield size={14} className="text-gray-400" /> Viewer
                          </button>
                          <div className="h-px bg-white/10 my-1" />
                          <button
                            className="text-left px-4 py-2 text-sm hover:bg-red-500/20 text-red-400 flex items-center gap-2 transition-colors"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 size={14} /> Remove Member
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(val: any) => setInviteRole(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEWER">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-muted-foreground" />
                      <span>Viewer</span>
                      <span className="text-xs text-muted-foreground ml-2">(Read-only)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EDITOR">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-primary" />
                      <span>Editor</span>
                      <span className="text-xs text-muted-foreground ml-2">(Create/Edit QRs)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={16} className="text-destructive" />
                      <span>Admin</span>
                      <span className="text-xs text-muted-foreground ml-2">(Full Access)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Personal Message (Optional)</Label>
              <Textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Hey, join our QR Studio team!"
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleInvite} disabled={!inviteEmail || submitting}>
              {submitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
