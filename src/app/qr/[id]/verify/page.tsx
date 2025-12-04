'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useTheme } from '@mui/material/styles'

export default function QRVerifyPage() {
  const params = useParams()
  const router = useRouter()
  const theme = useTheme()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      setError('Please enter a password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/qr-codes/${params.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid password')
        setLoading(false)
        return
      }

      // Redirect to the actual destination
      if (data.destination) {
        window.location.href = data.destination
      } else {
        setError('Invalid QR code configuration')
        setLoading(false)
      }
    } catch (err) {
      setError('Failed to verify password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Password Protected
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            This QR code is protected. Please enter the password to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !password}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Verifying...
                </>
              ) : (
                'Access Content'
              )}
            </Button>
          </form>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Don't have the password? Contact the QR code owner.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
