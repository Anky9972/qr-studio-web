'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import ThemeToggle from '@/components/ui/ThemeToggle'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  Chip,
  Badge,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import HistoryIcon from '@mui/icons-material/History'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import FolderIcon from '@mui/icons-material/Folder'
import TemplateIcon from '@mui/icons-material/ViewModule'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LinkIcon from '@mui/icons-material/Link'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { signOut } from 'next-auth/react'

const drawerWidth = 280

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Check if user is admin (you can get this from session or API)
  const isAdmin = session?.user?.email === 'admin@qrstudio.com'; // Replace with proper admin check

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { text: 'Generate QR Code', icon: QrCode2Icon, path: '/dashboard/generate' },
    { text: 'Scan QR Code', icon: QrCodeScannerIcon, path: '/dashboard/scan' },
    { text: 'Bulk Generate', icon: CloudUploadIcon, path: '/dashboard/bulk' },
    { divider: true },
    { text: 'My QR Codes', icon: QrCode2Icon, path: '/dashboard/qr-codes' },
    { text: 'History', icon: HistoryIcon, path: '/dashboard/history' },
    { text: 'Analytics', icon: AnalyticsIcon, path: '/dashboard/analytics' },
    { divider: true },
    { text: 'Campaigns', icon: FolderIcon, path: '/dashboard/campaigns' },
    { text: 'Templates', icon: TemplateIcon, path: '/dashboard/templates' },
    { text: 'Team', icon: GroupIcon, path: '/dashboard/team', badge: 'Pro' },
    { divider: true },
    { text: 'Link in Bio', icon: LinkIcon, path: '/dashboard/link-in-bio', badge: 'New' },
    { text: 'vCard Plus', icon: ContactPageIcon, path: '/dashboard/vcard-plus', badge: 'New' },
    { text: 'Digital Menu', icon: RestaurantMenuIcon, path: '/dashboard/digital-menu', badge: 'New' },
    { text: 'Lead Gate', icon: AssignmentIcon, path: '/dashboard/lead-gate', badge: 'New' },
    ...(isAdmin ? [
      { divider: true },
      { text: 'Admin Panel', icon: SettingsIcon, path: '/admin' },
    ] : []),
    { divider: true },
    { text: 'Settings', icon: SettingsIcon, path: '/dashboard/settings' },
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (!session) {
    return null
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ minHeight: 64, px: 2 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05) rotate(5deg)',
              },
            }}
          >
            <QrCode2Icon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{
              background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              QR Studio
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pro Dashboard
            </Typography>
          </Box>
        </Link>
      </Toolbar>
      
      <Divider sx={{ mx: 2 }} />
      
      <List sx={{ px: 2, py: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item, index) =>
          item.divider ? (
            <Divider key={`divider-${index}`} sx={{ my: 2 }} />
          ) : (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.path!}
                selected={pathname === item.path}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                    color: 'white',
                    boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                      transform: 'translateX(4px)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiChip-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, transition: 'transform 0.3s' }}>
                  {item.icon && <item.icon />}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: pathname === item.path ? 600 : 500,
                    fontSize: '0.9375rem',
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {menuItems.find((item) => item.path === pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            
            <IconButton 
              sx={{ 
                width: 44, 
                height: 44,
                '&:hover': {
                  transform: 'rotate(15deg) scale(1.1)',
                }
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton 
              onClick={handleProfileMenuOpen} 
              sx={{ 
                p: 0,
                ml: 1,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Avatar
                alt={session.user?.name || 'User'}
                src={session.user?.image || undefined}
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              />
            </IconButton>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 220,
                  '& .MuiMenuItem-root': {
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                  },
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {session.user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {session.user?.email}
              </Typography>
            </Box>
            
            <MenuItem onClick={handleProfileMenuClose} component={Link} href="/dashboard/settings">
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <AnnouncementBanner />
        {children}
      </Box>
    </Box>
  )
}
