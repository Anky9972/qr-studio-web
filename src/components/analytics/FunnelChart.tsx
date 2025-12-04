'use client';

import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
}

interface FunnelChartProps {
  data: FunnelStage[];
}

const COLORS = ['#1976d2', '#2196f3', '#64b5f6', '#90caf9'];

export default function FunnelChart({ data }: FunnelChartProps) {
  const calculateDropOff = (index: number) => {
    if (index === 0) return 0;
    const previous = data[index - 1].value;
    const current = data[index].value;
    return previous > 0 ? ((previous - current) / previous) * 100 : 0;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Conversion Funnel
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Track user journey from QR creation to conversion
      </Typography>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const index = payload[0].payload.index || 0;
                const dropOff = calculateDropOff(index);
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2">{data.name}</Typography>
                    <Typography variant="body2">Count: {data.value}</Typography>
                    <Typography variant="body2">Percentage: {data.percentage.toFixed(1)}%</Typography>
                    {index > 0 && (
                      <Typography variant="body2" color="error">
                        Drop-off: {dropOff.toFixed(1)}%
                      </Typography>
                    )}
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Drop-off rates */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Stage Drop-off Rates:
        </Typography>
        {data.map((stage, index) => {
          if (index === 0) return null;
          const dropOff = calculateDropOff(index);
          return (
            <Typography key={index} variant="body2" color={dropOff > 50 ? 'error' : 'text.secondary'}>
              {data[index - 1].name} → {stage.name}: {dropOff.toFixed(1)}% drop-off
            </Typography>
          );
        })}
      </Box>
    </Paper>
  );
}
