'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditorIcon,
  Visibility as ViewerIcon,
  Send as SendIcon,
} from '@mui/icons-material';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('VIEWER');
  const [inviteMessage, setInviteMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
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
        setAnchorEl(null);
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
        setAnchorEl(null);
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <AdminIcon fontSize="small" />;
      case 'EDITOR':
        return <EditorIcon fontSize="small" />;
      case 'VIEWER':
      default:
        return <ViewerIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'EDITOR':
        return 'primary';
      case 'VIEWER':
        return 'default';
      default:
        return 'default';
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Team Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your team members and their permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setInviteDialogOpen(true)}
          size="large"
        >
          Invite Member
        </Button>
      </Box>

      {/* Team Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <GroupIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                Total Members
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={600}>
              {members.filter(m => m.status === 'active').length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SendIcon color="info" />
              <Typography variant="body2" color="text.secondary">
                Pending Invites
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={600}>
              {members.filter(m => m.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AdminIcon color="error" />
              <Typography variant="body2" color="text.secondary">
                Administrators
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={600}>
              {members.filter(m => m.role === 'ADMIN').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Plan Upgrade Notice */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Business Plan</strong> - You can have up to 10 team members. Need more? 
          <Button size="small" sx={{ ml: 1 }}>Upgrade to Enterprise</Button>
        </Typography>
      </Alert>

      {/* Members Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : members.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <GroupIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No team members yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Invite your first team member to start collaborating
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setInviteDialogOpen(true)}
            >
              Invite Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={member.avatar} sx={{ bgcolor: 'primary.main' }}>
                          {getInitials(member.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(member.role)}
                        label={member.role}
                        size="small"
                        color={getRoleColor(member.role)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        size="small"
                        color={member.status === 'active' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {member.lastActive
                          ? new Date(member.lastActive).toLocaleDateString()
                          : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedMember(member);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            Change Role To:
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => selectedMember && handleUpdateRole(selectedMember.id, 'ADMIN')}>
          <AdminIcon fontSize="small" sx={{ mr: 1 }} />
          Admin
        </MenuItem>
        <MenuItem onClick={() => selectedMember && handleUpdateRole(selectedMember.id, 'EDITOR')}>
          <EditorIcon fontSize="small" sx={{ mr: 1 }} />
          Editor
        </MenuItem>
        <MenuItem onClick={() => selectedMember && handleUpdateRole(selectedMember.id, 'VIEWER')}>
          <ViewerIcon fontSize="small" sx={{ mr: 1 }} />
          Viewer
        </MenuItem>
        <MenuItem
          onClick={() => selectedMember && handleRemoveMember(selectedMember.id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Remove from Team
        </MenuItem>
      </Menu>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            required
            helperText="Enter the email address of the person you want to invite"
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={inviteRole}
              label="Role"
              onChange={(e) => setInviteRole(e.target.value as any)}
            >
              <MenuItem value="VIEWER">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ViewerIcon fontSize="small" />
                  <Box>
                    <Typography variant="body2">Viewer</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can view QR codes and analytics
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="EDITOR">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EditorIcon fontSize="small" />
                  <Box>
                    <Typography variant="body2">Editor</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can create and edit QR codes
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="ADMIN">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdminIcon fontSize="small" />
                  <Box>
                    <Typography variant="body2">Admin</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Full access to all features
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Personal Message (Optional)"
            multiline
            rows={3}
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
            helperText="Add a personal message to the invitation email"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleInvite}
            disabled={!inviteEmail || submitting}
          >
            {submitting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
