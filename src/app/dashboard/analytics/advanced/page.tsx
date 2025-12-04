'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import dynamic from 'next/dynamic';
import MapIcon from '@mui/icons-material/Map';
import TimelineIcon from '@mui/icons-material/Timeline';
import StreamIcon from '@mui/icons-material/Stream';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EmailIcon from '@mui/icons-material/Email';

// Lazy load heavy components
const HeatMap = dynamic(() => import('@/components/analytics/HeatMap'), {
  loading: () => <Box sx={{ p: 3, textAlign: 'center' }}>Loading map...</Box>,
  ssr: false,
});

const FunnelChart = dynamic(() => import('@/components/analytics/FunnelChart'), {
  loading: () => <Box sx={{ p: 3, textAlign: 'center' }}>Loading funnel...</Box>,
});

const RealtimeDashboard = dynamic(() => import('@/components/analytics/RealtimeDashboard'), {
  loading: () => <Box sx={{ p: 3, textAlign: 'center' }}>Loading real-time data...</Box>,
  ssr: false,
});

const ConversionTracker = dynamic(() => import('@/components/analytics/ConversionTracker'), {
  loading: () => <Box sx={{ p: 3, textAlign: 'center' }}>Loading conversion tracker...</Box>,
});

const ReportScheduler = dynamic(() => import('@/components/analytics/ReportScheduler'), {
  loading: () => <Box sx={{ p: 3, textAlign: 'center' }}>Loading scheduler...</Box>,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data for demonstration
const mockLocations = [
  { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA', count: 245 },
  { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', count: 189 },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', count: 156 },
  { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', count: 134 },
  { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA', count: 98 },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', count: 87 },
  { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany', count: 76 },
  { lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia', count: 65 },
];

const mockFunnelData = [
  { name: 'QR Codes Created', value: 1000, percentage: 100, index: 0 },
  { name: 'QR Codes Scanned', value: 605, percentage: 60.5, index: 1 },
  { name: 'Destination Reached', value: 485, percentage: 48.5, index: 2 },
  { name: 'Goal Completed', value: 243, percentage: 24.3, index: 3 },
];

export default function AdvancedAnalyticsPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Advanced Analytics & Business Intelligence
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Deep insights into your QR code performance with real-time tracking, geographic analysis, and conversion metrics
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="analytics tabs"
        >
          <Tab icon={<StreamIcon />} label="Real-time Dashboard" iconPosition="start" />
          <Tab icon={<MapIcon />} label="Geographic Heat Map" iconPosition="start" />
          <Tab icon={<TimelineIcon />} label="Funnel Analysis" iconPosition="start" />
          <Tab icon={<TrackChangesIcon />} label="Conversion Tracking" iconPosition="start" />
          <Tab icon={<EmailIcon />} label="Scheduled Reports" iconPosition="start" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <RealtimeDashboard />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <HeatMap data={mockLocations} />
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Top Locations
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            {mockLocations.slice(0, 5).map((loc, index) => (
              <Box key={index} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {loc.city}, {loc.country}
                </Typography>
                <Typography variant="h5" color="primary">
                  {loc.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  scans
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <FunnelChart data={mockFunnelData} />
        
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Optimization Recommendations
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="warning.dark">
                ⚠️ High drop-off between "QR Codes Scanned" and "Destination Reached" (19.8%)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Suggestion: Check if destination URLs are loading correctly and optimize page load times
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="error.dark">
                🔴 Low conversion rate (24.3% of initial QR codes)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Suggestion: Improve landing page CTAs and reduce friction in the conversion flow
              </Typography>
            </Box>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ConversionTracker />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <ReportScheduler />
      </TabPanel>
    </Container>
  );
}
