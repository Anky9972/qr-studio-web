'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  QrCode2,
  Extension as ExtensionIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle
} from '@mui/icons-material'

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    handleProfileMenuClose()
    await signOut({ callbackUrl: '/' })
  }
  
  // Don't show navbar on dashboard pages
  if (!mounted) return null
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Templates', href: '/templates' },
    { label: 'Use Cases', href: '/use-cases' },
  ]

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={trigger ? 2 : 0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <QrCode2 sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                QR Studio
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              <Button
                component="a"
                href="https://chromewebstore.google.com/detail/pjiipoibmdohooinoolciaamcoeclkln"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ExtensionIcon />}
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'transparent'
                  }
                }}
              >
                Extension
              </Button>

              {status === 'loading' ? (
                <Box sx={{ width: 100 }} /> // Placeholder during loading
              ) : session?.user ? (
                <>
                  <Button
                    component={Link}
                    href="/dashboard"
                    startIcon={<DashboardIcon />}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Dashboard
                  </Button>

                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    aria-label="Account menu"
                    aria-controls={anchorEl ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        fontSize: 16
                      }}
                    >
                      {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>

                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'account-button',
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    sx={{ mt: 1 }}
                  >
                    <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {session.user.name || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem
                      component={Link}
                      href="/dashboard"
                      onClick={handleProfileMenuClose}
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/settings"
                      onClick={handleProfileMenuClose}
                    >
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/account"
                      onClick={handleProfileMenuClose}
                    >
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      Account
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleSignOut}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/signin"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    component={Link}
                    href="/signup"
                    variant="contained"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 2 }}>
          <IconButton onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://chromewebstore.google.com/detail/pjiipoibmdohooinoolciaamcoeclkln"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ExtensionIcon sx={{ mr: 2 }} />
              <ListItemText primary="Chrome Extension" />
            </ListItemButton>
          </ListItem>

          {status === 'loading' ? (
            <ListItem>
              <ListItemText primary="Loading..." />
            </ListItem>
          ) : session?.user ? (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/dashboard/settings"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/dashboard/account"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItemButton>
              </ListItem>

              <ListItem sx={{ px: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleSignOut}
                  startIcon={<LogoutIcon />}
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                  Sign Out
                </Button>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              </ListItem>

              <ListItem sx={{ px: 2, mt: 2 }}>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                  Get Started
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  )
}
