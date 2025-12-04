'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Grid,
  Switch,
  Stack,
} from '@mui/material';
import { Add, Delete, Edit, Code } from '@mui/icons-material';
import { PixelProvider } from '@/types/routing';
import { getPixelProviderName, getRecommendedDelay } from '@/lib/pixelManager';

interface PixelConfig {
  id: string;
  provider: PixelProvider;
  pixelId: string;
  events: string[];
  delayRedirect: number;
  active: boolean;
  scriptContent?: string;
}

interface PixelManagerProps {
  qrCodeId: string;
  pixels: PixelConfig[];
  onPixelAdd: (pixel: Omit<PixelConfig, 'id'>) => Promise<void>;
  onPixelUpdate: (pixelId: string, updates: Partial<PixelConfig>) => Promise<void>;
  onPixelDelete: (pixelId: string) => Promise<void>;
}

export default function PixelManager({
  qrCodeId,
  pixels,
  onPixelAdd,
  onPixelUpdate,
  onPixelDelete,
}: PixelManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPixel, setEditingPixel] = useState<PixelConfig | null>(null);
  const [provider, setProvider] = useState<PixelProvider>('facebook');
  const [pixelId, setPixelId] = useState('');
  const [events, setEvents] = useState<string[]>(['PageView']);
  const [delayRedirect, setDelayRedirect] = useState(1000);
  const [scriptContent, setScriptContent] = useState('');

  const handleOpenDialog = (pixel?: PixelConfig) => {
    if (pixel) {
      setEditingPixel(pixel);
      setProvider(pixel.provider);
      setPixelId(pixel.pixelId);
      setEvents(pixel.events);
      setDelayRedirect(pixel.delayRedirect);
      setScriptContent(pixel.scriptContent || '');
    } else {
      setEditingPixel(null);
      setProvider('facebook');
      setPixelId('');
      setEvents(['PageView']);
      setDelayRedirect(1000);
      setScriptContent('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPixel(null);
  };

  const handleProviderChange = (newProvider: PixelProvider) => {
    setProvider(newProvider);
    setDelayRedirect(getRecommendedDelay(newProvider));
    
    // Set default events based on provider
    if (newProvider === 'facebook') {
      setEvents(['PageView']);
    } else if (newProvider === 'google') {
      setEvents([]);
    } else if (newProvider === 'tiktok') {
      setEvents(['PageView']);
    }
  };

  const handleSave = async () => {
    const pixelData = {
      provider,
      pixelId,
      events,
      delayRedirect,
      scriptContent: provider === 'custom' ? scriptContent : undefined,
      active: true,
    };

    if (editingPixel) {
      await onPixelUpdate(editingPixel.id, pixelData);
    } else {
      await onPixelAdd(pixelData);
    }

    handleCloseDialog();
  };

  const getProviderColor = (provider: PixelProvider): "primary" | "secondary" | "success" | "warning" => {
    switch (provider) {
      case 'facebook':
        return 'primary';
      case 'google':
        return 'warning';
      case 'linkedin':
        return 'primary';
      case 'tiktok':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Retargeting Pixels</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Pixel
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Retargeting pixels track users who scan your QR code, allowing you to serve ads to them later.
            Users will see a brief loading screen before redirecting.
          </Typography>
        </Alert>

        <List>
          {pixels.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No pixels configured"
                secondary="Add a pixel to enable retargeting"
              />
            </ListItem>
          ) : (
            pixels.map((pixel) => (
              <ListItem key={pixel.id} divider>
                <Box sx={{ mr: 2 }}>
                  <Code />
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={getPixelProviderName(pixel.provider)}
                        size="small"
                        color={getProviderColor(pixel.provider)}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Delay: {pixel.delayRedirect}ms
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">Pixel ID: {pixel.pixelId}</Typography>
                      {pixel.events.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Events: {pixel.events.join(', ')}
                        </Typography>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={pixel.active}
                    onChange={(e) => onPixelUpdate(pixel.id, { active: e.target.checked })}
                  />
                  <IconButton onClick={() => handleOpenDialog(pixel)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onPixelDelete(pixel.id)} color="error">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPixel ? 'Edit Pixel' : 'Add Retargeting Pixel'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Pixel Provider"
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value as PixelProvider)}
                >
                  <MenuItem value="facebook">Facebook Pixel</MenuItem>
                  <MenuItem value="google">Google Tag Manager</MenuItem>
                  <MenuItem value="linkedin">LinkedIn Insight Tag</MenuItem>
                  <MenuItem value="tiktok">TikTok Pixel</MenuItem>
                  <MenuItem value="twitter">Twitter (X) Pixel</MenuItem>
                  <MenuItem value="custom">Custom Script</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={provider === 'custom' ? 'Script Name' : 'Pixel ID'}
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  placeholder={
                    provider === 'facebook' ? '1234567890' :
                    provider === 'google' ? 'GTM-XXXXXXX' :
                    provider === 'linkedin' ? '12345' :
                    'Enter your pixel ID'
                  }
                  helperText={
                    provider === 'facebook' ? 'Found in Facebook Events Manager' :
                    provider === 'google' ? 'Your GTM container ID' :
                    provider === 'linkedin' ? 'Your Partner ID' :
                    'Enter the tracking ID from your provider'
                  }
                />
              </Grid>

              {provider !== 'custom' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tracking Events"
                    value={events.join(', ')}
                    onChange={(e) => setEvents(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="PageView, ViewContent, Purchase"
                    helperText="Comma-separated list of events to track"
                  />
                </Grid>
              )}

              {provider === 'custom' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Custom Script"
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    placeholder="<script>// Your custom tracking code</script>"
                    helperText="Paste your custom tracking script here"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Redirect Delay (ms)"
                  value={delayRedirect}
                  onChange={(e) => setDelayRedirect(parseInt(e.target.value))}
                  helperText="How long to wait before redirecting (recommended: 1000ms)"
                  inputProps={{ min: 500, max: 5000, step: 100 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>Note:</strong> Users will see a loading screen for {delayRedirect}ms to allow the pixel to fire.
                    Longer delays ensure accurate tracking but may impact user experience.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!pixelId || (provider === 'custom' && !scriptContent)}
            >
              {editingPixel ? 'Update' : 'Add'} Pixel
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
