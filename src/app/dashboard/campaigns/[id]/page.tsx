'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  QrCode as QrCodeIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: { qrCodes: number };
  totalScans: number;
  qrCodes?: Array<{
    id: string;
    name: string | null;
    content: string;
    scanCount: number;
    type: string;
    createdAt: string;
  }>;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data);
      } else {
        console.error('Campaign not found');
        router.push('/dashboard/campaigns');
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      router.push('/dashboard/campaigns');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Campaign not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/dashboard/campaigns')}>
          Back to Campaigns
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/campaigns')}
          sx={{ mb: 2 }}
        >
          Back to Campaigns
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {campaign.name}
            </Typography>
            {campaign.description && (
              <Typography variant="body1" color="text.secondary">
                {campaign.description}
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push('/dashboard/campaigns')}
          >
            Edit Campaign
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <QrCodeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={600}>
              {campaign._count.qrCodes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              QR Codes
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <VisibilityIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={600}>
              {campaign.totalScans?.toLocaleString() || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Scans
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={600}>
              {campaign._count.qrCodes > 0 
                ? Math.round((campaign.totalScans || 0) / campaign._count.qrCodes)
                : 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg. Scans per QR
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* QR Codes in Campaign */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            QR Codes in This Campaign
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {campaign.qrCodes && campaign.qrCodes.length > 0 ? (
            <Grid container spacing={2}>
              {campaign.qrCodes.map((qr) => (
                <Grid item xs={12} sm={6} md={4} key={qr.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {qr.name || 'Untitled QR Code'}
                        </Typography>
                        <Chip
                          label={qr.type}
                          size="small"
                          color={qr.type === 'dynamic' ? 'primary' : 'default'}
                        />
                      </Box>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {qr.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {qr.scanCount} scans
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => router.push(`/dashboard/qr-codes`)}
                        >
                          View
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <QrCodeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No QR codes in this campaign yet
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/dashboard/generate')}
                sx={{ mt: 2 }}
              >
                Create QR Code
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
