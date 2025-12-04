'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import DownloadIcon from '@mui/icons-material/Download'
import SaveIcon from '@mui/icons-material/Save'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import ImageIcon from '@mui/icons-material/Image'
import QRCodeStyling from 'qr-code-styling'
import { useSession } from 'next-auth/react'
import { useQRCodeStore } from '@/store/qrCodeStore'
import AnimatedQRCode from '@/components/AnimatedQRCode'
import TemplateGallerySelector from '@/components/TemplateGallerySelector'
import { getTemplateById, getAllTemplates, type QRTemplate } from '@/lib/qr-templates'

const qrTypes = [
  { value: 'url', label: 'URL', placeholder: 'https://example.com' },
  { value: 'text', label: 'Plain Text', placeholder: 'Enter text' },
  { value: 'email', label: 'Email', placeholder: 'email@example.com' },
  { value: 'phone', label: 'Phone', placeholder: '+1234567890' },
  { value: 'sms', label: 'SMS', placeholder: 'Phone:Message' },
  { value: 'wifi', label: 'WiFi', placeholder: 'WIFI:S:<SSID>;T:<WPA|WEP>;P:<password>;;' },
  { value: 'vcard', label: 'vCard', placeholder: 'Contact details' },
  { value: 'location', label: 'Location', placeholder: 'geo:lat,lng' },
  { value: 'event', label: 'Calendar Event (vEvent)', placeholder: 'Event details' },
  { value: 'bitcoin', label: 'Bitcoin Payment', placeholder: 'bitcoin:address?amount=0.001' },
  { value: 'paypal', label: 'PayPal Payment', placeholder: 'https://paypal.me/username/amount' },
  { value: 'appstore', label: 'App Store Link', placeholder: 'https://apps.apple.com/app/id123456' },
  { value: 'twitter', label: 'Twitter Profile', placeholder: 'https://twitter.com/username' },
  { value: 'facebook', label: 'Facebook Profile', placeholder: 'https://facebook.com/username' },
  { value: 'instagram', label: 'Instagram Profile', placeholder: 'https://instagram.com/username' },
  { value: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/username' },
]

export default function GeneratePage() {
  const { data: session } = useSession()
  const { addQRCode, setIsGenerating } = useQRCodeStore()
  
  const [qrType, setQrType] = useState('url')
  const [content, setContent] = useState('')
  const [name, setName] = useState('')
  const [isDynamic, setIsDynamic] = useState(false)
  
  // Design settings
  const [size, setSize] = useState(512)
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#FFFFFF')
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [pattern, setPattern] = useState('square')
  const [cornerRadius, setCornerRadius] = useState(0)
  const [margin, setMargin] = useState(10)
  const [logo, setLogo] = useState('')
  const [logoSize, setLogoSize] = useState(0.3)
  
  // Advanced features
  const [useGradient, setUseGradient] = useState(false)
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [gradientColor1, setGradientColor1] = useState('#000000')
  const [gradientColor2, setGradientColor2] = useState('#1976d2')
  const [gradientRotation, setGradientRotation] = useState(0)
  const [frameStyle, setFrameStyle] = useState('none')
  const [frameText, setFrameText] = useState('')
  const [frameColor, setFrameColor] = useState('#000000')
  
  // Animation and template features
  const [enableAnimation, setEnableAnimation] = useState(false)
  const [animationType, setAnimationType] = useState<'pulse' | 'gradient-wave' | 'rainbow' | 'glow'>('pulse')
  const [animationSpeed, setAnimationSpeed] = useState(1.5)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  
  // Expiration and security
  const [expirationEnabled, setExpirationEnabled] = useState(false)
  const [expirationDate, setExpirationDate] = useState('')
  const [passwordEnabled, setPasswordEnabled] = useState(false)
  const [password, setPassword] = useState('')
  
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const qrCodeInstance = useRef<QRCodeStyling | null>(null)

  // Initialize QR code
  useEffect(() => {
    if (qrCodeRef.current && !qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: size,
        height: size,
        data: content || 'https://qrstudio.app',
        margin,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: errorLevel,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: logoSize,
          margin: 0,
        },
        dotsOptions: {
          type: pattern as any,
          color: useGradient ? undefined : foreground,
          gradient: useGradient ? {
            type: gradientType,
            rotation: gradientRotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ],
          } : undefined,
        },
        backgroundOptions: {
          color: background,
        },
        cornersSquareOptions: {
          type: pattern as any,
          color: useGradient ? undefined : foreground,
          gradient: useGradient ? {
            type: gradientType,
            rotation: gradientRotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ],
          } : undefined,
        },
        cornersDotOptions: {
          type: pattern as any,
          color: useGradient ? undefined : foreground,
          gradient: useGradient ? {
            type: gradientType,
            rotation: gradientRotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ],
          } : undefined,
        },
      })
      
      qrCodeInstance.current.append(qrCodeRef.current)
    }
  }, [])

  // Update QR code when settings change
  useEffect(() => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: content || 'https://qrstudio.app',
        width: size,
        height: size,
        margin,
        qrOptions: {
          errorCorrectionLevel: errorLevel,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: logoSize,
          margin: 0,
          ...(logo && { image: logo }),
        },
        dotsOptions: {
          type: pattern as any,
          color: useGradient ? undefined : foreground,
          gradient: useGradient ? {
            type: gradientType,
            rotation: gradientRotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ],
          } : undefined,
        },
        backgroundOptions: {
          color: background,
        },
        cornersSquareOptions: {
          type: pattern as any,
          color: useGradient ? undefined : foreground,
          gradient: useGradient ? {
            type: gradientType,
            rotation: gradientRotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ],
          } : undefined,
        },
        cornersDotOptions: {
          type: pattern as any,
          color: useGradient ? undefined : foreground,
          gradient: useGradient ? {
            type: gradientType,
            rotation: gradientRotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ],
          } : undefined,
        },
      })
    }
  }, [content, size, foreground, background, errorLevel, pattern, margin, logo, logoSize, useGradient, gradientType, gradientColor1, gradientColor2, gradientRotation])

  const handleDownload = async (format: 'png' | 'svg' | 'jpeg') => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({
        name: name || 'qr-code',
        extension: format,
      })
    }
  }

  const handleCopyImage = async () => {
    try {
      if (qrCodeInstance.current) {
        const blob = await qrCodeInstance.current.getRawData('png')
        if (blob && blob instanceof Blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ])
          setSaveSuccess(true)
          setTimeout(() => setSaveSuccess(false), 3000)
        }
      }
    } catch (err) {
      setError('Failed to copy image')
    }
  }

  const handleSave = async () => {
    if (!content) {
      setError('Please enter content for your QR code')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || `QR Code - ${new Date().toLocaleDateString()}`,
          type: isDynamic ? 'dynamic' : 'static',
          content,
          qrType,
          size,
          foreground,
          background,
          logo,
          errorLevel,
          pattern,
          expiresAt: expirationEnabled && expirationDate ? new Date(expirationDate).toISOString() : null,
          password: passwordEnabled && password ? password : null,
          design: {
            cornerRadius,
            margin,
            logoSize,
            useGradient,
            gradientType,
            gradientColor1,
            gradientColor2,
            gradientRotation,
            frameStyle,
            frameText,
            frameColor,
            enableAnimation,
            animationType: enableAnimation ? animationType : undefined,
            animationSpeed: enableAnimation ? animationSpeed : undefined,
            templateId: selectedTemplate || undefined,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save QR code')
      }

      const qrCode = await response.json()
      addQRCode(qrCode)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError('Failed to save QR code. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Generate QR Code
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create custom QR codes with advanced design options
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          QR code saved successfully!
        </Alert>
      )}

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
        gap: 3,
      }}>
        {/* Left Panel - Settings */}
        <Box>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, v) => setActiveTab(v)} 
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Content" />
              <Tab label="Templates & Animation" />
              <Tab label="Design" />
              <Tab label="Logo & Advanced" />
              <Tab label="Security" />
            </Tabs>

            {/* Content Tab */}
            {activeTab === 0 && (
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My QR Code"
                  size="medium"
                />

                <FormControl fullWidth>
                  <InputLabel>QR Type</InputLabel>
                  <Select
                    value={qrType}
                    label="QR Type"
                    onChange={(e) => setQrType(e.target.value)}
                    size="medium"
                  >
                    {qrTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={5}
                  placeholder={
                    qrTypes.find((t) => t.value === qrType)?.placeholder
                  }
                  helperText="Enter the content you want to encode in the QR code"
                  size="medium"
                />

                {/* Format helpers for special QR types */}
                {qrType === 'event' && (
                  <Alert severity="info" icon={<QrCode2Icon />}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>vEvent Format:</Typography>
                    <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
{`BEGIN:VEVENT
SUMMARY:Event Name
DTSTART:20250315T100000Z
DTEND:20250315T120000Z
LOCATION:Event Location
DESCRIPTION:Event description
END:VEVENT`}
                    </Typography>
                  </Alert>
                )}

                {qrType === 'vcard' && (
                  <Alert severity="info" icon={<QrCode2Icon />}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>vCard Format:</Typography>
                    <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
{`BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1234567890
EMAIL:john@example.com
END:VCARD`}
                    </Typography>
                  </Alert>
                )}

                {qrType === 'wifi' && (
                  <Alert severity="info" icon={<QrCode2Icon />}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>WiFi Format:</Typography>
                    <Typography variant="caption">
                      WIFI:S:NetworkName;T:WPA;P:password;;
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      • S: Network SSID • T: WPA, WEP, or nopass • P: Password
                    </Typography>
                  </Alert>
                )}

                {qrType === 'bitcoin' && (
                  <Alert severity="info" icon={<QrCode2Icon />}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>Bitcoin Payment Format:</Typography>
                    <Typography variant="caption">
                      bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001&label=Donation
                    </Typography>
                  </Alert>
                )}

                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDynamic}
                        onChange={(e) => setIsDynamic(e.target.checked)}
                      />
                    }
                    label="Dynamic QR Code (editable & trackable)"
                  />
                  {isDynamic && (
                    <Alert severity="info" sx={{ mt: 1.5 }}>
                      Dynamic QR codes can be edited after creation and include scan tracking. Requires Pro plan.
                    </Alert>
                  )}
                </Box>
              </Stack>
            )}

            {/* Templates & Animation Tab */}
            {activeTab === 1 && (
              <Stack spacing={3}>
                <Alert severity="info" icon={<ColorLensIcon />}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    Professional Templates & Animations
                  </Typography>
                  <Typography variant="caption">
                    Choose from 30+ pre-designed templates or create animated QR codes with various effects.
                  </Typography>
                </Alert>

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Template Gallery
                  </Typography>
                  <Button
                    variant={selectedTemplate ? 'outlined' : 'contained'}
                    fullWidth
                    startIcon={<ImageIcon />}
                    onClick={() => setShowTemplateGallery(!showTemplateGallery)}
                    sx={{ mb: 2, textTransform: 'none', py: 1.5 }}
                  >
                    {selectedTemplate ? `Template: ${getTemplateById(selectedTemplate)?.name || 'Custom'}` : 'Choose Template'}
                  </Button>

                  {showTemplateGallery && (
                    <Box sx={{ 
                      mb: 3,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
                    }}>
                      <TemplateGallerySelector
                        onSelectTemplate={(templateId) => {
                          setSelectedTemplate(templateId)
                          const template = getTemplateById(templateId)
                          if (template) {
                            // Apply template settings
                            if (template.dotsOptions.type) {
                              setPattern(template.dotsOptions.type)
                            }
                            if (template.dotsOptions.gradient) {
                              setUseGradient(true)
                              setGradientType(template.dotsOptions.gradient.type)
                              if (template.dotsOptions.gradient.colorStops) {
                                setGradientColor1(template.dotsOptions.gradient.colorStops[0].color)
                                setGradientColor2(template.dotsOptions.gradient.colorStops[1].color)
                              }
                              if (template.dotsOptions.gradient.rotation !== undefined) {
                                setGradientRotation(template.dotsOptions.gradient.rotation * (180 / Math.PI))
                              }
                            } else if (template.dotsOptions.color) {
                              setUseGradient(false)
                              setForeground(template.dotsOptions.color)
                            }
                            if (template.backgroundOptions?.color) {
                              setBackground(template.backgroundOptions.color)
                            }
                          }
                          setShowTemplateGallery(false)
                        }}
                        selectedTemplateId={selectedTemplate}
                      />
                    </Box>
                  )}

                  {selectedTemplate && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        setSelectedTemplate(null)
                        // Reset to default colors
                        setForeground('#000000')
                        setBackground('#FFFFFF')
                        setUseGradient(false)
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Clear Template
                    </Button>
                  )}
                </Box>

                <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }} />

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Animation Effects
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableAnimation}
                        onChange={(e) => setEnableAnimation(e.target.checked)}
                      />
                    }
                    label="Enable Animation"
                  />
                </Box>

                {enableAnimation && (
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel>Animation Type</InputLabel>
                      <Select
                        value={animationType}
                        label="Animation Type"
                        onChange={(e) => setAnimationType(e.target.value as any)}
                        size="medium"
                      >
                        <MenuItem value="pulse">Pulse (Breathing Effect)</MenuItem>
                        <MenuItem value="gradient-wave">Gradient Wave</MenuItem>
                        <MenuItem value="rainbow">Rainbow (Color Cycling)</MenuItem>
                        <MenuItem value="glow">Glow (Neon Effect)</MenuItem>
                      </Select>
                    </FormControl>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
                        Animation Speed: {animationSpeed.toFixed(1)}x
                      </Typography>
                      <Slider
                        value={animationSpeed}
                        onChange={(_, v) => setAnimationSpeed(v as number)}
                        min={0.5}
                        max={3}
                        step={0.1}
                        valueLabelDisplay="auto"
                        marks={[
                          { value: 0.5, label: '0.5x' },
                          { value: 1.5, label: '1.5x' },
                          { value: 3, label: '3x' },
                        ]}
                      />
                    </Box>

                    <Alert severity="info">
                      <Typography variant="caption">
                        <strong>Note:</strong> Animated QR codes will be exported as GIF format for animation support.
                        Static formats (PNG, SVG) will show the current frame.
                      </Typography>
                    </Alert>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Design Tab */}
            {activeTab === 2 && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
                    Size: {size}px
                  </Typography>
                  <Slider
                    value={size}
                    onChange={(_, v) => setSize(v as number)}
                    min={256}
                    max={2048}
                    step={64}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Foreground Color"
                    type="color"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="medium"
                  />
                  <TextField
                    fullWidth
                    label="Background Color"
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="medium"
                  />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Pattern Style</InputLabel>
                  <Select
                    value={pattern}
                    label="Pattern Style"
                    onChange={(e) => setPattern(e.target.value)}
                    size="medium"
                  >
                    <MenuItem value="square">Square</MenuItem>
                    <MenuItem value="dots">Dots</MenuItem>
                    <MenuItem value="rounded">Rounded</MenuItem>
                    <MenuItem value="extra-rounded">Extra Rounded</MenuItem>
                    <MenuItem value="classy">Classy</MenuItem>
                    <MenuItem value="classy-rounded">Classy Rounded</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Error Correction</InputLabel>
                  <Select
                    value={errorLevel}
                    label="Error Correction"
                    onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    size="medium"
                  >
                    <MenuItem value="L">Low (7%)</MenuItem>
                    <MenuItem value="M">Medium (15%)</MenuItem>
                    <MenuItem value="Q">Quartile (25%)</MenuItem>
                    <MenuItem value="H">High (30%)</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
                    Margin: {margin}px
                  </Typography>
                  <Slider
                    value={margin}
                    onChange={(_, v) => setMargin(v as number)}
                    min={0}
                    max={50}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            )}

            {/* Logo & Advanced Tab */}
            {activeTab === 3 && (
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  helperText="Enter a URL to your logo image"
                  size="medium"
                />

                {logo && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
                      Logo Size: {Math.round(logoSize * 100)}%
                    </Typography>
                    <Slider
                      value={logoSize}
                      onChange={(_, v) => setLogoSize(v as number)}
                      min={0.1}
                      max={0.5}
                      step={0.05}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                    />
                  </Box>
                )}

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                  Gradient Colors
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useGradient}
                      onChange={(e) => setUseGradient(e.target.checked)}
                    />
                  }
                  label="Enable Gradient"
                />

                {useGradient && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Gradient Type</InputLabel>
                      <Select
                        value={gradientType}
                        label="Gradient Type"
                        onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
                      >
                        <MenuItem value="linear">Linear</MenuItem>
                        <MenuItem value="radial">Radial</MenuItem>
                      </Select>
                    </FormControl>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Start Color"
                        type="color"
                        value={gradientColor1}
                        onChange={(e) => setGradientColor1(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                      <TextField
                        label="End Color"
                        type="color"
                        value={gradientColor2}
                        onChange={(e) => setGradientColor2(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Box>

                    {gradientType === 'linear' && (
                      <Box>
                        <Typography variant="caption" gutterBottom display="block">
                          Rotation: {gradientRotation}°
                        </Typography>
                        <Slider
                          value={gradientRotation}
                          onChange={(_, v) => setGradientRotation(v as number)}
                          min={0}
                          max={360}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                    )}
                  </Stack>
                )}

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
                  Frame Style
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Frame</InputLabel>
                  <Select
                    value={frameStyle}
                    label="Frame"
                    onChange={(e) => setFrameStyle(e.target.value)}
                  >
                    <MenuItem value="none">No Frame</MenuItem>
                    <MenuItem value="box">Box Frame</MenuItem>
                    <MenuItem value="banner">Banner Frame</MenuItem>
                    <MenuItem value="balloon">Balloon Frame</MenuItem>
                    <MenuItem value="bottom-text">Bottom Text</MenuItem>
                  </Select>
                </FormControl>

                {frameStyle !== 'none' && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Frame Text"
                      value={frameText}
                      onChange={(e) => setFrameText(e.target.value)}
                      placeholder="Scan Me!"
                      size="small"
                    />
                    <TextField
                      label="Frame Color"
                      type="color"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Stack>
                )}
              </Stack>
            )}

            {/* Security Tab */}
            {activeTab === 4 && (
              <Stack spacing={3}>
                <Alert severity="info">
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    QR Code Expiration
                  </Typography>
                  <Typography variant="caption">
                    Set an expiration date to automatically disable this QR code after a specific time. 
                    Expired QR codes will redirect to an expiration notice page.
                  </Typography>
                </Alert>

                <FormControlLabel
                  control={
                    <Switch
                      checked={expirationEnabled}
                      onChange={(e) => setExpirationEnabled(e.target.checked)}
                    />
                  }
                  label="Enable QR Code Expiration"
                />

                {expirationEnabled && (
                  <TextField
                    fullWidth
                    label="Expiration Date"
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    helperText="QR code will be disabled after this date and time"
                    inputProps={{
                      min: new Date().toISOString().slice(0, 16)
                    }}
                  />
                )}

                <Alert severity="warning">
                  <Typography variant="caption">
                    <strong>Note:</strong> Expiration only works for dynamic QR codes that redirect through our service. 
                    Static QR codes cannot be disabled after creation.
                  </Typography>
                </Alert>

                <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, mt: 2 }} />

                <Alert severity="info">
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    Password Protection
                  </Typography>
                  <Typography variant="caption">
                    Require a password to access the destination URL. Users will be prompted to enter 
                    the password before being redirected.
                  </Typography>
                </Alert>

                <FormControlLabel
                  control={
                    <Switch
                      checked={passwordEnabled}
                      onChange={(e) => setPasswordEnabled(e.target.checked)}
                    />
                  }
                  label="Enable Password Protection"
                />

                {passwordEnabled && (
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a secure password"
                    helperText="Users will need this password to access the QR code content"
                    inputProps={{
                      minLength: 4,
                      maxLength: 50
                    }}
                  />
                )}

                <Alert severity="warning">
                  <Typography variant="caption">
                    <strong>Security Note:</strong> Password protection requires dynamic QR codes. 
                    Make sure to save your password - it cannot be recovered if lost.
                  </Typography>
                </Alert>
              </Stack>
            )}
          </Paper>
        </Box>

        {/* Right Panel - Preview & Actions */}
        <Box>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            position: { lg: 'sticky' },
            top: 20,
          }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Preview
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: 280, sm: 320 },
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                mb: 3,
                p: 3,
                border: '2px dashed',
                borderColor: 'divider',
                '& > div': {
                  maxWidth: '100%',
                  height: 'auto',
                  '& canvas, & svg': {
                    maxWidth: '100%',
                    height: 'auto !important',
                  }
                }
              }}
            >
              {enableAnimation ? (
                <AnimatedQRCode
                  value={content || 'https://qrstudio.app'}
                  size={Math.min(size, 300)}
                  animationType={animationType}
                  pattern={pattern as any}
                  baseColor={useGradient ? gradientColor1 : foreground}
                  speed={animationSpeed}
                />
              ) : (
                <div ref={qrCodeRef} />
              )}
            </Box>
            
            {enableAnimation && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="caption">
                  ✨ Animation Preview Active • {animationType.charAt(0).toUpperCase() + animationType.slice(1)} Effect
                </Typography>
              </Alert>
            )}

            <Stack spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving || !content}
                sx={{ 
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {saving ? 'Saving...' : 'Save QR Code'}
              </Button>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownload('png')}
                  startIcon={<DownloadIcon />}
                  disabled={!content}
                  sx={{ py: 1, textTransform: 'none' }}
                >
                  PNG
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownload('svg')}
                  startIcon={<DownloadIcon />}
                  disabled={!content}
                  sx={{ py: 1, textTransform: 'none' }}
                >
                  SVG
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownload('jpeg')}
                  startIcon={<DownloadIcon />}
                  disabled={!content}
                  sx={{ py: 1, textTransform: 'none' }}
                >
                  JPEG
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleCopyImage}
                  startIcon={<ContentCopyIcon />}
                  disabled={!content}
                  sx={{ py: 1, textTransform: 'none' }}
                >
                  Copy
                </Button>
              </Box>
              
              {enableAnimation && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    💡 <strong>Tip:</strong> For animated QR codes, consider using screen recording or GIF capture tools to save the animation.
                  </Typography>
                </Alert>
              )}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
