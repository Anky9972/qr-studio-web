'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
} from '@mui/icons-material';

interface ScannabilityResult {
  score: number; // 0-100
  readability: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  recommendations: string[];
  contrast: number;
  size: number;
}

interface ScannabilityWidgetProps {
  foreground: string;
  background: string;
  size: number;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  hasLogo?: boolean;
  content: string;
}

export default function ScannabilityWidget({
  foreground,
  background,
  size,
  errorLevel,
  hasLogo = false,
  content,
}: ScannabilityWidgetProps) {
  const [result, setResult] = useState<ScannabilityResult>({
    score: 100,
    readability: 'excellent',
    issues: [],
    recommendations: [],
    contrast: 21,
    size,
  });

  useEffect(() => {
    // Calculate scannability metrics
    const metrics = calculateScannability({
      foreground,
      background,
      size,
      errorLevel,
      hasLogo,
      content,
    });
    setResult(metrics);
  }, [foreground, background, size, errorLevel, hasLogo, content]);

  const getColorByScore = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getIconByReadability = () => {
    switch (result.readability) {
      case 'excellent':
        return <CheckCircle color="success" />;
      case 'good':
        return <CheckCircle color="info" />;
      case 'fair':
        return <Warning color="warning" />;
      case 'poor':
        return <ErrorIcon color="error" />;
      default:
        return <Info />;
    }
  };

  const getSeverity = () => {
    switch (result.readability) {
      case 'excellent':
      case 'good':
        return 'success';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              Scannability Score
            </Typography>
            <Chip
              icon={getIconByReadability()}
              label={result.readability.toUpperCase()}
              color={getColorByScore(result.score) as any}
              variant="filled"
            />
          </Box>

          {/* Score Progress */}
          <Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Overall Score
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {result.score}/100
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={result.score}
              color={getColorByScore(result.score) as any}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Metrics */}
          <Stack direction="row" spacing={2}>
            <Tooltip title="Contrast ratio between foreground and background">
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Contrast Ratio
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {result.contrast.toFixed(1)}:1
                </Typography>
                <Typography variant="caption" color={result.contrast >= 7 ? 'success.main' : result.contrast >= 4.5 ? 'warning.main' : 'error.main'}>
                  {result.contrast >= 7 ? 'Excellent' : result.contrast >= 4.5 ? 'Good' : 'Poor'}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="QR code size in pixels">
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Size
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {result.size}px
                </Typography>
                <Typography variant="caption" color={result.size >= 300 ? 'success.main' : result.size >= 200 ? 'warning.main' : 'error.main'}>
                  {result.size >= 300 ? 'Optimal' : result.size >= 200 ? 'Acceptable' : 'Too Small'}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Error correction level">
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Error Correction
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {errorLevel}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {errorLevel === 'H' ? '30%' : errorLevel === 'Q' ? '25%' : errorLevel === 'M' ? '15%' : '7%'}
                </Typography>
              </Box>
            </Tooltip>
          </Stack>

          {/* Issues and Recommendations */}
          {(result.issues.length > 0 || result.recommendations.length > 0) && (
            <Alert severity={getSeverity()} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {result.readability === 'excellent' || result.readability === 'good' 
                  ? 'Your QR code looks great!' 
                  : 'Suggestions for improvement'}
              </Typography>

              {result.issues.length > 0 && (
                <List dense sx={{ py: 0 }}>
                  {result.issues.map((issue, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Warning fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={issue} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {result.recommendations.length > 0 && (
                <List dense sx={{ py: 0 }}>
                  {result.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Info fontSize="small" color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={rec} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Alert>
          )}

          {/* Additional Tips */}
          {result.readability === 'excellent' && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="caption" color="success.main">
                ✓ This QR code is highly scannable and should work reliably in most conditions
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate scannability metrics
function calculateScannability(options: {
  foreground: string;
  background: string;
  size: number;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  hasLogo: boolean;
  content: string;
}): ScannabilityResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  let readability: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';

  // Calculate contrast ratio
  const contrast = calculateContrast(options.foreground, options.background);

  // Check contrast
  if (contrast < 3) {
    issues.push('Very low contrast - QR code may not scan');
    recommendations.push('Increase contrast by using darker foreground or lighter background');
    score -= 40;
    readability = 'poor';
  } else if (contrast < 4.5) {
    issues.push('Low contrast - may be difficult to scan in some lighting');
    recommendations.push('Aim for contrast ratio of at least 4.5:1');
    score -= 25;
    readability = readability === 'excellent' ? 'fair' : readability;
  } else if (contrast < 7) {
    recommendations.push('Good contrast! Consider increasing to 7:1 for optimal scanning');
    score -= 10;
    readability = readability === 'excellent' ? 'good' : readability;
  }

  // Check size
  if (options.size < 200) {
    issues.push('QR code is too small - minimum 200x200px recommended');
    recommendations.push('Increase size to at least 200x200px for reliable scanning');
    score -= 30;
    readability = 'poor';
  } else if (options.size < 300) {
    issues.push('QR code size is small - may be difficult to scan from distance');
    recommendations.push('Use 300x300px or larger for better scannability');
    score -= 15;
    readability = readability === 'excellent' ? 'fair' : readability;
  }

  // Check error correction with logo
  if (options.hasLogo && options.errorLevel !== 'H' && options.errorLevel !== 'Q') {
    issues.push('Low error correction level for QR code with logo');
    recommendations.push('Use error correction level Q or H when adding logos');
    score -= 20;
    readability = readability === 'excellent' ? 'good' : readability;
  }

  // Check content length
  if (options.content.length > 500) {
    issues.push('Very long content may create dense QR code');
    recommendations.push('Consider shortening URL or content for better scanning');
    score -= 10;
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    score,
    readability,
    issues,
    recommendations,
    contrast,
    size: options.size,
  };
}

// Calculate contrast ratio between two colors
function calculateContrast(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 21; // Default to max contrast if parsing fails

  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex values
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

  return { r, g, b };
}

function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
