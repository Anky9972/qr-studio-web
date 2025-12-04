'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import BarChartIcon from '@mui/icons-material/BarChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

interface Variant {
  id: string
  name: string
  content: string
  weight: number
  scans: number
  conversions: number
  qrCodeId: string
  createdAt: string
}

interface ABTest {
  id: string
  campaignId: string
  name: string
  description: string | null
  active: boolean
  startDate: string
  endDate: string | null
  variants: Variant[]
  totalScans: number
}

export default function ABTestingPage() {
  const params = useParams()
  const router = useRouter()
  const [abTests, setAbTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [variantDialogOpen, setVariantDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)

  const [testForm, setTestForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  const [variantForm, setVariantForm] = useState({
    name: '',
    content: '',
    weight: 50,
  })

  useEffect(() => {
    if (params.id) {
      fetchABTests()
    }
  }, [params.id])

  const fetchABTests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/campaigns/${params.id}/ab-tests`)
      if (response.ok) {
        const data = await response.json()
        setAbTests(data.abTests || [])
      }
    } catch (error) {
      console.error('Failed to fetch A/B tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTest = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}/ab-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testForm),
      })

      if (response.ok) {
        setCreateDialogOpen(false)
        setTestForm({ name: '', description: '', startDate: '', endDate: '' })
        fetchABTests()
      }
    } catch (error) {
      console.error('Failed to create A/B test:', error)
    }
  }

  const handleAddVariant = async () => {
    if (!selectedTest) return

    try {
      const response = await fetch(`/api/campaigns/${params.id}/ab-tests/${selectedTest.id}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variantForm),
      })

      if (response.ok) {
        setVariantDialogOpen(false)
        setVariantForm({ name: '', content: '', weight: 50 })
        fetchABTests()
      }
    } catch (error) {
      console.error('Failed to add variant:', error)
    }
  }

  const calculateConversionRate = (variant: Variant): number => {
    if (variant.scans === 0) return 0
    return parseFloat(((variant.conversions / variant.scans) * 100).toFixed(2))
  }

  const getWinningVariant = (test: ABTest) => {
    if (test.variants.length === 0) return null
    return test.variants.reduce((best, current) => {
      const currentRate = calculateConversionRate(current)
      const bestRate = calculateConversionRate(best)
      return currentRate > bestRate ? current : best
    })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            A/B Testing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Test different QR code variants to optimize campaign performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create A/B Test
        </Button>
      </Box>

      {abTests.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
          <BarChartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No A/B Tests Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first A/B test to compare different QR code variants
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create A/B Test
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {abTests.map((test) => {
            const winner = getWinningVariant(test)
            return (
              <Paper key={test.id} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {test.name}
                      </Typography>
                      <Chip
                        label={test.active ? 'Active' : 'Inactive'}
                        color={test.active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    {test.description && (
                      <Typography variant="body2" color="text.secondary">
                        {test.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {new Date(test.startDate).toLocaleDateString()} - 
                      {test.endDate ? new Date(test.endDate).toLocaleDateString() : 'Ongoing'}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedTest(test)
                      setVariantDialogOpen(true)
                    }}
                  >
                    Add Variant
                  </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">Total Scans</Typography>
                      <Typography variant="h5" fontWeight={700}>{test.totalScans}</Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">Variants</Typography>
                      <Typography variant="h5" fontWeight={700}>{test.variants.length}</Typography>
                    </CardContent>
                  </Card>
                  {winner && (
                    <Card variant="outlined" sx={{ bgcolor: 'success.50' }}>
                      <CardContent>
                        <Typography color="success.main" variant="body2">
                          <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                          Winning Variant
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {winner.name} ({calculateConversionRate(winner)}%)
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Variant</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell align="center">Weight</TableCell>
                        <TableCell align="right">Scans</TableCell>
                        <TableCell align="right">Conversions</TableCell>
                        <TableCell align="right">Conv. Rate</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {test.variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell>
                            <Typography fontWeight={600}>{variant.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {variant.content}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={`${variant.weight}%`} size="small" />
                          </TableCell>
                          <TableCell align="right">{variant.scans}</TableCell>
                          <TableCell align="right">{variant.conversions}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                              <LinearProgress
                                variant="determinate"
                                value={calculateConversionRate(variant)}
                                sx={{ width: 60 }}
                              />
                              <Typography variant="body2">
                                {calculateConversionRate(variant)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Copy QR URL">
                              <IconButton size="small">
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )
          })}
        </Box>
      )}

      {/* Create A/B Test Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create A/B Test</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Test Name"
              value={testForm.name}
              onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
              placeholder="Homepage vs Landing Page Test"
            />
            <TextField
              fullWidth
              label="Description"
              value={testForm.description}
              onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={testForm.startDate}
              onChange={(e) => setTestForm({ ...testForm, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date (Optional)"
              type="date"
              value={testForm.endDate}
              onChange={(e) => setTestForm({ ...testForm, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTest} variant="contained" disabled={!testForm.name}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Variant Dialog */}
      <Dialog open={variantDialogOpen} onClose={() => setVariantDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Test Variant</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Variant Name"
              value={variantForm.name}
              onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
              placeholder="Variant A"
            />
            <TextField
              fullWidth
              label="Content / URL"
              value={variantForm.content}
              onChange={(e) => setVariantForm({ ...variantForm, content: e.target.value })}
              placeholder="https://example.com/variant-a"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Traffic Weight (%)"
              type="number"
              value={variantForm.weight}
              onChange={(e) => setVariantForm({ ...variantForm, weight: Number(e.target.value) })}
              inputProps={{ min: 0, max: 100 }}
              helperText="Percentage of traffic to direct to this variant"
            />
            <Alert severity="info">
              Traffic will be distributed based on variant weights. Make sure all weights add up to 100%.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVariantDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVariant} variant="contained" disabled={!variantForm.name || !variantForm.content}>
            Add Variant
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
