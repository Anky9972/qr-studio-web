'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Switch,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Download,
  Delete,
  Security,
  Cookie,
  Visibility,
  VisibilityOff,
  Warning
} from '@mui/icons-material';

export default function PrivacySettingsPage() {
  const [analyticsConsent, setAnalyticsConsent] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('analytics-consent') === 'true'
      : true
  );
  const [marketingConsent, setMarketingConsent] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('marketing-consent') === 'true'
      : false
  );

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAnalyticsToggle = (checked: boolean) => {
    setAnalyticsConsent(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics-consent', checked.toString());
    }
  };

  const handleMarketingToggle = (checked: boolean) => {
    setMarketingConsent(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem('marketing-consent', checked.toString());
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/export-data');
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `qrstudio-data-export-${Date.now()}.json`;

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('Data exported successfully');
      setExportDialogOpen(false);
    } catch (err) {
      setError('Failed to export data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');

    try {
      // First, check if account can be deleted
      const checkResponse = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmEmail })
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        throw new Error(checkData.error || 'Failed to check account status');
      }

      if (!checkData.canDelete) {
        setError(checkData.warning);
        setLoading(false);
        return;
      }

      // Proceed with deletion
      const deleteResponse = await fetch('/api/user/delete-account', {
        method: 'DELETE'
      });

      if (!deleteResponse.ok) {
        const deleteData = await deleteResponse.json();
        throw new Error(deleteData.error || 'Failed to delete account');
      }

      // Account deleted successfully - redirect to goodbye page
      window.location.href = '/goodbye?reason=account-deleted';
    } catch (err: any) {
      setError(err.message || 'Failed to delete account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Privacy Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your data privacy and GDPR rights
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Cookie Preferences */}
      <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Cookie color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Cookie Preferences
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Control how we use cookies and tracking technologies
          </Typography>

          <List>
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Essential Cookies
                    </Typography>
                    <Chip label="Required" size="small" color="default" />
                  </Box>
                }
                secondary="Required for the website to function properly. Cannot be disabled."
              />
              <Switch checked disabled />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem disableGutters>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    Analytics Cookies
                  </Typography>
                }
                secondary="Help us understand how you use our service to improve it."
              />
              <Switch
                checked={analyticsConsent}
                onChange={(e) => handleAnalyticsToggle(e.target.checked)}
              />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem disableGutters>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    Marketing Cookies
                  </Typography>
                }
                secondary="Used to show you relevant advertisements and marketing content."
              />
              <Switch
                checked={marketingConsent}
                onChange={(e) => handleMarketingToggle(e.target.checked)}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Security color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Your Data Rights
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Exercise your GDPR rights to access and control your personal data
          </Typography>

          <Box sx={{ display: 'grid', gap: 2 }}>
            {/* Export Data */}
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Export Your Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Download a complete copy of all your data in JSON format (GDPR Right to Data Portability)
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => setExportDialogOpen(true)}
                    sx={{ flexShrink: 0, ml: 2 }}
                  >
                    Export
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card
              variant="outlined"
              sx={{
                bgcolor: 'error.main',
                color: 'error.contrastText',
                borderColor: 'error.dark'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Delete Your Account
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Permanently delete your account and all associated data (GDPR Right to Erasure)
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      flexShrink: 0,
                      ml: 2,
                      borderColor: 'error.contrastText',
                      color: 'error.contrastText',
                      '&:hover': {
                        borderColor: 'error.contrastText',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>

      {/* GDPR Information */}
      <Alert severity="info" icon={<Security />}>
        <Typography variant="body2">
          Learn more about our GDPR compliance and your rights in our{' '}
          <a href="/legal/gdpr" target="_blank" rel="noopener" style={{ color: 'inherit', fontWeight: 'bold' }}>
            GDPR Compliance Page
          </a>
        </Typography>
      </Alert>

      {/* Export Data Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will download a JSON file containing all your personal data including:
          </Typography>
          <List dense>
            <ListItem disableGutters>
              <ListItemText primary="• Account information" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="• QR codes and designs" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="• Scan analytics" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="• Team memberships" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="• API keys (partial)" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="• Webhooks and logs" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <Download />}
            onClick={handleExportData}
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Download Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !loading && setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <Warning />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              This action is permanent and cannot be undone!
            </Typography>
            <Typography variant="body2">
              All your data will be permanently deleted including QR codes, analytics, and team memberships.
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To confirm deletion, please type your email address:
          </Typography>

          <TextField
            fullWidth
            placeholder="your@email.com"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={16} /> : <Delete />}
            onClick={handleDeleteAccount}
            disabled={loading || !confirmEmail}
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
