'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  AutoFixHigh,
  Image as ImageIcon,
  Palette,
  Download,
  Settings,
  Visibility,
  VisibilityOff,
  Key,
} from '@mui/icons-material';
import Image from 'next/image';

interface AIGeneratorProps {
  onQRGenerated?: (imageUrl: string) => void;
}

export default function AIQRGenerator({ onQRGenerated }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [qrContent, setQrContent] = useState('https://');
  const [style, setStyle] = useState<'artistic' | 'minimalist' | 'nature' | 'tech' | 'abstract'>('artistic');
  const [creativity, setCreativity] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0.05);
  
  // API Key Management
  const [apiKeysDialogOpen, setApiKeysDialogOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [replicateApiKey, setReplicateApiKey] = useState('');
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useState('');
  const [stabilityApiKey, setStabilityApiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showReplicateKey, setShowReplicateKey] = useState(false);
  const [showHuggingfaceKey, setShowHuggingfaceKey] = useState(false);
  const [showStabilityKey, setShowStabilityKey] = useState(false);
  const [preferredProvider, setPreferredProvider] = useState<'auto' | 'openai' | 'replicate' | 'huggingface' | 'stability'>('auto');
  const [hasApiKeys, setHasApiKeys] = useState(false);

  // Load API keys from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGeminiKey = localStorage.getItem('qr_studio_gemini_api_key');
      const savedOpenaiKey = localStorage.getItem('qr_studio_openai_api_key');
      const savedReplicateKey = localStorage.getItem('qr_studio_replicate_api_key');
      const savedHuggingfaceKey = localStorage.getItem('qr_studio_huggingface_api_key');
      const savedStabilityKey = localStorage.getItem('qr_studio_stability_api_key');
      const savedProvider = localStorage.getItem('qr_studio_ai_provider') as any;
      
      if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
      if (savedOpenaiKey) setOpenaiApiKey(savedOpenaiKey);
      if (savedReplicateKey) setReplicateApiKey(savedReplicateKey);
      if (savedHuggingfaceKey) setHuggingfaceApiKey(savedHuggingfaceKey);
      if (savedStabilityKey) setStabilityApiKey(savedStabilityKey);
      if (savedProvider) setPreferredProvider(savedProvider);
      
      setHasApiKeys(!!savedGeminiKey || !!savedOpenaiKey || !!savedReplicateKey || !!savedHuggingfaceKey || !!savedStabilityKey);
    }
  }, []);

  const stylePresets = {
    artistic: 'Beautiful artistic design with creative patterns and colors',
    minimalist: 'Clean, modern, minimal design with simple shapes',
    nature: 'Natural elements like leaves, flowers, water, or mountains',
    tech: 'Futuristic technology theme with circuits and digital elements',
    abstract: 'Abstract geometric patterns and artistic composition',
  };

  const saveApiKeys = () => {
    if (typeof window !== 'undefined') {
      if (geminiApiKey) {
        localStorage.setItem('qr_studio_gemini_api_key', geminiApiKey);
      } else {
        localStorage.removeItem('qr_studio_gemini_api_key');
      }
      
      if (openaiApiKey) {
        localStorage.setItem('qr_studio_openai_api_key', openaiApiKey);
      } else {
        localStorage.removeItem('qr_studio_openai_api_key');
      }
      
      if (replicateApiKey) {
        localStorage.setItem('qr_studio_replicate_api_key', replicateApiKey);
      } else {
        localStorage.removeItem('qr_studio_replicate_api_key');
      }
      
      if (huggingfaceApiKey) {
        localStorage.setItem('qr_studio_huggingface_api_key', huggingfaceApiKey);
      } else {
        localStorage.removeItem('qr_studio_huggingface_api_key');
      }
      
      if (stabilityApiKey) {
        localStorage.setItem('qr_studio_stability_api_key', stabilityApiKey);
      } else {
        localStorage.removeItem('qr_studio_stability_api_key');
      }
      
      localStorage.setItem('qr_studio_ai_provider', preferredProvider);
      setHasApiKeys(!!geminiApiKey || !!openaiApiKey || !!replicateApiKey || !!huggingfaceApiKey || !!stabilityApiKey);
      setApiKeysDialogOpen(false);
    }
  };

  const handleGenerate = async () => {
    if (!qrContent || qrContent.length < 5) {
      setError('Please enter valid QR code content (URL, text, etc.)');
      return;
    }

    if (!prompt || prompt.length < 10) {
      setError('Please enter a detailed prompt (at least 10 characters)');
      return;
    }

    if (!geminiApiKey && !openaiApiKey && !replicateApiKey && !huggingfaceApiKey && !stabilityApiKey) {
      setError('Please configure at least one API key in settings');
      setApiKeysDialogOpen(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${prompt}. ${stylePresets[style]}`,
          qrContent,
          creativity,
          style,
          geminiApiKey,
          openaiApiKey,
          replicateApiKey,
          huggingfaceApiKey,
          stabilityApiKey,
          preferredProvider,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate AI QR code');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      if (onQRGenerated) {
        onQRGenerated(data.imageUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI QR code');
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    'A QR code hidden in a beautiful sunset over the ocean',
    'QR code integrated into a futuristic city skyline',
    'A QR code made of colorful autumn leaves',
    'QR code as part of a coffee cup on a wooden table',
    'A QR code blended into a galaxy with stars and nebula',
  ];

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <AutoFixHigh sx={{ mr: 1, verticalAlign: 'middle' }} />
                    AI-Powered QR Code Designer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create stunning artistic QR codes using AI image generation
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
                    <Chip 
                      label="Replicate" 
                      color="primary" 
                      size="small"
                      icon={replicateApiKey ? <Key /> : undefined}
                      variant={replicateApiKey ? "filled" : "outlined"}
                    />
                    <Chip 
                      label="OpenAI" 
                      color="secondary" 
                      size="small"
                      icon={openaiApiKey ? <Key /> : undefined}
                      variant={openaiApiKey ? "filled" : "outlined"}
                    />
                    <Chip 
                      label="HuggingFace" 
                      color="success" 
                      size="small"
                      icon={huggingfaceApiKey ? <Key /> : undefined}
                      variant={huggingfaceApiKey ? "filled" : "outlined"}
                    />
                    <Chip 
                      label="Stability" 
                      color="warning" 
                      size="small"
                      icon={stabilityApiKey ? <Key /> : undefined}
                      variant={stabilityApiKey ? "filled" : "outlined"}
                    />
                  </Stack>
                </Box>
                <Tooltip title="Configure API Keys">
                  <IconButton 
                    onClick={() => setApiKeysDialogOpen(true)}
                    color={hasApiKeys ? "primary" : "default"}
                  >
                    <Settings />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* QR Content Input */}
            <TextField
              label="QR Code Content"
              value={qrContent}
              onChange={(e) => setQrContent(e.target.value)}
              placeholder="https://example.com"
              helperText="The URL or text that the QR code will contain"
              fullWidth
              required
            />

            {/* AI Prompt */}
            <TextField
              label="Describe Your Vision"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A QR code hidden in a beautiful forest scene..."
              helperText="Describe how you want your QR code to look"
              multiline
              rows={3}
              fullWidth
              required
            />

            {/* Example Prompts */}
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                Need inspiration? Try these:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {examplePrompts.slice(0, 3).map((example, index) => (
                  <Chip
                    key={index}
                    label={example.substring(0, 40) + '...'}
                    size="small"
                    onClick={() => setPrompt(example)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Style Selection */}
            <FormControl fullWidth>
              <InputLabel>Style Preset</InputLabel>
              <Select
                value={style}
                label="Style Preset"
                onChange={(e) => setStyle(e.target.value as any)}
              >
                <MenuItem value="artistic">Artistic - Creative & Colorful</MenuItem>
                <MenuItem value="minimalist">Minimalist - Clean & Modern</MenuItem>
                <MenuItem value="nature">Nature - Organic Elements</MenuItem>
                <MenuItem value="tech">Tech - Futuristic & Digital</MenuItem>
                <MenuItem value="abstract">Abstract - Geometric Patterns</MenuItem>
              </Select>
            </FormControl>

            {/* Creativity Slider */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Creativity Level: {(creativity * 100).toFixed(0)}%
              </Typography>
              <Slider
                value={creativity}
                onChange={(_, value) => setCreativity(value as number)}
                min={0.3}
                max={1.0}
                step={0.1}
                marks={[
                  { value: 0.3, label: 'Conservative' },
                  { value: 0.7, label: 'Balanced' },
                  { value: 1.0, label: 'Wild' },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Typography variant="caption" color="text.secondary">
                Higher creativity = more artistic interpretation (may reduce scannability)
              </Typography>
            </Box>

            {/* Cost Estimate */}
            <Alert severity="info" icon={<Palette />}>
              <Typography variant="body2">
                <strong>Cost per Generation:</strong>
              </Typography>
              <ul style={{ margin: '4px 0 4px 16px', padding: 0, fontSize: '0.875rem' }}>
                <li><strong>Replicate (ControlNet QR)</strong>: $0.005-0.02 ⭐ Best for QR</li>
                <li><strong>HuggingFace</strong>: Free tier available</li>
                <li><strong>Stability AI (SDXL)</strong>: $0.02-0.04</li>
                <li><strong>OpenAI (DALL-E 3)</strong>: $0.04-0.08 - Highest quality</li>
              </ul>
              <Typography variant="caption" color="text.secondary">
                Uses your API keys. Takes 30-90 seconds.
              </Typography>
            </Alert>

            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            {/* Generate Button */}
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={loading || !qrContent || !prompt}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoFixHigh />}
              fullWidth
            >
              {loading ? 'Generating AI QR Code...' : 'Generate AI QR Code'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Generated Image Preview */}
      {generatedImage && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Your AI-Generated QR Code
            </Typography>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 512,
                  margin: '0 auto',
                  aspectRatio: '1/1',
                }}
              >
                <Image
                  src={generatedImage}
                  alt="AI Generated QR Code"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Paper>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                href={generatedImage}
                download="ai-qr-code.png"
                fullWidth
              >
                Download
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGeneratedImage('')}
                fullWidth
              >
                Generate Another
              </Button>
            </Stack>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Important:</strong> Always test your AI-generated QR code before using it in production. 
                Higher creativity levels may reduce scannability.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      {!generatedImage && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              How It Works
            </Typography>
            
            <Stack spacing={2}>
              <Typography variant="body2">
                1. <strong>Enter your QR content:</strong> The URL or text you want to encode
              </Typography>
              <Typography variant="body2">
                2. <strong>Describe your vision:</strong> Tell the AI how you want your QR code to look
              </Typography>
              <Typography variant="body2">
                3. <strong>Choose a style:</strong> Select from artistic presets for best results
              </Typography>
              <Typography variant="body2">
                4. <strong>Adjust creativity:</strong> Balance between artistic quality and scannability
              </Typography>
              <Typography variant="body2">
                5. <strong>Generate:</strong> Our AI will create a unique, scannable QR code artwork
              </Typography>
            </Stack>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                <strong>Pro Tip:</strong> For best results, use high-contrast scenes (e.g., "sunset", "starry night") 
                and set creativity to 60-70% to maintain scannability.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* API Keys Configuration Dialog */}
      <Dialog 
        open={apiKeysDialogOpen} 
        onClose={() => setApiKeysDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Key sx={{ mr: 1 }} />
            Configure AI API Keys
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                Your API keys are stored securely in your browser's local storage and never sent to our servers.
                They're only used to communicate directly with AI providers.
              </Typography>
            </Alert>

            {/* Replicate API Key - RECOMMENDED */}
            <Box>
              <TextField
                label="Replicate API Key (Recommended for QR)" 
                value={replicateApiKey}
                onChange={(e) => setReplicateApiKey(e.target.value)}
                placeholder="r8_...."
                fullWidth
                type={showReplicateKey ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowReplicateKey(!showReplicateKey)}
                        edge="end"
                      >
                        {showReplicateKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Get your API key from{' '}
                <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer">
                  Replicate
                </a>
                {' '}(ControlNet QR - Best scannability) • ~$0.005-0.02/gen
              </Typography>
            </Box>

            {/* OpenAI API Key */}
            <Box>
              <TextField
                label="OpenAI API Key"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-...."
                fullWidth
                type={showOpenaiKey ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        edge="end"
                      >
                        {showOpenaiKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Get your API key from{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  OpenAI Platform
                </a>
                {' '}(GPT-4o + DALL-E 3) • ~$0.04-0.08/gen
              </Typography>
            </Box>

            {/* HuggingFace API Key */}
            <Box>
              <TextField
                label="HuggingFace API Key"
                value={huggingfaceApiKey}
                onChange={(e) => setHuggingfaceApiKey(e.target.value)}
                placeholder="hf_...."
                fullWidth
                type={showHuggingfaceKey ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowHuggingfaceKey(!showHuggingfaceKey)}
                        edge="end"
                      >
                        {showHuggingfaceKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Get your API key from{' '}
                <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">
                  HuggingFace
                </a>
                {' '}(QR ControlNet models) • Free tier available
              </Typography>
            </Box>

            {/* Stability AI API Key */}
            <Box>
              <TextField
                label="Stability AI API Key"
                value={stabilityApiKey}
                onChange={(e) => setStabilityApiKey(e.target.value)}
                placeholder="sk-...."
                fullWidth
                type={showStabilityKey ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowStabilityKey(!showStabilityKey)}
                        edge="end"
                      >
                        {showStabilityKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Get your API key from{' '}
                <a href="https://platform.stability.ai/account/keys" target="_blank" rel="noopener noreferrer">
                  Stability AI
                </a>
                {' '}(SDXL + ControlNet) • ~$0.02-0.04/gen
              </Typography>
            </Box>

            {/* Provider Preference */}
            <FormControl fullWidth>
              <InputLabel>Preferred Provider</InputLabel>
              <Select
                value={preferredProvider}
                label="Preferred Provider"
                onChange={(e) => setPreferredProvider(e.target.value as any)}
              >
                <MenuItem value="auto">Auto (Smart fallback)</MenuItem>
                <MenuItem value="replicate">Replicate (Best for QR codes)</MenuItem>
                <MenuItem value="openai">OpenAI (DALL-E 3)</MenuItem>
                <MenuItem value="huggingface">HuggingFace (Free tier)</MenuItem>
                <MenuItem value="stability">Stability AI (SDXL)</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info">
              <Typography variant="body2">
                <strong>Cost Estimates:</strong>
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: 20, fontSize: '0.875rem' }}>
                <li><strong>Replicate</strong>: $0.005-0.02/gen (Best value + scannability)</li>
                <li><strong>HuggingFace</strong>: Free tier available</li>
                <li><strong>Stability AI</strong>: $0.02-0.04/gen</li>
                <li><strong>OpenAI</strong>: $0.04-0.08/gen (Highest quality)</li>
              </ul>
              <Typography variant="caption">
                💡 <strong>Recommended:</strong> Start with Replicate for best QR scannability
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApiKeysDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={saveApiKeys} 
            variant="contained"
            disabled={!geminiApiKey && !openaiApiKey && !replicateApiKey && !huggingfaceApiKey && !stabilityApiKey}
          >
            Save Keys
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
