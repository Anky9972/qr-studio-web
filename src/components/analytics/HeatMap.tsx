'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Box, Typography, Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';

interface ScanLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
  count: number;
}

interface HeatMapProps {
  data: ScanLocation[];
}

export default function HeatMap({ data }: HeatMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  // Calculate intensity for color gradient
  const maxCount = Math.max(...data.map(d => d.count));
  const getColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.7) return '#d32f2f';
    if (intensity > 0.4) return '#f57c00';
    return '#1976d2';
  };

  const getRadius = (count: number) => {
    return Math.min(Math.max(count / 2, 5), 30);
  };

  return (
    <Paper sx={{ p: 2, height: 500 }}>
      <Typography variant="h6" gutterBottom>
        Geographic Distribution
      </Typography>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: 450, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((location, index) => (
          <CircleMarker
            key={index}
            center={[location.lat, location.lng]}
            radius={getRadius(location.count)}
            fillColor={getColor(location.count)}
            color="#fff"
            weight={1}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {location.city}, {location.country}
                </Typography>
                <Typography variant="body2">
                  {location.count} scan{location.count !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </Paper>
  );
}
