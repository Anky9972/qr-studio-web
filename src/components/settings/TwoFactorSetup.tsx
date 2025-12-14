'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
} from '@mui/material';
import { Shield, ShieldCheck, QrCode, Key } from 'lucide-react';
import QRCode from 'qrcode';

export default function TwoFactorSetup() {
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [setupDialogOpen, setSetupDialogOpen] = useState(false);
    const [disableDialogOpen, setDisableDialogOpen] = useState(false);
    const [secret, setSecret] = useState('');
    const [totpUri, setTotpUri] = useState('');
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/auth/2fa/setup');
            if (response.ok) {
                const data = await response.json();
                setEnabled(data.enabled);
            }
        } catch (err) {
            console.error('Failed to fetch 2FA status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSetup = async () => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/2fa/setup', { method: 'POST' });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to setup 2FA');
            }

            setSecret(data.secret);
            setTotpUri(data.totpUri);

            // Generate QR code
            const qrDataUrl = await QRCode.toDataURL(data.totpUri, {
                width: 200,
                margin: 2,
                color: { dark: '#000000', light: '#ffffff' },
            });
            setQrCodeDataUrl(qrDataUrl);
            setSetupDialogOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to setup 2FA');
        } finally {
            setProcessing(false);
        }
    };

    const handleVerify = async () => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: verificationCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            setEnabled(true);
            setSuccess('Two-factor authentication enabled successfully!');
            setSetupDialogOpen(false);
            setVerificationCode('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleDisable = async () => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/2fa/setup', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: verificationCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to disable 2FA');
            }

            setEnabled(false);
            setSuccess('Two-factor authentication disabled');
            setDisableDialogOpen(false);
            setVerificationCode('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to disable 2FA');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {enabled ? (
                        <ShieldCheck className="w-8 h-8 text-green-500" />
                    ) : (
                        <Shield className="w-8 h-8 text-gray-400" />
                    )}
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Two-Factor Authentication
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Add an extra layer of security to your account
                        </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                        <Chip
                            label={enabled ? 'Enabled' : 'Disabled'}
                            color={enabled ? 'success' : 'default'}
                            size="small"
                        />
                    </Box>
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

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {enabled
                        ? 'Your account is protected with two-factor authentication. You will need to enter a code from your authenticator app when signing in.'
                        : 'Protect your account by requiring a verification code from your phone when signing in.'}
                </Typography>

                {enabled ? (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setDisableDialogOpen(true)}
                    >
                        Disable 2FA
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        startIcon={processing ? <CircularProgress size={20} /> : <Key className="w-4 h-4" />}
                        onClick={handleSetup}
                        disabled={processing}
                    >
                        Enable 2FA
                    </Button>
                )}

                {/* Setup Dialog */}
                <Dialog open={setupDialogOpen} onClose={() => setSetupDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
                    <DialogContent>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </Typography>

                            {qrCodeDataUrl && (
                                <Box sx={{ mb: 3 }}>
                                    <img src={qrCodeDataUrl} alt="2FA QR Code" style={{ margin: '0 auto' }} />
                                </Box>
                            )}

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                Or enter this code manually:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: 'monospace',
                                    bgcolor: 'action.hover',
                                    p: 1,
                                    borderRadius: 1,
                                    mb: 3,
                                }}
                            >
                                {secret}
                            </Typography>

                            <TextField
                                label="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                fullWidth
                                autoComplete="one-time-code"
                                inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                                placeholder="000000"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSetupDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleVerify}
                            variant="contained"
                            disabled={verificationCode.length !== 6 || processing}
                        >
                            {processing ? <CircularProgress size={20} /> : 'Verify & Enable'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Disable Dialog */}
                <Dialog open={disableDialogOpen} onClose={() => setDisableDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                    <DialogContent>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            This will make your account less secure. Are you sure?
                        </Alert>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Enter a code from your authenticator app to confirm:
                        </Typography>
                        <TextField
                            label="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            fullWidth
                            autoComplete="one-time-code"
                            inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                            placeholder="000000"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDisableDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleDisable}
                            variant="contained"
                            color="error"
                            disabled={verificationCode.length !== 6 || processing}
                        >
                            {processing ? <CircularProgress size={20} /> : 'Disable 2FA'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
}
