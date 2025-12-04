'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import FilterListIcon from '@mui/icons-material/FilterList'
import CampaignIcon from '@mui/icons-material/Campaign'

interface QRCode {
  id: string
  name: string | null
  type: 'static' | 'dynamic'
  content: string
  qrType: string
  scanCount: number
  favorite: boolean
  createdAt: string
  campaign?: {
    id: string
    name: string
  }
}

export default function QRCodesPage() {
  const router = useRouter()
  const [qrCodes, setQRCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [favoriteFilter, setFavoriteFilter] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement | null
    qrCode: QRCode | null
  }>({ element: null, qrCode: null })
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    qrCode: QRCode | null
    destination: string
  }>({ open: false, qrCode: null, destination: '' })
  const [campaignDialog, setCampaignDialog] = useState<{
    open: boolean
    qrCode: QRCode | null
  }>({ open: false, qrCode: null })
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchQRCodes()
  }, [page, search, typeFilter, favoriteFilter])

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns.map((c: any) => ({ id: c.id, name: c.name })))
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    }
  }

  const fetchQRCodes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(favoriteFilter && { favorite: 'true' }),
      })

      const response = await fetch(`/api/qr-codes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setQRCodes(data.qrCodes)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, qrCode: QRCode) => {
    setMenuAnchor({ element: event.currentTarget, qrCode })
  }

  const handleMenuClose = () => {
    setMenuAnchor({ element: null, qrCode: null })
  }

  const handleToggleFavorite = async (qrCode: QRCode) => {
    try {
      const response = await fetch(`/api/qr-codes/${qrCode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !qrCode.favorite }),
      })
      
      if (response.ok) {
        fetchQRCodes()
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleDelete = async (qrCode: QRCode) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return

    try {
      const response = await fetch(`/api/qr-codes/${qrCode.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchQRCodes()
      }
    } catch (error) {
      console.error('Failed to delete QR code:', error)
    }
    handleMenuClose()
  }

  const handleDownload = async (qrCode: QRCode) => {
    try {
      const response = await fetch('/api/qr-codes/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeIds: [qrCode.id],
          format: 'png',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${qrCode.name || 'qrcode'}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
    handleMenuClose()
  }

  const handleEditDestination = (qrCode: QRCode) => {
    setEditDialog({
      open: true,
      qrCode,
      destination: qrCode.content
    })
    handleMenuClose()
  }

  const handleSaveDestination = async () => {
    if (!editDialog.qrCode) return

    try {
      setSaving(true)
      const response = await fetch(`/api/qr-codes/${editDialog.qrCode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          destination: editDialog.destination,
          content: editDialog.destination 
        }),
      })
      
      if (response.ok) {
        await fetchQRCodes()
        setEditDialog({ open: false, qrCode: null, destination: '' })
      }
    } catch (error) {
      console.error('Failed to update destination:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAssignCampaign = (qrCode: QRCode) => {
    setCampaignDialog({ open: true, qrCode })
    setSelectedCampaignId(qrCode.campaign?.id || '')
    handleMenuClose()
  }

  const handleSaveCampaign = async () => {
    if (!campaignDialog.qrCode) return

    try {
      setSaving(true)
      const response = await fetch(`/api/qr-codes/${campaignDialog.qrCode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          campaignId: selectedCampaignId || null
        }),
      })
      
      if (response.ok) {
        await fetchQRCodes()
        setCampaignDialog({ open: false, qrCode: null })
        setSelectedCampaignId('')
      }
    } catch (error) {
      console.error('Failed to assign campaign:', error)
    } finally {
      setSaving(false)
    }
  }

  const getQRTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      url: 'primary',
      wifi: 'secondary',
      vcard: 'success',
      email: 'warning',
      phone: 'info',
    }
    return colors[type] || 'default'
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My QR Codes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and organize your QR codes
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/generate')}
        >
          Create New
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search QR codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: '1 1 300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="static">Static</MenuItem>
              <MenuItem value="dynamic">Dynamic</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant={favoriteFilter ? 'contained' : 'outlined'}
            startIcon={favoriteFilter ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={() => setFavoriteFilter(!favoriteFilter)}
          >
            Favorites
          </Button>
        </Box>
      </Paper>

      {/* QR Codes Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : qrCodes.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <QrCode2Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No QR codes found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {search || typeFilter !== 'all' || favoriteFilter
              ? 'Try adjusting your filters'
              : 'Create your first QR code to get started'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/dashboard/generate')}
          >
            Create QR Code
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
            mb: 4,
          }}>
            {qrCodes.map((qrCode) => (
              <Card key={qrCode.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={qrCode.type}
                        size="small"
                        color={qrCode.type === 'dynamic' ? 'primary' : 'default'}
                      />
                      <Chip
                        label={qrCode.qrType}
                        size="small"
                        color={getQRTypeColor(qrCode.qrType) as any}
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, qrCode)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" gutterBottom noWrap>
                    {qrCode.name || 'Untitled QR Code'}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {qrCode.content}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {qrCode.scanCount} scans
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleFavorite(qrCode)}
                    >
                      {qrCode.favorite ? (
                        <FavoriteIcon color="error" fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Created {new Date(qrCode.createdAt).toLocaleDateString()}
                  </Typography>

                  {qrCode.campaign && (
                    <Chip
                      label={qrCode.campaign.name}
                      size="small"
                      sx={{ mt: 1 }}
                      icon={<FilterListIcon />}
                    />
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => router.push(`/dashboard/qr-codes/${qrCode.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ShareIcon />}
                    onClick={() => handleDownload(qrCode)}
                  >
                    Share
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor.element}
        open={Boolean(menuAnchor.element)}
        onClose={handleMenuClose}
      >
        {menuAnchor.qrCode?.type === 'dynamic' && (
          <MenuItem onClick={() => menuAnchor.qrCode && handleEditDestination(menuAnchor.qrCode)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Destination</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          if (menuAnchor.qrCode) {
            router.push(`/dashboard/qr-codes/${menuAnchor.qrCode.id}/edit`)
          }
          handleMenuClose()
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Design</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuAnchor.qrCode && handleDownload(menuAnchor.qrCode)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuAnchor.qrCode && handleAssignCampaign(menuAnchor.qrCode)}>
          <ListItemIcon>
            <CampaignIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Assign to Campaign</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuAnchor.qrCode && handleToggleFavorite(menuAnchor.qrCode)}>
          <ListItemIcon>
            {menuAnchor.qrCode?.favorite ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {menuAnchor.qrCode?.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuAnchor.qrCode && handleDelete(menuAnchor.qrCode)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Destination Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, qrCode: null, destination: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Destination URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Destination URL"
            type="url"
            fullWidth
            value={editDialog.destination}
            onChange={(e) => setEditDialog({ ...editDialog, destination: e.target.value })}
            helperText="Change where this QR code redirects without reprinting"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, qrCode: null, destination: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDestination} 
            variant="contained"
            disabled={saving || !editDialog.destination}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign to Campaign Dialog */}
      <Dialog 
        open={campaignDialog.open} 
        onClose={() => setCampaignDialog({ open: false, qrCode: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign to Campaign</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Campaign</InputLabel>
            <Select
              value={selectedCampaignId}
              label="Campaign"
              onChange={(e) => setSelectedCampaignId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {campaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {campaignDialog.qrCode?.campaign 
              ? 'This QR code is currently assigned to a campaign. You can change or remove it.'
              : 'Assign this QR code to a campaign to track its performance.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCampaignDialog({ open: false, qrCode: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCampaign} 
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
