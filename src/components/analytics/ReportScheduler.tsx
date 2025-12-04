'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  metrics: string[];
  format: 'pdf' | 'csv' | 'excel';
  nextRun: string;
  enabled: boolean;
}

const AVAILABLE_METRICS = [
  'Total Scans',
  'QR Code Performance',
  'Geographic Distribution',
  'Device Analytics',
  'Time-based Trends',
  'Conversion Rates',
  'Top Performing QR Codes',
];

export default function ReportScheduler() {
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Weekly Performance Report',
      frequency: 'weekly',
      recipients: ['admin@example.com'],
      metrics: ['Total Scans', 'QR Code Performance', 'Geographic Distribution'],
      format: 'pdf',
      nextRun: '2025-12-10T09:00:00',
      enabled: true,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string;
    metrics: string[];
    format: 'pdf' | 'csv' | 'excel';
  }>({
    name: '',
    frequency: 'weekly',
    recipients: '',
    metrics: [],
    format: 'pdf',
  });

  const handleAddReport = () => {
    setEditingReport(null);
    setFormData({
      name: '',
      frequency: 'weekly',
      recipients: '',
      metrics: [],
      format: 'pdf',
    });
    setDialogOpen(true);
  };

  const handleEditReport = (report: ScheduledReport) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      frequency: report.frequency,
      recipients: report.recipients.join(', '),
      metrics: report.metrics,
      format: report.format,
    });
    setDialogOpen(true);
  };

  const handleSaveReport = () => {
    const recipientsList = formData.recipients.split(',').map(r => r.trim()).filter(Boolean);
    
    if (editingReport) {
      setReports(reports.map(r => 
        r.id === editingReport.id 
          ? {
              ...r,
              ...formData,
              recipients: recipientsList,
            }
          : r
      ));
    } else {
      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + 7); // Default to 7 days for weekly
      
      setReports([
        ...reports,
        {
          id: Date.now().toString(),
          ...formData,
          recipients: recipientsList,
          nextRun: nextRun.toISOString(),
          enabled: true,
        },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const handleToggleReport = (id: string) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleMetricToggle = (metric: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric],
    }));
  };

  const getFrequencyLabel = (freq: string) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6">Scheduled Reports</Typography>
            <Typography variant="body2" color="text.secondary">
              Automatically send analytics reports via email
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddReport}
          >
            New Report
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Recipients</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Next Run</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="primary" />
                      {report.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<ScheduleIcon />}
                      label={getFrequencyLabel(report.frequency)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={report.format.toUpperCase()} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(report.nextRun).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.enabled ? 'Active' : 'Paused'}
                      color={report.enabled ? 'success' : 'default'}
                      size="small"
                      onClick={() => handleToggleReport(report.id)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEditReport(report)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteReport(report.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Report Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingReport ? 'Edit' : 'Create'} Scheduled Report</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Report Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Weekly Analytics Summary"
            />

            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={formData.frequency}
                label="Frequency"
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Recipients"
              fullWidth
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              placeholder="email1@example.com, email2@example.com"
              helperText="Separate multiple emails with commas"
            />

            <FormControl fullWidth>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={formData.format}
                label="Export Format"
                onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Metrics to Include
              </Typography>
              <FormGroup>
                {AVAILABLE_METRICS.map((metric) => (
                  <FormControlLabel
                    key={metric}
                    control={
                      <Checkbox
                        checked={formData.metrics.includes(metric)}
                        onChange={() => handleMetricToggle(metric)}
                      />
                    }
                    label={metric}
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveReport}
            variant="contained"
            disabled={!formData.name || !formData.recipients || formData.metrics.length === 0}
          >
            {editingReport ? 'Save Changes' : 'Create Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
