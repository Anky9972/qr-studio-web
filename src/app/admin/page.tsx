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
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Campaign as CampaignIcon,
  Email as EmailIcon,
  LocalOffer as OfferIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [qrCodes, setQRCodes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [qrCodesPage, setQRCodesPage] = useState(1);
  const [qrCodesTotalPages, setQRCodesTotalPages] = useState(1);
  
  // Search filters
  const [usersSearch, setUsersSearch] = useState('');
  const [qrCodesSearch, setQRCodesSearch] = useState('');
  
  // Dialogs
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  // Forms
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    type: 'info',
    active: true,
    targetAudience: 'all',
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discountPercent: 0,
    couponCode: '',
    validFrom: '',
    validUntil: '',
    targetPlan: 'all',
    active: true,
  });

  const [emailForm, setEmailForm] = useState({
    subject: '',
    body: '',
    recipients: 'all',
    sendAt: '',
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQRCodes: 0,
    totalScans: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch admin statistics
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }

      // Fetch announcements
      const announcementsResponse = await fetch('/api/admin/announcements');
      if (announcementsResponse.ok) {
        const data = await announcementsResponse.json();
        setAnnouncements(data.announcements);
      }

      // Fetch offers
      const offersResponse = await fetch('/api/admin/offers');
      if (offersResponse.ok) {
        const data = await offersResponse.json();
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementForm),
      });

      if (response.ok) {
        setAnnouncementDialogOpen(false);
        setAnnouncementForm({
          title: '',
          message: '',
          type: 'info',
          active: true,
          targetAudience: 'all',
        });
        fetchAdminData();
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  const handleCreateOffer = async () => {
    try {
      const response = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerForm),
      });

      if (response.ok) {
        setOfferDialogOpen(false);
        setOfferForm({
          title: '',
          description: '',
          discountPercent: 0,
          couponCode: '',
          validFrom: '',
          validUntil: '',
          targetPlan: 'all',
          active: true,
        });
        fetchAdminData();
      }
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  };

  const handleSendEmail = async () => {
    if (!confirm('Are you sure you want to send this email to all selected recipients?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setEmailDialogOpen(false);
        setEmailForm({
          subject: '',
          body: '',
          recipients: 'all',
          sendAt: '',
        });
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage system settings, announcements, offers, and communications
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>
                {stats.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.main">
                {stats.activeUsers} active
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DashboardIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  QR Codes
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>
                {stats.totalQRCodes.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AnalyticsIcon color="info" />
                <Typography variant="body2" color="text.secondary">
                  Total Scans
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>
                {stats.totalScans.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Revenue (MRR)
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>
                ${stats.revenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
          <Tab icon={<CampaignIcon />} label="Announcements" />
          <Tab icon={<OfferIcon />} label="Offers & Deals" />
          <Tab icon={<EmailIcon />} label="Email Campaigns" />
        </Tabs>

        {/* Announcements Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Manage Announcements</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAnnouncementDialogOpen(true)}
            >
              New Announcement
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>{announcement.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={announcement.type}
                        size="small"
                        color={
                          announcement.type === 'success' ? 'success' :
                          announcement.type === 'warning' ? 'warning' :
                          announcement.type === 'error' ? 'error' : 'info'
                        }
                      />
                    </TableCell>
                    <TableCell>{announcement.targetAudience}</TableCell>
                    <TableCell>
                      <Chip
                        label={announcement.active ? 'Active' : 'Inactive'}
                        size="small"
                        color={announcement.active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Offers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Manage Offers & Deals</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOfferDialogOpen(true)}
            >
              New Offer
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Coupon Code</TableCell>
                  <TableCell>Valid Until</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>{offer.title}</TableCell>
                    <TableCell>{offer.discountPercent}%</TableCell>
                    <TableCell>
                      <code>{offer.couponCode}</code>
                    </TableCell>
                    <TableCell>
                      {new Date(offer.validUntil).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={offer.active ? 'Active' : 'Inactive'}
                        size="small"
                        color={offer.active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Email Campaigns Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Send Email Campaigns</Typography>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => setEmailDialogOpen(true)}
            >
              Compose Email
            </Button>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>SMTP Server Configuration Required:</strong> Configure your SMTP settings in the environment variables before sending emails.
            </Typography>
          </Alert>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SMTP Configuration
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField label="SMTP Host" placeholder="smtp.example.com" fullWidth />
                <TextField label="SMTP Port" placeholder="587" type="number" fullWidth />
                <TextField label="SMTP Username" placeholder="user@example.com" fullWidth />
                <TextField label="SMTP Password" type="password" fullWidth />
                <FormControlLabel
                  control={<Switch />}
                  label="Enable TLS/SSL"
                />
                <Button variant="outlined">Test Connection</Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Card>

      {/* Create Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onClose={() => setAnnouncementDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Announcement</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={announcementForm.title}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Message"
            value={announcementForm.message}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            required
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={announcementForm.type}
              label="Type"
              onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value })}
            >
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="error">Error</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Target Audience</InputLabel>
            <Select
              value={announcementForm.targetAudience}
              label="Target Audience"
              onChange={(e) => setAnnouncementForm({ ...announcementForm, targetAudience: e.target.value })}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="free">Free Users</MenuItem>
              <MenuItem value="pro">Pro Users</MenuItem>
              <MenuItem value="business">Business Users</MenuItem>
              <MenuItem value="enterprise">Enterprise Users</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={announcementForm.active}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, active: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnnouncementDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAnnouncement} disabled={!announcementForm.title || !announcementForm.message}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Offer Dialog */}
      <Dialog open={offerDialogOpen} onClose={() => setOfferDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Offer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={offerForm.title}
            onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            value={offerForm.description}
            onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Discount Percentage"
            type="number"
            value={offerForm.discountPercent}
            onChange={(e) => setOfferForm({ ...offerForm, discountPercent: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Coupon Code"
            value={offerForm.couponCode}
            onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value.toUpperCase() })}
            sx={{ mb: 2 }}
            helperText="Auto-generated if left empty"
          />

          <TextField
            fullWidth
            label="Valid From"
            type="date"
            value={offerForm.validFrom}
            onChange={(e) => setOfferForm({ ...offerForm, validFrom: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Valid Until"
            type="date"
            value={offerForm.validUntil}
            onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            required
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Target Plan</InputLabel>
            <Select
              value={offerForm.targetPlan}
              label="Target Plan"
              onChange={(e) => setOfferForm({ ...offerForm, targetPlan: e.target.value })}
            >
              <MenuItem value="all">All Plans</MenuItem>
              <MenuItem value="pro">Pro Only</MenuItem>
              <MenuItem value="business">Business Only</MenuItem>
              <MenuItem value="enterprise">Enterprise Only</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={offerForm.active}
                onChange={(e) => setOfferForm({ ...offerForm, active: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOffer} disabled={!offerForm.title || !offerForm.validUntil}>
            Create Offer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Compose Email Campaign</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            value={emailForm.subject}
            onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Email Body"
            value={emailForm.body}
            onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
            multiline
            rows={10}
            sx={{ mb: 2 }}
            required
            helperText="Supports HTML formatting"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Recipients</InputLabel>
            <Select
              value={emailForm.recipients}
              label="Recipients"
              onChange={(e) => setEmailForm({ ...emailForm, recipients: e.target.value })}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="free">Free Users Only</MenuItem>
              <MenuItem value="pro">Pro Users Only</MenuItem>
              <MenuItem value="business">Business Users Only</MenuItem>
              <MenuItem value="enterprise">Enterprise Users Only</MenuItem>
              <MenuItem value="inactive">Inactive Users (30+ days)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Schedule Send (Optional)"
            type="datetime-local"
            value={emailForm.sendAt}
            onChange={(e) => setEmailForm({ ...emailForm, sendAt: e.target.value })}
            InputLabelProps={{ shrink: true }}
            helperText="Leave empty to send immediately"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={handleSendEmail}
            disabled={!emailForm.subject || !emailForm.body}
          >
            {emailForm.sendAt ? 'Schedule' : 'Send Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
