'use client'

import { useState, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import QRCodeStyling from 'qr-code-styling'
import { jsPDF } from 'jspdf'

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
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Bulk QR Code Generation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload CSV or Excel file to generate up to 1,000 QR codes at once
        </Typography>
      </Box>

      {/* Alerts */}
      {errorMsg && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Upload Section */}
        <Paper sx={{ flex: '1 1 360px', minWidth: 280, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            1. Upload File
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ mb: 2, py: 2 }}
            >
              Choose CSV or Excel File
            </Button>
            
            {file && (
              <Chip
                label={file.name}
                onDelete={clearAll}
                color="primary"
                sx={{ maxWidth: '100%' }}
              />
            )}
          </Box>

          <Button
            fullWidth
            variant="text"
            size="small"
            onClick={downloadTemplate}
          >
            Download CSV Template
          </Button>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              File Format Requirements:
            </Typography>
            <Typography variant="caption" component="div">
              • Column: <strong>content</strong> (required) - URL, text, or data
            </Typography>
            <Typography variant="caption" component="div">
              • Column: <strong>name</strong> (optional) - QR code label
            </Typography>
            <Typography variant="caption" component="div">
              • Column: <strong>type</strong> (optional) - url, text, email, etc.
            </Typography>
          </Box>
        </Paper>

        {/* Settings Section */}
        <Paper sx={{ flex: '1 1 320px', minWidth: 260, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            2. QR Code Settings
          </Typography>

          <TextField
            fullWidth
            label="Size (pixels)"
            type="number"
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            inputProps={{ min: 128, max: 2048, step: 64 }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={qrType}
              label="Format"
              onChange={(e) => setQrType(e.target.value as 'png' | 'svg')}
            >
              <MenuItem value="png">PNG</MenuItem>
              <MenuItem value="svg">SVG</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Error Correction</InputLabel>
            <Select
              value={errorLevel}
              label="Error Correction"
              onChange={(e) => setErrorLevel(e.target.value as any)}
            >
              <MenuItem value="L">Low (7%)</MenuItem>
              <MenuItem value="M">Medium (15%)</MenuItem>
              <MenuItem value="Q">Quartile (25%)</MenuItem>
              <MenuItem value="H">High (30%)</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={generateAllQRCodes}
              disabled={qrData.length === 0 || processing}
              sx={{ mb: 2 }}
            >
              {processing ? 'Generating...' : `Generate ${qrData.length} QR Codes`}
            </Button>

            {processing && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                  {Math.round(progress)}% Complete
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadAsZip}
              disabled={successCount === 0}
              sx={{ mb: 1 }}
            >
              Download as ZIP
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadAsPDF}
              disabled={successCount === 0}
              sx={{ mb: 1 }}
            >
              Download as PDF
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={clearAll}
            >
              Clear All
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Stats Cards */}
      {qrData.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 200px' }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Total</Typography>
              <Typography variant="h4" fontWeight={700}>{qrData.length}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px' }}>
            <CardContent>
              <Typography color="success.main" variant="body2">Success</Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">{successCount}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px' }}>
            <CardContent>
              <Typography color="error.main" variant="body2">Failed</Typography>
              <Typography variant="h4" fontWeight={700} color="error.main">{errorCount}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px' }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Pending</Typography>
              <Typography variant="h4" fontWeight={700}>{pendingCount}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Data Table */}
      {qrData.length > 0 && (
        <Paper sx={{ mt: 3, borderRadius: 2 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              QR Codes Preview
            </Typography>
            <IconButton onClick={clearAll} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width={60}>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qrData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.status === 'success' && <CheckCircleIcon color="success" />}
                      {item.status === 'error' && <ErrorIcon color="error" />}
                      {item.status === 'pending' && <Chip label="Pending" size="small" />}
                      {item.status === 'processing' && <Chip label="..." size="small" color="primary" />}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.content}
                    </TableCell>
                    <TableCell>
                      <Chip label={item.type} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  )
}
