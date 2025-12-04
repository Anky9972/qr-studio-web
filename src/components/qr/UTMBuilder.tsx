'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import { ContentCopy, Info, Refresh } from '@mui/icons-material';
import { UTMParameters } from '@/types/routing';
import { 
  appendUTMParameters, 
  validateUTMParameters, 
  UTM_PRESETS,
  cleanUTMValue,
  getGoogleAnalyticsTrackingUrl 
} from '@/lib/utmBuilder';

interface UTMBuilderProps {
  baseUrl: string;
  initialParams?: UTMParameters;
  onSave?: (params: UTMParameters) => void;
  showPreview?: boolean;
}

export default function UTMBuilder({
  baseUrl,
  initialParams = {},
  onSave,
  showPreview = true,
}: UTMBuilderProps) {
  const [params, setParams] = useState<UTMParameters>(initialParams);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: keyof UTMParameters, value: string) => {
    const cleaned = cleanUTMValue(value);
    setParams(prev => ({ ...prev, [field]: cleaned }));
    setErrors([]);
  };

  const handlePresetSelect = (presetKey: string) => {
    if (presetKey && presetKey in UTM_PRESETS) {
      const preset = UTM_PRESETS[presetKey as keyof typeof UTM_PRESETS];
      setParams(prev => ({ ...prev, ...preset }));
      setSelectedPreset(presetKey);
    }
  };

  const handleValidate = () => {
    const validation = validateUTMParameters(params);
    setErrors(validation.errors);
    return validation.valid;
  };

  const handleSave = () => {
    if (handleValidate() && onSave) {
      onSave(params);
    }
  };

  const handleCopyUrl = () => {
    const fullUrl = appendUTMParameters(baseUrl, params);
    navigator.clipboard.writeText(fullUrl);
  };

  const handleReset = () => {
    setParams({});
    setSelectedPreset('');
    setErrors([]);
  };

  const fullUrl = appendUTMParameters(baseUrl, params);
  const hasParams = Object.values(params).some(v => v);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            UTM Campaign Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add UTM parameters to track your QR code campaigns in Google Analytics
          </Typography>
        </Box>

        {/* Preset Selection */}
        <Box sx={{ mb: 3 }}>
          <TextField
            select
            fullWidth
            label="Quick Presets"
            value={selectedPreset}
            onChange={(e) => handlePresetSelect(e.target.value)}
            helperText="Choose a preset or customize your own"
          >
            <MenuItem value="">Custom</MenuItem>
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
            <MenuItem value="linkedin">LinkedIn</MenuItem>
            <MenuItem value="newsletter">Email Newsletter</MenuItem>
            <MenuItem value="print_flyer">Print Flyer</MenuItem>
            <MenuItem value="business_card">Business Card</MenuItem>
            <MenuItem value="qr_code">QR Code</MenuItem>
          </TextField>
        </Box>

        {/* UTM Parameters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Campaign Source"
              placeholder="facebook, newsletter, print"
              value={params.source || ''}
              onChange={(e) => handleChange('source', e.target.value)}
              helperText="Where traffic originates (e.g., google, facebook, newsletter)"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Campaign Medium"
              placeholder="social, email, cpc"
              value={params.medium || ''}
              onChange={(e) => handleChange('medium', e.target.value)}
              helperText="Marketing medium (e.g., social, email, cpc, banner)"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Campaign Name"
              placeholder="summer_sale_2025"
              value={params.campaign || ''}
              onChange={(e) => handleChange('campaign', e.target.value)}
              helperText="Specific campaign identifier"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Campaign Term"
              placeholder="running_shoes"
              value={params.term || ''}
              onChange={(e) => handleChange('term', e.target.value)}
              helperText="Paid search keywords (optional)"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Campaign Content"
              placeholder="banner_ad_1"
              value={params.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              helperText="A/B testing variant (optional)"
            />
          </Grid>
        </Grid>

        {/* Errors */}
        {errors.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {errors.map((error, idx) => (
              <Typography key={idx} variant="body2">
                • {error}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Preview */}
        {showPreview && hasParams && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview URL:
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                wordBreak: 'break-all',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                position: 'relative',
              }}
            >
              {fullUrl}
              <Tooltip title="Copy URL">
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={handleCopyUrl}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* UTM Tags Display */}
        {hasParams && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {params.source && <Chip label={`source: ${params.source}`} size="small" />}
            {params.medium && <Chip label={`medium: ${params.medium}`} size="small" />}
            {params.campaign && <Chip label={`campaign: ${params.campaign}`} size="small" />}
            {params.term && <Chip label={`term: ${params.term}`} size="small" />}
            {params.content && <Chip label={`content: ${params.content}`} size="small" />}
          </Stack>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {onSave && (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!hasParams}
            >
              Save UTM Parameters
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<Refresh />}
            disabled={!hasParams}
          >
            Reset
          </Button>
          <Tooltip title="Learn about UTM parameters">
            <IconButton
              href="https://support.google.com/analytics/answer/10917952"
              target="_blank"
              rel="noopener"
            >
              <Info />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Help Text */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>What are UTM parameters?</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            UTM parameters help you track the effectiveness of your marketing campaigns in Google Analytics.
            They're added to your URLs to identify the source, medium, and campaign name of your traffic.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}
