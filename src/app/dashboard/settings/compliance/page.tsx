'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Stack,
  TextField,
  Button,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Security,
  Download,
  Delete,
  Info,
  Visibility,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
}

interface ComplianceSettings {
  gdprMode: boolean;
  dataRetentionDays: number;
  anonymizeScans: boolean;
  allowDataExport: boolean;
  allowDataDeletion: boolean;
  cookieConsentRequired: boolean;
}

export default function CompliancePage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<ComplianceSettings>({
    gdprMode: false,
    dataRetentionDays: 365,
    anonymizeScans: false,
    allowDataExport: true,
    allowDataDeletion: true,
    cookieConsentRequired: true,
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchComplianceData();
    }
  }, [status]);

  const fetchComplianceData = async () => {
    try {
      const [settingsRes, logsRes] = await Promise.all([
        fetch('/api/compliance/settings'),
        fetch('/api/compliance/audit-logs?limit=50'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }

      if (logsRes.ok) {
        const data = await logsRes.json();
        setAuditLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/compliance/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save settings');
      }
    } catch (error) {
      setSaveMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/compliance/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-studio-data-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const handleDeleteAllData = async () => {
    try {
      const response = await fetch('/api/compliance/delete-all', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('All data deleted successfully. You will be logged out.');
        window.location.href = '/api/auth/signout';
      }
    } catch (error) {
      console.error('Failed to delete data:', error);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <CheckCircle fontSize="small" color="success" />;
      case 'UPDATE':
        return <Info fontSize="small" color="info" />;
      case 'DELETE':
        return <ErrorIcon fontSize="small" color="error" />;
      case 'VIEW':
        return <Visibility fontSize="small" color="action" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'info';
      case 'DELETE':
        return 'error';
      case 'VIEW':
        return 'default';
      case 'EXPORT':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
          Compliance & Privacy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage GDPR compliance, data retention, and audit logs
        </Typography>
      </Box>

      {saveMessage && (
        <Alert severity={saveMessage.includes('success') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      {/* GDPR & Privacy Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Privacy Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Configure how your data is collected and stored
          </Typography>

          <Stack spacing={2} sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.gdprMode}
                  onChange={(e) =>
                    setSettings({ ...settings, gdprMode: e.target.checked })
                  }
                />
              }
              label={
                <Box>
                  <Typography variant="body1">GDPR Mode</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable enhanced privacy protections and data anonymization
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.anonymizeScans}
                  onChange={(e) =>
                    setSettings({ ...settings, anonymizeScans: e.target.checked })
                  }
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Anonymize Scan Data</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Don't store IP addresses or precise location data from scans
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.cookieConsentRequired}
                  onChange={(e) =>
                    setSettings({ ...settings, cookieConsentRequired: e.target.checked })
                  }
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Cookie Consent Banner</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Show cookie consent banner to visitors
                  </Typography>
                </Box>
              }
            />

            <TextField
              label="Data Retention Period (days)"
              type="number"
              value={settings.dataRetentionDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dataRetentionDays: parseInt(e.target.value) || 365,
                })
              }
              helperText="Automatically delete scan data after this many days (minimum 30, maximum 3650)"
              inputProps={{ min: 30, max: 3650 }}
              fullWidth
            />

            <Box>
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Data Export & Deletion */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Data Management
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Export or delete your personal data
          </Typography>

          <Stack spacing={2} sx={{ mt: 3 }}>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportData}
                fullWidth
              >
                Export All My Data
              </Button>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Download a complete copy of your data in JSON format
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth
              >
                Delete All My Data
              </Button>
              <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                Permanently delete your account and all associated data
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Audit Log
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Recent activity and data access history
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity Type</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No audit logs yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Chip
                          icon={getActionIcon(log.action)}
                          label={log.action}
                          size="small"
                          color={getActionColor(log.action) as any}
                        />
                      </TableCell>
                      <TableCell>{log.entityType}</TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {settings.anonymizeScans ? '•••.•••.•••.•••' : log.ipAddress || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {log.entityId && (
                          <Tooltip title={`Entity ID: ${log.entityId}`}>
                            <IconButton size="small">
                              <Info fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete All Data?</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography variant="body2">
            This will permanently delete:
          </Typography>
          <ul>
            <li>All QR codes you've created</li>
            <li>All scan analytics and history</li>
            <li>All templates and campaigns</li>
            <li>Your user account and settings</li>
          </ul>
          <Typography variant="body2" fontWeight="bold">
            Are you absolutely sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              handleDeleteAllData();
            }}
            color="error"
            variant="contained"
          >
            Yes, Delete Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
