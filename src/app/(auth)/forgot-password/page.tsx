'use client'

import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
} from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to send reset email')
        return
      }

      setSuccessMsg('Password reset link sent! Check your email.')
      setEmail('')
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
    } finally {
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
        bgcolor: 'primary.main',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 440,
          width: '100%',
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Logo & Title */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <QrCode2Icon sx={{ fontSize: 48, color: 'primary.main', mr: 1 }} />
            <Typography variant="h4" fontWeight={700} color="primary">
              QR Studio
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Reset your password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email and we&apos;ll send you a link to reset your password
          </Typography>
        </Box>

        {/* Error/Success Alert */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMsg}
          </Alert>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ py: 1.5, mb: 2 }}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        {/* Back to Sign In */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <MuiLink
            component={Link}
            href="/signin"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Back to sign in
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  )
}
