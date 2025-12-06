'use client'

import { useState } from 'react'
import {
  Search,
  History,
  QrCode,
  ScanLine,
  Heart,
  Trash2,
  Download,
  Copy,
  MoreVertical,
  FileSpreadsheet,
  Trash,
  ExternalLink,
  Wifi,
  Mail,
  Phone,
  MapPin,
  Contact,
  Type
} from 'lucide-react'
import { useScanHistoryStore } from '@/store/scanHistoryStore'
import { useQRCodeStore } from '@/store/qrCodeStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert'
import { cn } from '@/lib/utils'

export default function HistoryPage() {
  const { scans, favorites: scanFavorites, toggleFavorite, removeScan, clearHistory } = useScanHistoryStore()
  const { qrCodes } = useQRCodeStore()

  const [activeTab, setActiveTab] = useState<'all' | 'scans' | 'generated'>('all')
  const [search, setSearch] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)
  const [success, setSuccess] = useState('')

  // Combine scans and generated QR codes for "All" view
  const allHistory = [
    ...scans.map(scan => ({
      id: scan.id,
      type: 'scan' as const,
      content: scan.content,
      qrType: scan.type,
      timestamp: new Date(scan.timestamp),
      source: scan.source,
      favorite: scanFavorites.includes(scan.id),
      name: undefined
    })),
    ...qrCodes.map(qr => ({
      id: qr.id,
      type: 'generated' as const,
      content: qr.content,
      qrType: qr.qrType,
      timestamp: new Date(qr.createdAt),
      source: 'generator',
      favorite: qr.favorite,
      name: qr.name
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Filter history based on active tab and search
  const filteredHistory = allHistory.filter(item => {
    // Tab filter
    if (activeTab === 'scans' && item.type !== 'scan') return false
    if (activeTab === 'generated' && item.type !== 'generated') return false

    // Favorites filter
    if (showFavorites && !item.favorite) return false

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        item.content.toLowerCase().includes(searchLower) ||
        item.qrType.toLowerCase().includes(searchLower) ||
        (item.name && item.name.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleDelete = (id: string, type: 'scan' | 'generated') => {
    if (!confirm('Are you sure you want to delete this item?')) return

    if (type === 'scan') {
      removeScan(id)
      setSuccess('Scan deleted')
    } else {
      // In a real app, delete via API/Store
      setSuccess('QR code deleted (simulation)')
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleToggleFavorite = (id: string, type: 'scan' | 'generated') => {
    if (type === 'scan') {
      toggleFavorite(id)
    }
    // QR code favorite logic would go here
  }

  const handleExportCSV = () => {
    const headers = ['Type', 'Name', 'Content', 'QR Type', 'Timestamp', 'Favorite']
    const rows = filteredHistory.map(item => [
      item.type,
      item.name || '',
      item.content.replace(/"/g, '""'), // Escape quotes
      item.qrType,
      item.timestamp.toISOString(),
      item.favorite ? 'Yes' : 'No',
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    setSuccess('History exported to CSV!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all scan history? This cannot be undone.')) {
      clearHistory()
      setSuccess('History cleared')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url': return <ExternalLink size={16} />
      case 'wifi': return <Wifi size={16} />
      case 'email': return <Mail size={16} />
      case 'phone': return <Phone size={16} />
      case 'location': return <MapPin size={16} />
      case 'vcard': return <Contact size={16} />
      default: return <Type size={16} />
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            History
          </h1>
          <p className="text-muted-foreground mt-1">
            View your recent scans and generated QR codes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={filteredHistory.length === 0}
            className="hidden sm:flex"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleClearHistory}
            disabled={scans.length === 0}
            className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500"
          >
            <Trash className="w-4 h-4 mr-2" /> Clear Scans
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-500">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <Card variant="glass" className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Tabs */}
        <div className="flex p-1 bg-black/20 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === 'all' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('scans')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
              activeTab === 'scans' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <ScanLine size={14} /> Scans
          </button>
          <button
            onClick={() => setActiveTab('generated')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
              activeTab === 'generated' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <QrCode size={14} /> Generated
          </button>
        </div>

        {/* Search & Favorites */}
        <div className="flex flex-1 md:max-w-md gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFavorites ? "glow" : "outline"}
            size="icon"
            onClick={() => setShowFavorites(!showFavorites)}
            title="Toggle Favorites"
            className={cn(showFavorites ? "" : "text-gray-400")}
          >
            <Heart size={18} fill={showFavorites ? "currentColor" : "none"} />
          </Button>
        </div>
      </Card>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-white/5 rounded-xl border border-white/5 border-dashed">
          <History className="w-16 h-16 mb-4 opacity-20" />
          <h3 className="text-xl font-semibold text-white mb-2">No history found</h3>
          <p className="max-w-sm mx-auto">
            {search || showFavorites
              ? "Try adjusting your search or filters to see more results."
              : "Your scanned and generated QR codes will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <Card
              key={`${item.type}-${item.id}`}
              variant="glass"
              className="group hover:border-electric-cyan/30 transition-all duration-300"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      item.type === 'scan' ? "bg-emerald-500/10 text-emerald-400" : "bg-electric-cyan/10 text-electric-cyan"
                    )}>
                      {item.type === 'scan' ? <ScanLine size={20} /> : <QrCode size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {item.name ? (
                          <span className="font-semibold text-white">{item.name}</span>
                        ) : (
                          <span className="font-semibold text-white capitalize">{item.qrType}</span>
                        )}
                        {item.favorite && <Heart size={12} className="text-red-500 fill-current" />}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                    {item.qrType}
                  </Badge>
                </div>

                <div className="bg-black/20 rounded p-3 font-mono text-sm text-gray-300 break-all border border-white/5">
                  {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {/* Type Action Button (e.g. Open Link) */}
                    {item.qrType === 'url' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-electric-cyan hover:bg-electric-cyan/10"
                        onClick={() => window.open(item.content, '_blank')}
                      >
                        <ExternalLink size={14} className="mr-1.5" /> Open
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      onClick={() => handleCopy(item.content)}
                      title="Copy Content"
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn("h-8 w-8 p-0 transition-colors", item.favorite ? "text-red-500 hover:bg-red-500/10" : "text-gray-400 hover:text-red-400")}
                      onClick={() => handleToggleFavorite(item.id, item.type)}
                      title="Toggle Favorite"
                    >
                      <Heart size={16} fill={item.favorite ? "currentColor" : "none"} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDelete(item.id, item.type)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
