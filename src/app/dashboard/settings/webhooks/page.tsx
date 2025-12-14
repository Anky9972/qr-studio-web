'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Alert,
    Tooltip,
    Switch,
    FormControlLabel,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
import {
    Add,
    Delete,
    Edit,
    PlayArrow,
    Visibility,
    Check,
    Close,
    ContentCopy,
    Refresh,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';

interface Webhook {
    id: string;
    url: string;
    events: string[];
    secret: string;
    active: boolean;
    lastUsedAt: string | null;
    failureCount: number;
    createdAt: string;
}

interface WebhookLog {
    id: string;
    webhookId: string;
    event: string;
    payload: Record<string, unknown>;
    response: Record<string, unknown> | null;
    statusCode: number | null;
    success: boolean;
    attempt: number;
    error: string | null;
    createdAt: string;
}

const AVAILABLE_EVENTS = [
    { value: 'qr.created', label: 'QR Code Created' },
    { value: 'qr.updated', label: 'QR Code Updated' },
    { value: 'qr.deleted', label: 'QR Code Deleted' },
    { value: 'qr.scanned', label: 'QR Code Scanned' },
    { value: 'campaign.created', label: 'Campaign Created' },
    { value: 'campaign.updated', label: 'Campaign Updated' },
];

export default function WebhooksSettingsPage() {
    const { data: session } = useSession();
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [logs, setLogs] = useState<WebhookLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [openLogsDialog, setOpenLogsDialog] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
    const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null);

    // Form states
    const [formUrl, setFormUrl] = useState('');
    const [formEvents, setFormEvents] = useState<string[]>([]);
    const [formActive, setFormActive] = useState(true);

    // Status
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [testing, setTesting] = useState<string | null>(null);

    const fetchWebhooks = useCallback(async () => {
        try {
            const response = await fetch('/api/webhooks');
            if (response.ok) {
                const data = await response.json();
                setWebhooks(data.webhooks || []);
            }
        } catch (err) {
            console.error('Failed to fetch webhooks:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLogs = useCallback(async (webhookId: string) => {
        try {
            const response = await fetch(`/api/webhooks/${webhookId}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs || []);
            }
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        }
    }, []);

    useEffect(() => {
        fetchWebhooks();
    }, [fetchWebhooks]);

    const handleOpenDialog = (webhook?: Webhook) => {
        if (webhook) {
            setEditingWebhook(webhook);
            setFormUrl(webhook.url);
            setFormEvents(webhook.events);
            setFormActive(webhook.active);
        } else {
            setEditingWebhook(null);
            setFormUrl('');
            setFormEvents([]);
            setFormActive(true);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingWebhook(null);
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        if (!formUrl || formEvents.length === 0) {
            setError('URL and at least one event are required');
            return;
        }

        try {
            const method = editingWebhook ? 'PATCH' : 'POST';
            const url = editingWebhook ? `/api/webhooks/${editingWebhook.id}` : '/api/webhooks';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: formUrl,
                    events: formEvents,
                    active: formActive,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save webhook');
            }

            setSuccess(editingWebhook ? 'Webhook updated!' : 'Webhook created!');
            handleCloseDialog();
            fetchWebhooks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this webhook?')) return;

        try {
            const response = await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');

            setSuccess('Webhook deleted!');
            fetchWebhooks();
        } catch (err) {
            setError('Failed to delete webhook');
        }
    };

    const handleTest = async (id: string) => {
        setTesting(id);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/webhooks/${id}/test`, { method: 'POST' });
            const data = await response.json();

            if (response.ok) {
                setSuccess(`Test sent! Response: ${data.statusCode}`);
            } else {
                setError(data.error || 'Test failed');
            }
        } catch (err) {
            setError('Failed to send test');
        } finally {
            setTesting(null);
        }
    };

    const handleViewLogs = (webhookId: string) => {
        setSelectedWebhookId(webhookId);
        fetchLogs(webhookId);
        setOpenLogsDialog(true);
    };

    const copySecret = (secret: string) => {
        navigator.clipboard.writeText(secret);
        setSuccess('Secret copied!');
        setTimeout(() => setSuccess(null), 2000);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Webhooks
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Receive real-time notifications when events happen
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Webhook
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Webhooks" />
                <Tab label="Documentation" />
            </Tabs>

            {tabValue === 0 && (
                <Card>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Events</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Last Used</TableCell>
                                    <TableCell>Failures</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {webhooks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography color="text.secondary">
                                                No webhooks configured yet
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    webhooks.map((webhook) => (
                                        <TableRow key={webhook.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            maxWidth: 250,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            fontFamily: 'monospace',
                                                            fontSize: '0.875rem',
                                                        }}
                                                    >
                                                        {webhook.url}
                                                    </Typography>
                                                    <Tooltip title="Copy secret">
                                                        <IconButton size="small" onClick={() => copySecret(webhook.secret)}>
                                                            <ContentCopy fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {webhook.events.slice(0, 2).map((event) => (
                                                        <Chip key={event} label={event} size="small" />
                                                    ))}
                                                    {webhook.events.length > 2 && (
                                                        <Chip label={`+${webhook.events.length - 2}`} size="small" variant="outlined" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={webhook.active ? <Check /> : <Close />}
                                                    label={webhook.active ? 'Active' : 'Inactive'}
                                                    color={webhook.active ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {webhook.lastUsedAt
                                                    ? new Date(webhook.lastUsedAt).toLocaleDateString()
                                                    : 'Never'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={webhook.failureCount}
                                                    color={webhook.failureCount > 5 ? 'error' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Test webhook">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleTest(webhook.id)}
                                                        disabled={testing === webhook.id}
                                                    >
                                                        {testing === webhook.id ? (
                                                            <CircularProgress size={20} />
                                                        ) : (
                                                            <PlayArrow />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View logs">
                                                    <IconButton size="small" onClick={() => handleViewLogs(webhook.id)}>
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => handleOpenDialog(webhook)}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(webhook.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {tabValue === 1 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Webhook Documentation
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Webhooks allow you to receive real-time HTTP POST requests when events occur in your account.
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Available Events
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            {AVAILABLE_EVENTS.map((event) => (
                                <Chip key={event.value} label={`${event.value} - ${event.label}`} sx={{ m: 0.5 }} />
                            ))}
                        </Box>

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Signature Verification
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Each webhook request includes an <code>X-QRStudio-Signature</code> header containing
                            an HMAC-SHA256 signature. Verify this signature using your webhook secret to ensure
                            the request is authentic.
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Retry Policy
                        </Typography>
                        <Typography variant="body2">
                            Failed webhook deliveries are retried up to 3 times with exponential backoff (2s, 4s, 8s).
                            Webhooks are automatically deactivated after 10 consecutive failures.
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingWebhook ? 'Edit Webhook' : 'Create Webhook'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Webhook URL"
                        type="url"
                        fullWidth
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        placeholder="https://your-server.com/webhook"
                        sx={{ mt: 1 }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Events</InputLabel>
                        <Select
                            multiple
                            value={formEvents}
                            onChange={(e) => setFormEvents(e.target.value as string[])}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} size="small" />
                                    ))}
                                </Box>
                            )}
                        >
                            {AVAILABLE_EVENTS.map((event) => (
                                <MenuItem key={event.value} value={event.value}>
                                    <Checkbox checked={formEvents.indexOf(event.value) > -1} />
                                    <ListItemText primary={event.label} secondary={event.value} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Switch checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
                        }
                        label="Active"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingWebhook ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Logs Dialog */}
            <Dialog open={openLogsDialog} onClose={() => setOpenLogsDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Webhook Logs
                        <IconButton onClick={() => selectedWebhookId && fetchLogs(selectedWebhookId)}>
                            <Refresh />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Event</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Attempt</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Error</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                                            No logs yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Chip label={log.event} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.success ? `${log.statusCode}` : 'Failed'}
                                                    color={log.success ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{log.attempt}</TableCell>
                                            <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>
                                                {log.error && (
                                                    <Typography variant="caption" color="error">
                                                        {log.error.substring(0, 50)}...
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
