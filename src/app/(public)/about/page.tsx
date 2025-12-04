'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import {
  QrCode2,
  ArrowForward,
  TrendingUp,
  People,
  Public,
  Security
} from '@mui/icons-material';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Active Users', value: '10,000+', icon: <People sx={{ fontSize: 40 }} /> },
    { label: 'QR Codes Generated', value: '5M+', icon: <QrCode2 sx={{ fontSize: 40 }} /> },
    { label: 'Countries', value: '120+', icon: <Public sx={{ fontSize: 40 }} /> },
    { label: 'Uptime', value: '99.9%', icon: <Security sx={{ fontSize: 40 }} /> }
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Co-Founder',
      avatar: 'AT',
      bio: '15+ years in SaaS, former VP at Adobe'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO & Co-Founder',
      avatar: 'SC',
      bio: 'Ex-Google engineer, PhD in Computer Science'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product',
      avatar: 'MR',
      bio: 'Product leader from Salesforce and Dropbox'
    },
    {
      name: 'Emma Williams',
      role: 'Head of Design',
      avatar: 'EW',
      bio: 'Award-winning designer from Figma'
    }
  ];

  const values = [
    {
      title: 'Customer-First',
      description: 'We build features based on your feedback and needs',
      icon: <People sx={{ fontSize: 48, color: 'primary.main' }} />
    },
    {
      title: 'Innovation',
      description: 'Constantly improving with cutting-edge technology',
      icon: <TrendingUp sx={{ fontSize: 48, color: 'primary.main' }} />
    },
    {
      title: 'Privacy & Security',
      description: 'Your data is protected with enterprise-grade security',
      icon: <Security sx={{ fontSize: 48, color: 'primary.main' }} />
    },
    {
      title: 'Global Reach',
      description: 'Supporting businesses in over 120 countries',
      icon: <Public sx={{ fontSize: 48, color: 'primary.main' }} />
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 10 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Chip label="ABOUT US" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Making QR Codes Simple and Powerful
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              We're on a mission to help businesses connect with their customers through innovative QR code solutions
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {stats.map((stat, index) => (
            <Card key={index} sx={{ flex: '1 1 220px', textAlign: 'center' }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Story Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Founded in 2022 by a team of passionate technologists
          </Typography>
          <Typography paragraph>
            QR Studio was born out of frustration with existing QR code solutions. As marketers and developers ourselves, we experienced firsthand the limitations of traditional QR code generators—lack of analytics, poor customization, and no way to update codes after printing.
          </Typography>
          <Typography paragraph>
            We envisioned a platform that would combine powerful features with an intuitive interface, making professional QR code management accessible to everyone—from solo entrepreneurs to enterprise teams.
          </Typography>
          <Typography paragraph>
            Today, QR Studio serves over 10,000 businesses across 120 countries, generating millions of QR codes that power marketing campaigns, product packaging, event management, and more. Our commitment remains the same: empower businesses with the best QR code technology available.
          </Typography>
        </Container>
      </Box>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
          Our Values
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          The principles that guide everything we do
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {values.map((value, index) => (
            <Card key={index} sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 280 }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>{value.icon}</Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {value.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
            Meet Our Team
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Experienced leaders from top tech companies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {team.map((member, index) => (
              <Card key={index} sx={{ flex: '1 1 250px', maxWidth: 300 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: 28,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Join Thousands of Happy Users
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Start creating professional QR codes today
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/signup"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              endIcon={<ArrowForward />}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
