'use client'

import { useState, useRef } from 'react'
import {
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  X,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import QRCodeStyling from 'qr-code-styling'
import { jsPDF } from 'jspdf'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface BulkQRData {
  id: string
  content: string
  name?: string
  type: string
  status: 'pending' | 'processing' | 'success' | 'error'
  error?: string
  blob?: Blob
}

export default function BulkGenerationPage() {
  const [qrData, setQrData] = useState<BulkQRData[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // QR Settings
  const [qrSize, setQrSize] = useState(512)
  const [qrType, setQrType] = useState<'png' | 'svg'>('png')
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase()

    if (!['csv', 'xlsx', 'xls'].includes(fileExt || '')) {
      setErrorMsg('Please upload a CSV or Excel file')
      return
    }

    setFile(selectedFile)
    setErrorMsg('')
    setSuccessMsg('')
    parseFile(selectedFile)
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()
    const fileExt = file.name.split('.').pop()?.toLowerCase()

    reader.onload = (e) => {
      try {
        if (fileExt === 'csv') {
          // Parse CSV
          Papa.parse(e.target?.result as string, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              processData(results.data as any[])
            },
            error: (error: any) => {
              setErrorMsg(`CSV parsing error: ${error.message}`)
            }
          })
        } else {
          // Parse Excel
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          processData(jsonData)
        }
      } catch (error) {
        setErrorMsg('Failed to parse file')
      }
    }

    if (fileExt === 'csv') {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  const processData = (data: any[]) => {
    if (!data || data.length === 0) {
      setErrorMsg('No data found in file')
      return
    }

    if (data.length > 1000) {
      setErrorMsg('Maximum 1,000 QR codes allowed per batch (Pro tier limit)')
      return
    }

    // Map data to QR records
    const qrRecords: BulkQRData[] = data.map((row, index) => {
      // Support common column names
      const content = row.content || row.url || row.text || row.data || row.Content || row.URL || row.Text || row.Data
      const name = row.name || row.Name || row.title || row.Title || `QR-${index + 1}`
      const type = row.type || row.Type || 'url'

      return {
        id: `qr-${Date.now()}-${index}`,
        content: String(content || ''),
        name: String(name),
        type: String(type).toLowerCase(),
        status: 'pending' as const,
      }
    })

    // Filter out empty content
    const validRecords = qrRecords.filter(r => r.content.trim())

    if (validRecords.length === 0) {
      setErrorMsg('No valid content found. Ensure your file has a "content", "url", or "text" column')
      return
    }

    setQrData(validRecords)
    setSuccessMsg(`Loaded ${validRecords.length} QR codes from file`)
  }

  const generateAllQRCodes = async () => {
    if (qrData.length === 0) return

    setProcessing(true)
    setProgress(0)
    setErrorMsg('')
    setSuccessMsg('')

    const updatedData = [...qrData]
    let completed = 0

    for (let i = 0; i < updatedData.length; i++) {
      const item = updatedData[i]

      try {
        item.status = 'processing'
        setQrData([...updatedData])

        // Generate QR code
        const qrCode = new QRCodeStyling({
          width: qrSize,
          height: qrSize,
          data: item.content,
          margin: 10,
          qrOptions: {
            errorCorrectionLevel: errorLevel,
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 0,
          },
          dotsOptions: {
            color: '#000000',
            type: 'square',
          },
          backgroundOptions: {
            color: '#ffffff',
          },
        })

        // Get blob
        const rawData = await qrCode.getRawData(qrType)
        if (!rawData) throw new Error('Failed to generate QR code')

        // @ts-expect-error Buffer type compatibility with Blob
        const blob = rawData instanceof Blob ? rawData : new Blob([rawData])

        item.status = 'success'
        item.blob = blob
      } catch (error) {
        item.status = 'error'
        item.error = error instanceof Error ? error.message : 'Generation failed'
      }

      completed++
      setProgress((completed / updatedData.length) * 100)
      setQrData([...updatedData])
    }

    setProcessing(false)

    const successCount = updatedData.filter(i => i.status === 'success').length
    const errorCount = updatedData.filter(i => i.status === 'error').length

    if (errorCount === 0) {
      setSuccessMsg(`Successfully generated ${successCount} QR codes!`)
    } else {
      setErrorMsg(`Generated ${successCount} QR codes, ${errorCount} failed`)
    }
  }

  const downloadAsZip = async () => {
    const successItems = qrData.filter(i => i.status === 'success' && i.blob)

    if (successItems.length === 0) {
      setErrorMsg('No QR codes to download')
      return
    }

    try {
      const zip = new JSZip()
      const folder = zip.folder('qr-codes')

      successItems.forEach((item, index) => {
        const filename = `${item.name || `qr-${index + 1}`}.${qrType}`
        folder?.file(filename, item.blob!)
      })

      // Add CSV manifest
      const csvContent = successItems.map(item => ({
        name: item.name,
        content: item.content,
        type: item.type,
      }))
      const csv = Papa.unparse(csvContent)
      zip.file('manifest.csv', csv)

      // Generate ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' })

      // Download
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-codes-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccessMsg(`Downloaded ${successItems.length} QR codes as ZIP`)
    } catch (error) {
      setErrorMsg('Failed to create ZIP file')
    }
  }

  const clearAll = () => {
    setQrData([])
    setFile(null)
    setProgress(0)
    setErrorMsg('')
    setSuccessMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const downloadTemplate = () => {
    const template = [
      { content: 'https://example.com', name: 'Example Website', type: 'url' },
      { content: 'Hello World', name: 'Sample Text', type: 'text' },
      { content: 'contact@example.com', name: 'Contact Email', type: 'email' },
    ]

    const csv = Papa.unparse(template)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAsPDF = async () => {
    const successItems = qrData.filter(item => item.status === 'success' && item.blob)

    if (successItems.length === 0) {
      setErrorMsg('No QR codes to export')
      return
    }

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const qrSize = 60
      const cols = 2
      const rows = 4
      const spacingX = (pageWidth - 2 * margin - cols * qrSize) / (cols - 1)
      const spacingY = (pageHeight - 2 * margin - rows * qrSize) / (rows - 1)

      let itemIndex = 0
      let pageIndex = 0

      for (const item of successItems) {
        if (!item.blob) continue

        const row = Math.floor(itemIndex / cols) % rows
        const col = itemIndex % cols

        // Add new page if needed
        if (itemIndex > 0 && itemIndex % (cols * rows) === 0) {
          pdf.addPage()
          pageIndex++
        }

        const x = margin + col * (qrSize + spacingX)
        const y = margin + row * (qrSize + spacingY)

        // Convert blob to base64
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(item.blob!)
        })

        // Add QR code image
        pdf.addImage(base64, 'PNG', x, y, qrSize, qrSize)

        // Add label below QR code
        pdf.setFontSize(8)
        pdf.text(
          item.name || item.content.substring(0, 25),
          x + qrSize / 2,
          y + qrSize + 4,
          { align: 'center', maxWidth: qrSize }
        )

        itemIndex++
      }

      // Add footer with metadata
      const totalPages = pdf.getNumberOfPages()
      pdf.setFontSize(8)
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.text(
          `QR Studio - Page ${i} of ${totalPages} - ${successItems.length} QR Codes`,
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        )
      }

      pdf.save(`qr-codes-${Date.now()}.pdf`)
      setSuccessMsg(`Exported ${successItems.length} QR codes to PDF`)
    } catch (error) {
      console.error('PDF generation error:', error)
      setErrorMsg('Failed to create PDF file')
    }
  }

  const successCount = qrData.filter(i => i.status === 'success').length
  const errorCount = qrData.filter(i => i.status === 'error').length
  const pendingCount = qrData.filter(i => i.status === 'pending').length

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Bulk Generation
        </h1>
        <p className="text-muted-foreground">
          Generate hundreds of QR codes at once from a CSV or Excel file
        </p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      {successMsg && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card variant="glass" className="lg:col-span-1 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan font-bold border border-electric-cyan/30">1</div>
            <h2 className="text-lg font-semibold">Upload File</h2>
          </div>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-electric-cyan/50 hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-8 h-8 text-gray-400 group-hover:text-electric-cyan transition-colors" />
                </div>
                <p className="font-medium mb-1">Click to upload or drag file</p>
                <p className="text-xs text-muted-foreground">CSV, XLSX, XLS up to 5MB</p>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">Ready to process</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearAll} className="h-8 w-8 text-red-400 hover:text-red-300">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={downloadTemplate}
              >
                Download Template
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-black/20 p-3 rounded border border-white/5">
              <p className="font-semibold text-gray-300">Required Columns:</p>
              <p>• content (URL/Text)</p>
              <p>• name (Optional label)</p>
              <p>• type (Optional: url, text, email)</p>
            </div>
          </div>
        </Card>

        {/* Settings Section */}
        <Card variant="glass" className="lg:col-span-1 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan font-bold border border-electric-cyan/30">2</div>
            <h2 className="text-lg font-semibold">Configuration</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Size (px)</Label>
              <Input
                type="number"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                min={128}
                max={2048}
                step={64}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={qrType} onValueChange={(v: any) => setQrType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (Raster)</SelectItem>
                    <SelectItem value="svg">SVG (Vector)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Error Correction</Label>
                <Select value={errorLevel} onValueChange={(v: any) => setErrorLevel(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions Section */}
        <Card variant="glass" className="lg:col-span-1 p-6 space-y-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan font-bold border border-electric-cyan/30">3</div>
            <h2 className="text-lg font-semibold">Generate & Export</h2>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {processing ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-electric-cyan transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground animate-pulse">Generating QR codes, please wait...</p>
              </div>
            ) : (
              <Button
                variant="glow"
                size="lg"
                className="w-full text-lg h-14"
                onClick={generateAllQRCodes}
                disabled={qrData.length === 0 || processing}
              >
                <RefreshCw className={cn("mr-2 h-5 w-5", processing && "animate-spin")} />
                Generate {qrData.length > 0 ? `(${qrData.length})` : ''}
              </Button>
            )}

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                className="w-full"
                onClick={downloadAsZip}
                disabled={successCount === 0}
              >
                <Download className="mr-2 h-4 w-4" /> ZIP
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={downloadAsPDF}
                disabled={successCount === 0}
              >
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats and Preview */}
      {qrData.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="glass" className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <FileSpreadsheet className="text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{qrData.length}</p>
              </div>
            </Card>
            <Card variant="glass" className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success</p>
                <p className="text-2xl font-bold text-emerald-500">{successCount}</p>
              </div>
            </Card>
            <Card variant="glass" className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-500">{errorCount}</p>
              </div>
            </Card>
            <Card variant="glass" className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Clock className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-500">{pendingCount}</p>
              </div>
            </Card>
          </div>

          {/* Preview Table */}
          <Card variant="glass" className="overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><Settings size={16} /> Data Preview</h3>
              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-2" /> Clear Table
              </Button>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-white/5 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Content</th>
                    <th className="px-6 py-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {qrData.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-3">
                        {item.status === 'success' && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Success</Badge>}
                        {item.status === 'error' && <Badge variant="destructive">Error</Badge>}
                        {item.status === 'pending' && <Badge variant="outline" className="text-muted-foreground">Pending</Badge>}
                        {item.status === 'processing' && <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse">Processing</Badge>}
                      </td>
                      <td className="px-6 py-3 font-medium">{item.name}</td>
                      <td className="px-6 py-3 text-muted-foreground max-w-xs truncate">{item.content}</td>
                      <td className="px-6 py-3">
                        <Badge variant="secondary" className="uppercase text-[10px]">{item.type}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
