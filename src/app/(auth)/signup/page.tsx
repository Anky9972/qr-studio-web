'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    // Validation
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy')
      setLoading(false)
      return
    }

    try {
      // Call API to create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to create account')
        return
      }

      // Auto sign in after successful signup
      setSuccessMsg('Account created successfully! Signing you in...')
      
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/dashboard')
        } else {
          router.push('/signin')
        }
      }, 1500)
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: '/dashboard' })
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
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start generating and managing QR codes today
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

        {/* OAuth Buttons */}
        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => handleOAuthSignIn('google')}
            sx={{ mb: 2, py: 1.5 }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={() => handleOAuthSignIn('github')}
            sx={{ py: 1.5 }}
          >
            Continue with GitHub
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignUp}>
          <TextField
            fullWidth
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="Minimum 8 characters"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <MuiLink href="/terms" target="_blank" sx={{ textDecoration: 'none' }}>
                  Terms of Service
                </MuiLink>{' '}
                and{' '}
                <MuiLink href="/privacy" target="_blank" sx={{ textDecoration: 'none' }}>
                  Privacy Policy
                </MuiLink>
              </Typography>
            }
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
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {/* Sign In Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink
              component={Link}
              href="/signin"
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
