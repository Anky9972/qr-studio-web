'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import jsQR from 'jsqr'
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library'
import { useScanHistoryStore, ScanResult } from '@/store/scanHistoryStore'

export default function ScanPage() {
  const { addScan, scans, favorites, toggleFavorite, removeScan } = useScanHistoryStore()
  
  const [activeTab, setActiveTab] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [barcodeMode, setBarcodeMode] = useState(false) // QR mode vs Barcode mode
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const streamRef = useRef<MediaStream | null>(null)
  const barcodeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  // Initialize barcode reader
  useEffect(() => {
    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.ITF,
      BarcodeFormat.CODABAR,
    ])
    barcodeReaderRef.current = new BrowserMultiFormatReader(hints)
    
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setScanning(true)
        
        if (barcodeMode) {
          // Use ZXing for barcode scanning
          scanWithZXing()
        } else {
          // Use jsQR for QR code scanning
          requestAnimationFrame(scanFrame)
        }
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.')
      console.error('Camera error:', err)
    }
  }

  const scanWithZXing = async () => {
    if (!barcodeReaderRef.current || !videoRef.current) return

    try {
      const result = await barcodeReaderRef.current.decodeOnceFromVideoDevice(
        undefined,
        videoRef.current
      )
      
      if (result) {
        const format = result.getBarcodeFormat()
        const formatName = BarcodeFormat[format]
        
        handleScanResult(
          result.getText(),
          'camera',
          formatName === 'QR_CODE' ? 'QR_CODE' : 'BARCODE',
          formatName
        )
      }
    } catch (err: any) {
      if (err?.name !== 'NotFoundException') {
        console.error('Barcode scan error:', err)
      }
      // Continue scanning
      if (scanning) {
        setTimeout(scanWithZXing, 300)
      }
    }
  }

  const stopCamera = () => {
    setScanning(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const scanFrame = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          handleScanResult(code.data, 'camera')
          return
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame)
  }

  const handleScanResult = (
    content: string,
    source: 'camera' | 'upload',
    format: 'QR_CODE' | 'BARCODE' = 'QR_CODE',
    barcodeType?: string
  ) => {
    const scanResult: ScanResult = {
      id: Date.now().toString(),
      content,
      type: detectQRType(content),
      format,
      barcodeType,
      timestamp: new Date(),
      source,
    }

    addScan(scanResult)
    setLastScan(scanResult)
    setSuccess(
      format === 'BARCODE'
        ? `${barcodeType} barcode scanned successfully!`
        : 'QR code scanned successfully!'
    )
    setTimeout(() => setSuccess(''), 3000)
    
    if (source === 'camera') {
      stopCamera()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    try {
      const image = new Image()
      const reader = new FileReader()

      reader.onload = async (e) => {
        image.onload = async () => {
          const canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          const ctx = canvas.getContext('2d')

          if (ctx) {
            ctx.drawImage(image, 0, 0)
            
            if (barcodeMode) {
              // Try ZXing first for barcodes
              try {
                if (barcodeReaderRef.current) {
                  const result = await barcodeReaderRef.current.decodeFromImageElement(image)
                  const format = result.getBarcodeFormat()
                  const formatName = BarcodeFormat[format]
                  
                  handleScanResult(
                    result.getText(),
                    'upload',
                    formatName === 'QR_CODE' ? 'QR_CODE' : 'BARCODE',
                    formatName
                  )
                  return
                }
              } catch (err) {
                // Fall through to try jsQR
              }
            }
            
            // Try jsQR for QR codes
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height)

            if (code) {
              handleScanResult(code.data, 'upload', 'QR_CODE')
            } else {
              setError(`No ${barcodeMode ? 'barcode' : 'QR code'} found in the image`)
            }
          }
        }
        image.src = e.target?.result as string
      }

      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to process image')
    }
  }

  const detectQRType = (content: string): string => {
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return 'url'
    } else if (content.startsWith('mailto:')) {
      return 'email'
    } else if (content.startsWith('tel:')) {
      return 'phone'
    } else if (content.startsWith('WIFI:')) {
      return 'wifi'
    } else if (content.startsWith('BEGIN:VCARD')) {
      return 'vcard'
    } else if (content.startsWith('geo:')) {
      return 'location'
    }
    return 'text'
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleOpen = (content: string) => {
    if (content.startsWith('http://') || content.startsWith('https://')) {
      window.open(content, '_blank')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {barcodeMode ? 'Scan Barcode' : 'Scan QR Code'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {barcodeMode 
              ? 'Scan UPC, EAN-13, Code128, and other barcode formats'
              : 'Use your camera or upload an image to scan QR codes'
            }
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={barcodeMode}
              onChange={(e) => {
                setBarcodeMode(e.target.checked)
                if (scanning) {
                  stopCamera()
                }
              }}
            />
          }
          label="Barcode Mode"
        />
      </Box>

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

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Scanner Panel */}
        <Box sx={{ flex: '1 1 60%', minWidth: 300 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
              <Tab label="Camera" icon={<CameraAltIcon />} iconPosition="start" />
              <Tab label="Upload" icon={<UploadFileIcon />} iconPosition="start" />
            </Tabs>

            {/* Camera Tab */}
            {activeTab === 0 && (
              <Box>
                <Box
                  sx={{
                    position: 'relative',
                    backgroundColor: 'background.default',
                    borderRadius: 2,
                    overflow: 'hidden',
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!scanning && (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                      <CameraAltIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Click the button below to start scanning
                      </Typography>
                    </Box>
                  )}
                  
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: scanning ? 'block' : 'none',
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </Box>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  {!scanning ? (
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<CameraAltIcon />}
                      onClick={startCamera}
                    >
                      Start Camera
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={stopCamera}
                    >
                      Stop Camera
                    </Button>
                  )}
                </Box>
              </Box>
            )}

            {/* Upload Tab */}
            {activeTab === 1 && (
              <Box>
                <Box
                  sx={{
                    border: 2,
                    borderColor: 'divider',
                    borderStyle: 'dashed',
                    borderRadius: 2,
                    p: 6,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadFileIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Upload QR Code Image
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to browse or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Supports: JPG, PNG, WEBP
                  </Typography>
                </Box>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </Box>
            )}

            {/* Last Scan Result */}
            {lastScan && (
              <Paper sx={{ mt: 3, p: 2, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Last Scanned:
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
                  {lastScan.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleCopy(lastScan.content)}
                    startIcon={<ContentCopyIcon />}
                  >
                    Copy
                  </Button>
                  {lastScan.type === 'url' && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpen(lastScan.content)}
                      startIcon={<OpenInNewIcon />}
                    >
                      Open
                    </Button>
                  )}
                </Box>
              </Paper>
            )}
          </Paper>
        </Box>

        {/* History Panel */}
        <Box sx={{ flex: '1 1 35%', minWidth: 300 }}>
          <Paper sx={{ p: 3, maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Scan History ({scans.length})
            </Typography>

            {scans.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No scans yet. Start scanning to see history.
                </Typography>
              </Box>
            ) : (
              <List>
                {scans.map((scan) => (
                  <ListItem
                    key={scan.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => toggleFavorite(scan.id)}
                        >
                          {favorites.includes(scan.id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeScan(scan.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <Box sx={{ width: '100%', pr: 8 }}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip label={scan.type} size="small" color="primary" />
                        <Chip label={scan.source} size="small" />
                        {scan.barcodeType && (
                          <Chip 
                            label={scan.barcodeType} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: 'break-all',
                          mb: 1,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleCopy(scan.content)}
                      >
                        {scan.content.length > 100
                          ? `${scan.content.substring(0, 100)}...`
                          : scan.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(scan.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
