'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Link from 'next/link'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    if (!token || !email) {
      setIsValidToken(false)
      setErrorMsg('Invalid reset link. Please request a new password reset.')
    }
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    // Validation
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to reset password')
        return
      }

      setSuccessMsg('Password reset successfully! Redirecting to sign in...')
      
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isValidToken) {
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <QrCode2Icon sx={{ fontSize: 48, color: 'primary.main', mr: 1 }} />
              <Typography variant="h4" fontWeight={700} color="primary">
                QR Studio
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Invalid Reset Link
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            This password reset link is invalid or has expired. Please request a new one.
          </Alert>

          <Button
            fullWidth
            component={Link}
            href="/forgot-password"
            variant="contained"
            size="large"
            sx={{ py: 1.5 }}
          >
            Request New Reset Link
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <MuiLink
              component={Link}
              href="/signin"
              sx={{
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Back to sign in
            </MuiLink>
          </Box>
        </Paper>
      </Box>
    )
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
            Enter your new password below
          </Typography>
        </Box>

        {/* Error/Success Alert */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            icon={<CheckCircleIcon />}
          >
            {successMsg}
          </Alert>
        )}

        {/* Password Reset Form */}
        {!successMsg && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              helperText="Minimum 8 characters"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Resetting password...' : 'Reset password'}
            </Button>
          </form>
        )}

        {/* Back to Sign In */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <MuiLink
            component={Link}
            href="/signin"
            sx={{
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Back to sign in
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
        }}
      >
        <CircularProgress />
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
