'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyIcon from '@mui/icons-material/Key'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import { usePreferencesStore } from '@/store/preferencesStore'

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  }
}

export default function SettingsPage() {
  const [tab, setTab] = useState(0)
  const prefs = usePreferencesStore(state => state.preferences)
  const updatePreferences = usePreferencesStore(state => state.updatePreferences)

  // Profile form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [userPlan, setUserPlan] = useState('')
  const [joinedDate, setJoinedDate] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true)
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setName(data.user.name || '')
        setEmail(data.user.email || '')
        setAvatarPreview(data.user.image || null)
        setUserPlan(data.user.subscription || data.user.plan || 'FREE')
        setJoinedDate(data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : '')
      } else {
        console.error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setAvatarFile(f)
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(String(reader.result))
    reader.readAsDataURL(f)
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      alert('Name is required')
      return
    }

    if (!email.trim()) {
      alert('Email is required')
      return
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, image: avatarPreview }),
      });

      if (response.ok) {
        alert('Profile updated successfully');
        fetchUserProfile() // Refresh profile data
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  }

  // Security
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert('Please enter both current and new passwords');
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password');
    }
  }

  // API Keys (connected to real API)
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; keyPrefix: string; name: string; createdAt: string; lastUsedAt: string | null; expiresAt: string | null }>>([])
  const [newKeyData, setNewKeyData] = useState<{ key: string; name: string } | null>(null)
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyExpiration, setNewKeyExpiration] = useState<number | ''>('')

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookEnabled, setWebhookEnabled] = useState(true)
  const [webhookTesting, setWebhookTesting] = useState(false)
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [openWebhookDialog, setOpenWebhookDialog] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['qr.bulk.completed'])

  // Available webhook events
  const WEBHOOK_EVENTS = [
    { value: 'qr.bulk.completed', label: 'Bulk QR Generation Completed' },
    { value: 'qr.export.completed', label: 'Large Export Completed' },
    { value: 'campaign.milestone', label: 'Campaign Milestone Reached' },
    { value: 'scan.threshold', label: 'Scan Threshold Reached' },
  ]

  useEffect(() => {
    fetchApiKeys()
    fetchWebhooks()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys || [])
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
    }
  }

  const generateApiKey = async () => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName || 'Unnamed Key',
          expiresIn: newKeyExpiration || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewKeyData({ key: data.key, name: data.apiKey.name })
        setCreateKeyDialogOpen(false)
        setNewKeyName('')
        setNewKeyExpiration('')
        fetchApiKeys() // Refresh list
      } else {
        console.error('Failed to create API key')
      }
    } catch (error) {
      console.error('Failed to generate API key:', error)
    }
  }

  const revokeApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setApiKeys(prev => prev.filter(k => k.id !== id))
      } else {
        console.error('Failed to revoke API key')
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error)
    }
  }

  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
    } catch (e) {
      console.error('copy failed', e)
    }
  }

  // Webhook functions
  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/webhooks')
      if (response.ok) {
        const data = await response.json()
        setWebhooks(data.webhooks || [])
      }
    } catch (error) {
      console.error('Failed to fetch webhooks:', error)
    }
  }

  const testWebhook = async () => {
    if (!webhookUrl) return
    
    setWebhookTesting(true)
    setWebhookTestResult(null)
    
    try {
      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: webhookUrl,
          event: 'qr.bulk.completed',
          payload: {
            qrCount: 100,
            format: 'zip',
            status: 'completed'
          }
        }),
      })
      
      const data = await response.json()
      setWebhookTestResult({
        success: data.success || false,
        message: data.message || (response.ok ? 'Webhook test successful!' : 'Webhook test failed')
      })
    } catch (error) {
      setWebhookTestResult({
        success: false,
        message: 'Failed to test webhook - network error'
      })
    } finally {
      setWebhookTesting(false)
    }
  }

  const createWebhook = async () => {
    if (!webhookUrl || selectedEvents.length === 0) {
      alert('Please enter a webhook URL and select at least one event')
      return
    }

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: webhookUrl, 
          events: selectedEvents 
        }),
      })
      
      if (response.ok) {
        setWebhookUrl('')
        setSelectedEvents(['qr.bulk.completed'])
        setOpenWebhookDialog(false)
        fetchWebhooks()
        alert('Webhook created successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create webhook')
      }
    } catch (error) {
      console.error('Failed to create webhook:', error)
      alert('Failed to create webhook')
    }
  }

  const deleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return

    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchWebhooks()
        alert('Webhook deleted successfully')
      } else {
        alert('Failed to delete webhook')
      }
    } catch (error) {
      console.error('Failed to delete webhook:', error)
      alert('Failed to delete webhook')
    }
  }

  const toggleWebhook = async (webhookId: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })
      
      if (response.ok) {
        fetchWebhooks()
      } else {
        alert('Failed to toggle webhook')
      }
    } catch (error) {
      console.error('Failed to toggle webhook:', error)
      alert('Failed to toggle webhook')
    }
  }

  // Preferences
  const [localPrefs, setLocalPrefs] = useState(prefs)

  useEffect(() => setLocalPrefs(prefs), [prefs])

  const savePreferences = () => updatePreferences(localPrefs)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Settings</Typography>
          <Typography color="text.secondary">Manage your profile, security, API keys, and preferences</Typography>
        </Box>
      </Box>

      <Paper>
        <Tabs value={tab} onChange={handleTabChange} aria-label="settings tabs">
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Security" {...a11yProps(1)} />
          <Tab label="API Keys" {...a11yProps(2)} />
          <Tab label="Webhooks" {...a11yProps(3)} />
          <Tab label="Preferences" {...a11yProps(4)} />
          <Tab label="Billing" {...a11yProps(5)} />
        </Tabs>

        <Box sx={{ p: 3 }} role={`settings-tabpanel-${0}`} hidden={tab !== 0}>
          {tab === 0 && (
              <Box>
                {profileLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Typography color="text.secondary">Loading profile...</Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                      <Box sx={{ flex: '1 1 320px', minWidth: 240 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Avatar src={avatarPreview || undefined} sx={{ width: 120, height: 120, mb: 2 }}>
                            {!avatarPreview && name ? name.charAt(0).toUpperCase() : '?'}
                          </Avatar>
                          <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                            Upload Avatar
                            <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                          </Button>
                          <Typography variant="caption" color="text.secondary">
                            JPG, PNG or GIF (max 2MB)
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ flex: '2 1 480px', minWidth: 280 }}>
                        <TextField 
                          fullWidth 
                          label="Full name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          sx={{ mb: 2 }}
                          required
                          helperText="Your display name visible to others"
                        />
                        <TextField 
                          fullWidth 
                          label="Email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          sx={{ mb: 2 }}
                          type="email"
                          required
                          helperText="Used for notifications and account recovery"
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button variant="contained" onClick={handleSaveProfile}>Save Profile</Button>
                          <Button variant="outlined" color="inherit">Disconnect OAuth</Button>
                        </Box>
                      </Box>
                    </Box>

                    {/* Account Information */}
                    <Card variant="outlined" sx={{ mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Account Information</Typography>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Current Plan</Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {userPlan.toUpperCase()}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Member Since</Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {joinedDate || 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Account ID</Typography>
                            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                              {email ? email.substring(0, 20) + '...' : 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Status</Typography>
                            <Chip label="Active" size="small" color="success" />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </>
                )}
              </Box>
            )}
        </Box>

        <Box sx={{ p: 3 }} role={`settings-tabpanel-${1}`} hidden={tab !== 1}>
          {tab === 1 && (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 320px', minWidth: 260 }}>
                <Typography variant="h6">Change Password</Typography>
                <TextField fullWidth label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} sx={{ mt: 2 }} />
                <TextField fullWidth label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{ mt: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={handleChangePassword}>Change Password</Button>
                </Box>
              </Box>

              <Box sx={{ flex: '1 1 320px', minWidth: 260 }}>
                <Typography variant="h6">Two-Factor Authentication</Typography>
                <Typography color="text.secondary">Enable TOTP-based 2FA for added account security.</Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel control={<Switch checked={twoFAEnabled} onChange={(e) => setTwoFAEnabled(e.target.checked)} />} label={twoFAEnabled ? 'Enabled' : 'Disabled'} />
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3 }} role={`settings-tabpanel-${2}`} hidden={tab !== 2}>
          {tab === 2 && (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 640px', minWidth: 280 }}>
                <Typography variant="h6">API Keys</Typography>
                <Typography color="text.secondary">Create and manage API keys used by scripts and integrations. Treat keys like passwords.</Typography>

                {newKeyData && (
                  <Alert severity="success" sx={{ mt: 2, mb: 2 }} icon={<CheckCircleIcon />}>
                    <AlertTitle>API Key Created: {newKeyData.name}</AlertTitle>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Copy this key now. You won&apos;t be able to see it again!
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <code style={{ flex: 1, fontSize: '14px', wordBreak: 'break-all' }}>{newKeyData.key}</code>
                      <IconButton size="small" onClick={() => copyKey(newKeyData.key)} color="primary">
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Button size="small" onClick={() => setNewKeyData(null)} sx={{ mt: 1 }}>
                      I&apos;ve saved this key
                    </Button>
                  </Alert>
                )}

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Button variant="contained" startIcon={<KeyIcon />} onClick={() => setCreateKeyDialogOpen(true)}>Create new key</Button>
                </Box>

                {apiKeys.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <KeyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="text.secondary">No API keys yet. Create one to get started.</Typography>
                  </Box>
                ) : (
                  <List>
                    {apiKeys.map(k => (
                      <ListItem key={k.id} divider>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontFamily="monospace">{k.keyPrefix}</Typography>
                              <Typography variant="caption" color="text.secondary">({k.name})</Typography>
                              {k.expiresAt && new Date(k.expiresAt) < new Date() && (
                                <Chip label="Expired" size="small" color="error" icon={<WarningIcon />} />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" display="block">
                                Created: {new Date(k.createdAt).toLocaleString()}
                              </Typography>
                              {k.lastUsedAt && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Last used: {new Date(k.lastUsedAt).toLocaleString()}
                                </Typography>
                              )}
                              {k.expiresAt && (
                                <Typography variant="caption" display="block" color={new Date(k.expiresAt) < new Date() ? 'error' : 'text.secondary'}>
                                  Expires: {new Date(k.expiresAt).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Copy prefix"><IconButton edge="end" onClick={() => copyKey(k.keyPrefix)}><ContentCopyIcon /></IconButton></Tooltip>
                          <Tooltip title="Revoke key"><IconButton edge="end" color="error" onClick={() => revokeApiKey(k.id)}><DeleteIcon /></IconButton></Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}

                <Alert severity="warning" sx={{ mt: 2 }}>
                  <AlertTitle>Security Notice</AlertTitle>
                  API keys are only shown once at creation. Store them securely. You can revoke and create new keys anytime.
                </Alert>
              </Box>
            </Box>
          )}
        </Box>

        {/* Create API Key Dialog */}
        <Dialog open={createKeyDialogOpen} onClose={() => setCreateKeyDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Key Name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Production Server"
              sx={{ mt: 2, mb: 2 }}
              helperText="Give this key a descriptive name to help you remember its purpose"
            />
            
            <FormControl fullWidth>
              <InputLabel>Expiration</InputLabel>
              <Select
                value={newKeyExpiration}
                label="Expiration"
                onChange={(e) => setNewKeyExpiration(e.target.value as number | '')}
              >
                <MenuItem value="">Never</MenuItem>
                <MenuItem value={30}>30 days</MenuItem>
                <MenuItem value={60}>60 days</MenuItem>
                <MenuItem value={90}>90 days</MenuItem>
                <MenuItem value={180}>180 days</MenuItem>
                <MenuItem value={365}>1 year</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateKeyDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={generateApiKey} disabled={!newKeyName.trim()}>
              Create Key
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ p: 3 }} role={`settings-tabpanel-${3}`} hidden={tab !== 3}>
          {tab === 3 && (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 640px', minWidth: 280 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>Webhook Notifications</Typography>
                    <Typography color="text.secondary">
                      Get notified when events occur in your QR Studio account
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => setOpenWebhookDialog(true)}
                  >
                    Create Webhook
                  </Button>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Webhook Events</AlertTitle>
                  Webhooks send HTTP POST requests to your endpoint when events occur, such as bulk operations completing or campaigns reaching milestones.
                </Alert>

                {webhooks.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography color="text.secondary" gutterBottom>
                      No webhooks configured
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a webhook to receive notifications about QR code events
                    </Typography>
                  </Paper>
                ) : (
                  <List>
                    {webhooks.map((webhook) => (
                      <Paper key={webhook.id} sx={{ mb: 2, p: 2 }}>
                        <ListItem
                          sx={{ px: 0 }}
                          secondaryAction={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Switch
                                checked={webhook.active}
                                onChange={() => toggleWebhook(webhook.id, webhook.active)}
                                size="small"
                              />
                              <Tooltip title="Delete">
                                <IconButton
                                  edge="end"
                                  onClick={() => deleteWebhook(webhook.id)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" component="span">
                                  {webhook.url}
                                </Typography>
                                {webhook.failureCount > 0 && (
                                  <Chip
                                    label={`${webhook.failureCount} failures`}
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary" component="div">
                                  Events: {webhook.events.join(', ')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Created: {new Date(webhook.createdAt).toLocaleDateString()}
                                  {webhook.lastUsedAt && ` • Last used: ${new Date(webhook.lastUsedAt).toLocaleDateString()}`}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                )}

                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Popular Services:</Typography>
                  <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
                    • <strong>Slack:</strong> Workspace Settings → Apps → Incoming Webhooks
                  </Typography>
                  <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
                    • <strong>Discord:</strong> Server Settings → Integrations → Webhooks
                  </Typography>
                  <Typography variant="caption" component="div">
                    • <strong>Microsoft Teams:</strong> Channel → Connectors → Incoming Webhook
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Create Webhook Dialog */}
        <Dialog open={openWebhookDialog} onClose={() => setOpenWebhookDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Webhook</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
              helperText="Enter your webhook endpoint URL (HTTPS required)"
              sx={{ mt: 2, mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Events</InputLabel>
              <Select
                multiple
                value={selectedEvents}
                onChange={(e) => setSelectedEvents(e.target.value as string[])}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={WEBHOOK_EVENTS.find(e => e.value === value)?.label || value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {WEBHOOK_EVENTS.map((event) => (
                  <MenuItem key={event.value} value={event.value}>
                    {event.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={testWebhook}
                disabled={!webhookUrl || webhookTesting}
                fullWidth
                sx={{ mb: 1 }}
              >
                {webhookTesting ? 'Testing...' : 'Test Webhook'}
              </Button>
              {webhookTestResult && (
                <Alert severity={webhookTestResult.success ? 'success' : 'error'}>
                  {webhookTestResult.message}
                </Alert>
              )}
            </Box>

            <Alert severity="info">
              The webhook will receive a JSON payload with event details when triggered.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenWebhookDialog(false)}>Cancel</Button>
            <Button onClick={createWebhook} variant="contained" disabled={!webhookUrl || selectedEvents.length === 0}>
              Create
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ p: 3 }} role={`settings-tabpanel-${4}`} hidden={tab !== 4}>
          {tab === 4 && (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Appearance</Typography>
                    <Box sx={{ mt: 2 }}>
                      <label style={{ display: 'block', marginBottom: 8 }}>Theme</label>
                      <select value={localPrefs.theme} onChange={(e) => setLocalPrefs({ ...localPrefs, theme: e.target.value as any })}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Scanning</Typography>
                    <FormControlLabel control={<Switch checked={localPrefs.autoCopy} onChange={(e) => setLocalPrefs({ ...localPrefs, autoCopy: e.target.checked })} />} label="Auto copy scanned text" />
                    <FormControlLabel control={<Switch checked={localPrefs.autoOpen} onChange={(e) => setLocalPrefs({ ...localPrefs, autoOpen: e.target.checked })} />} label="Auto open URLs after scan" />
                  </CardContent>
                </Card>

                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={savePreferences}>Save Preferences</Button>
                </Box>
              </Box>

              <Box sx={{ flex: '1 1 320px', minWidth: 260 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">History & Notifications</Typography>
                    <FormControlLabel control={<Switch checked={localPrefs.notificationsEnabled} onChange={(e) => setLocalPrefs({ ...localPrefs, notificationsEnabled: e.target.checked })} />} label="Enable notifications" />
                    <Box sx={{ mt: 1 }}>
                      <label>Max history items</label>
                      <input type="number" value={localPrefs.maxHistoryItems} onChange={(e) => setLocalPrefs({ ...localPrefs, maxHistoryItems: Number(e.target.value) })} style={{ width: 120 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3 }} role={`settings-tabpanel-${4}`} hidden={tab !== 4}>
          {tab === 4 && (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 640px', minWidth: 280 }}>
                <Typography variant="h6">Billing</Typography>
                <Typography color="text.secondary">Manage your subscription and billing details. Stripe integration will be added in production.</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined">Manage Subscription</Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
