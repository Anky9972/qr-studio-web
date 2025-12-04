'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import HistoryIcon from '@mui/icons-material/History'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { useScanHistoryStore } from '@/store/scanHistoryStore'
import { useQRCodeStore } from '@/store/qrCodeStore'

export default function HistoryPage() {
  const { scans, favorites: scanFavorites, toggleFavorite, removeScan, clearHistory } = useScanHistoryStore()
  const { qrCodes } = useQRCodeStore()
  
  const [activeTab, setActiveTab] = useState(0) // 0: All, 1: Scans, 2: Generated
  const [search, setSearch] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement | null
    item: any
    type: 'scan' | 'generated'
  } | null>(null)
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
    })),
    ...qrCodes.map(qr => ({
      id: qr.id,
      type: 'generated' as const,
      content: qr.content,
      qrType: qr.qrType,
      timestamp: new Date(qr.createdAt),
      name: qr.name,
      favorite: qr.favorite,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Filter history based on active tab and search
  const filteredHistory = allHistory.filter(item => {
    // Tab filter
    if (activeTab === 1 && item.type !== 'scan') return false
    if (activeTab === 2 && item.type !== 'generated') return false

    // Favorites filter
    if (showFavorites && !item.favorite) return false

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        item.content.toLowerCase().includes(searchLower) ||
        item.qrType.toLowerCase().includes(searchLower) ||
        ('name' in item && item.name?.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: any,
    type: 'scan' | 'generated'
  ) => {
    setMenuAnchor({ element: event.currentTarget, item, type })
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(''), 2000)
    handleMenuClose()
  }

  const handleDelete = () => {
    if (!menuAnchor) return

    if (menuAnchor.type === 'scan') {
      removeScan(menuAnchor.item.id)
      setSuccess('Scan deleted')
    } else {
      // Delete from QR codes (would need API call in production)
      setSuccess('QR code deleted')
    }

    setTimeout(() => setSuccess(''), 2000)
    handleMenuClose()
  }

  const handleToggleFavorite = () => {
    if (!menuAnchor) return

    if (menuAnchor.type === 'scan') {
      toggleFavorite(menuAnchor.item.id)
    }
    // For QR codes, would need to call API in production

    handleMenuClose()
  }

  const handleExportCSV = () => {
    const headers = ['Type', 'Content', 'QR Type', 'Timestamp', 'Favorite']
    const rows = filteredHistory.map(item => [
      item.type,
      item.content,
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

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      url: 'primary',
      wifi: 'secondary',
      vcard: 'success',
      email: 'warning',
      phone: 'info',
      text: 'default',
    }
    return colors[type] || 'default'
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your scan and generation history
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportCSV}
            disabled={filteredHistory.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearHistory}
            disabled={scans.length === 0}
          >
            Clear Scans
          </Button>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Tabs and Filters */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label={`All (${allHistory.length})`} />
          <Tab label={`Scans (${scans.length})`} icon={<QrCodeScannerIcon />} iconPosition="start" />
          <Tab label={`Generated (${qrCodes.length})`} icon={<QrCode2Icon />} iconPosition="start" />
        </Tabs>
        
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: '1 1 300px' }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant={showFavorites ? 'contained' : 'outlined'}
            size="small"
            startIcon={showFavorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            Favorites Only
          </Button>
        </Box>
      </Paper>

      {/* History List */}
      <Paper>
        {filteredHistory.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <HistoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No history found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {search || showFavorites
                ? 'Try adjusting your filters'
                : 'Your scan and generation history will appear here'}
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredHistory.map((item, index) => (
              <Box key={item.id}>
                <ListItem
                  sx={{
                    alignItems: 'flex-start',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuOpen(e, item, item.type)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ mt: 1 }}>
                    {item.type === 'scan' ? (
                      <QrCodeScannerIcon color="primary" />
                    ) : (
                      <QrCode2Icon color="primary" />
                    )}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {'name' in item && item.name && (
                          <Typography variant="subtitle1" fontWeight={600} component="span">
                            {item.name}
                          </Typography>
                        )}
                        <Chip
                          label={item.type === 'scan' ? 'Scanned' : 'Generated'}
                          size="small"
                          color="primary"
                        />
                        <Chip
                          label={item.qrType}
                          size="small"
                          color={getTypeColor(item.qrType) as any}
                        />
                        {item.favorite && (
                          <FavoriteIcon color="error" fontSize="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'block' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{
                            display: 'block',
                            wordBreak: 'break-all',
                            mb: 1,
                          }}
                        >
                          {item.content.length > 150
                            ? `${item.content.substring(0, 150)}...`
                            : item.content}
                        </Typography>
                        <Box component="span" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" component="span">
                            {item.timestamp.toLocaleString()}
                          </Typography>
                          {item.type === 'scan' && 'source' in item && (
                            <Chip label={item.source} size="small" variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredHistory.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => menuAnchor && handleCopy(menuAnchor.item.content)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Copy Content
        </MenuItem>
        <MenuItem onClick={handleToggleFavorite}>
          <ListItemIcon>
            {menuAnchor?.item.favorite ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </ListItemIcon>
          {menuAnchor?.item.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}
