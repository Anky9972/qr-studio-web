'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Camera,
  Upload,
  Copy,
  ExternalLink,
  Trash2,
  Heart,
  Maximize2,
  X,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Focus
} from 'lucide-react'
import jsQR from 'jsqr'
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library'
import { useScanHistoryStore, ScanResult } from '@/store/scanHistoryStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { useTranslations } from '@/lib/useTranslations'

export default function ScanPage() {
  const { addScan, scans, favorites, toggleFavorite, removeScan } = useScanHistoryStore()
  const t = useTranslations('scan')

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera')
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [barcodeMode, setBarcodeMode] = useState(false) // QR mode vs Barcode mode

  // Upload scanning refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const barcodeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  // Initialize barcode reader for uploads only
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
  }, [])

  const stopCamera = useCallback(() => {
    setScanning(false)
  }, [])

  const startCamera = async () => {
    setError('')
    setScanning(true)
  }

  // Trigger haptic feedback on successful scan
  const triggerHapticFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]) // Quick double vibration
    }
  }

  const handleScan = (results: IDetectedBarcode[]) => {
    if (results && results.length > 0) {
      const result = results[0]
      const rawValue = result.rawValue
      const format = result.format

      // Debounce logic could go here if needed, but 'Scanner' usually handles frame timing well
      // trigger haptic feedback
      triggerHapticFeedback()

      handleScanResult(
        rawValue,
        'camera',
        format.toLowerCase().includes('qr') ? 'QR_CODE' : 'BARCODE',
        format
      )
    }
  }

  const handleScanError = (err: unknown) => {
    // Suppress console spam for common "no code found" type errors if the library emits them
    // But typically we log real errors
    console.error(err)
    if (err instanceof Error) {
      // Only show critical errors in UI
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setError('Camera access denied or camera not found.')
      }
    }
  }

  const handleScanResult = (
    content: string,
    source: 'camera' | 'upload',
    format: 'QR_CODE' | 'BARCODE' = 'QR_CODE',
    barcodeType?: string
  ) => {
    // Avoid duplicate scans if content matches lastScan within a short window?
    // For now we just process it.

    // Check if duplicate of immediately previous scan to avoid spamming user
    if (lastScan && lastScan.content === content && (new Date().getTime() - new Date(lastScan.timestamp).getTime() < 2000)) {
      return;
    }

    const scanResult: ScanResult = {
      id: crypto.randomUUID(),
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
              // Try ZXing first for barcodes using the manual reader ref
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {barcodeMode ? t('titleBarcode') : t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {barcodeMode
              ? t('descriptionBarcode')
              : t('description')
            }
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
          <Label htmlFor="mode-switch" className="text-sm font-medium cursor-pointer">{t('barcodeMode')}</Label>
          <Switch
            id="mode-switch"
            checked={barcodeMode}
            onCheckedChange={(checked) => {
              setBarcodeMode(checked)
              // If we wanted to update scanner formats live, we can, 
              // but Scanner usually takes 'formats' prop updates Reactively
            }}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Scanner Panel */}
        <div className="flex-1 min-w-0">
          <Card variant="glass" className="h-full flex flex-col overflow-hidden">
            {/* Custom Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => { setActiveTab('camera'); setError(''); }}
                className={cn(
                  "flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2",
                  activeTab === 'camera'
                    ? "bg-white/5 text-electric-cyan border-b-2 border-electric-cyan"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Camera className="w-4 h-4" /> {t('tabs.camera')}
              </button>
              <button
                onClick={() => { setActiveTab('upload'); stopCamera(); setError(''); }}
                className={cn(
                  "flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2",
                  activeTab === 'upload'
                    ? "bg-white/5 text-electric-cyan border-b-2 border-electric-cyan"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Upload className="w-4 h-4" /> {t('tabs.upload')}
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              {/* Camera Tab */}
              {activeTab === 'camera' && (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="relative flex-1 bg-black rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center border border-white/10 group">
                    {!scanning && (
                      <div className="text-center p-8 space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all">
                          <Camera className="w-10 h-10 text-gray-400 group-hover:text-electric-cyan transition-colors" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{t('camera.accessRequired')}</h3>
                          <p className="text-gray-400 max-w-xs mx-auto text-sm">
                            {t('camera.accessDescription')}
                          </p>
                        </div>
                      </div>
                    )}

                    {scanning && (
                      <div className="absolute inset-0 w-full h-full">
                        {/* Core Scanner Component */}
                        <Scanner
                          onScan={handleScan}
                          onError={handleScanError}
                          components={{
                            finder: false,
                          }}

                          styles={{
                            container: { width: '100%', height: '100%' },
                            video: { width: '100%', height: '100%', objectFit: 'cover' }
                          }}
                        />

                        {/* Custom Overlay (Finder) */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                          <div className="absolute inset-0 border-[40px] border-black/50"></div>
                          <div className="absolute inset-[40px] border-2 border-electric-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-electric-cyan -mt-1 -ml-1"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-electric-cyan -mt-1 -mr-1"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-electric-cyan -mb-1 -ml-1"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-electric-cyan -mb-1 -mr-1"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-electric-cyan/80 animate-scan"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {!scanning ? (
                      <Button
                        variant="glow"
                        size="lg"
                        onClick={startCamera}
                        className="w-full"
                      >
                        <Camera className="w-5 h-5 mr-2" /> {t('camera.start')}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={stopCamera}
                        className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400"
                      >
                        <X className="w-5 h-5 mr-2" /> {t('camera.stop')}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="flex-1 flex flex-col justify-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 min-h-[300px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-8 hover:border-electric-cyan/50 hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-electric-cyan transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('upload.title')}</h3>
                    <p className="text-muted-foreground text-center max-w-sm mb-4">
                      {t('upload.description')}
                    </p>
                    <Button variant="outline" className="pointer-events-none">
                      {t('upload.selectFile')}
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Last Scan Result */}
              {lastScan && (
                <div className="mt-6 pt-6 border-t border-white/10 animate-in slide-in-from-bottom-5 fade-in">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('result.title')}</h3>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">{lastScan.type.toUpperCase()}</Badge>
                          <span className="text-xs text-emerald-500/70">{new Date(lastScan.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="font-mono text-sm text-emerald-100 break-all">{lastScan.content}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleCopy(lastScan.content)} className="h-8 w-8 p-0 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20">
                          <Copy className="w-4 h-4" />
                        </Button>
                        {lastScan.type === 'url' && (
                          <Button size="sm" variant="outline" onClick={() => handleOpen(lastScan.content)} className="h-8 w-8 p-0 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* History Panel */}
        <div className="w-full lg:w-[400px]">
          <Card variant="glass" className="h-[calc(100vh-200px)] min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-center lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">{t('history.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('history.subtitle')}</p>
              </div>
              <Badge variant="outline">{scans.length}</Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {scans.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                  <RefreshCw className="w-12 h-12 mb-4 opacity-20" />
                  <p>{t('history.empty')}</p>
                  <p className="text-sm">{t('history.emptySubtitle')}</p>
                </div>
              ) : (
                scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-electric-cyan/30 rounded-lg p-3 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        scan.type === 'url' ? 'bg-blue-500/20 text-blue-400' :
                          scan.type === 'wifi' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                      )}>
                        {scan.type === 'url' ? <ExternalLink size={18} /> :
                          scan.type === 'wifi' ? <Maximize2 size={18} /> :
                            <Copy size={18} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">{scan.type}</span>
                          <span className="text-[10px] text-gray-500">{new Date(scan.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p
                          onClick={() => handleCopy(scan.content)}
                          className="text-sm font-medium text-white truncate cursor-pointer hover:text-electric-cyan transition-colors"
                        >
                          {scan.content}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleFavorite(scan.id)}
                          className={cn("p-1.5 rounded hover:bg-white/10 transition-colors", favorites.includes(scan.id) ? "text-red-500" : "text-gray-400")}
                        >
                          <Heart size={14} fill={favorites.includes(scan.id) ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => removeScan(scan.id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
