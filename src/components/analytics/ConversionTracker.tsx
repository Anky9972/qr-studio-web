'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface ConversionGoal {
  id: string;
  name: string;
  type: 'url_visit' | 'form_submit' | 'button_click' | 'custom';
  targetUrl?: string;
  eventName?: string;
  conversions: number;
  conversionRate: number;
}

export default function ConversionTracker() {
  const [goals, setGoals] = useState<ConversionGoal[]>([
    {
      id: '1',
      name: 'Product Page Visit',
      type: 'url_visit',
      targetUrl: '/products',
      conversions: 142,
      conversionRate: 23.5,
    },
    {
      id: '2',
      name: 'Newsletter Signup',
      type: 'form_submit',
      eventName: 'newsletter_signup',
      conversions: 89,
      conversionRate: 14.7,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ConversionGoal | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    type: 'url_visit' | 'form_submit' | 'button_click' | 'custom';
    targetUrl: string;
    eventName: string;
  }>({
    name: '',
    type: 'url_visit',
    targetUrl: '',
    eventName: '',
  });

  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormData({ name: '', type: 'url_visit', targetUrl: '', eventName: '' });
    setDialogOpen(true);
  };

  const handleEditGoal = (goal: ConversionGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      type: goal.type,
      targetUrl: goal.targetUrl || '',
      eventName: goal.eventName || '',
    });
    setDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (editingGoal) {
      setGoals(goals.map(g => 
        g.id === editingGoal.id 
          ? { ...editingGoal, ...formData, conversions: g.conversions, conversionRate: g.conversionRate }
          : g
      ));
    } else {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          ...formData,
          conversions: 0,
          conversionRate: 0,
        },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      url_visit: 'URL Visit',
      form_submit: 'Form Submit',
      button_click: 'Button Click',
      custom: 'Custom Event',
    };
    return labels[type] || type;
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6">Conversion Goals</Typography>
            <Typography variant="body2" color="text.secondary">
              Track specific user actions and measure conversion rates
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddGoal}
          >
            Add Goal
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Goal Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Target</TableCell>
                <TableCell align="right">Conversions</TableCell>
                <TableCell align="right">Conv. Rate</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon fontSize="small" color="primary" />
                      {goal.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(goal.type)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {goal.targetUrl || goal.eventName || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{goal.conversions}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${goal.conversionRate.toFixed(1)}%`}
                      color={goal.conversionRate > 20 ? 'success' : goal.conversionRate > 10 ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEditGoal(goal)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteGoal(goal.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Goal Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGoal ? 'Edit' : 'Add'} Conversion Goal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Goal Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Goal Type</InputLabel>
              <Select
                value={formData.type}
                label="Goal Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <MenuItem value="url_visit">URL Visit</MenuItem>
                <MenuItem value="form_submit">Form Submit</MenuItem>
                <MenuItem value="button_click">Button Click</MenuItem>
                <MenuItem value="custom">Custom Event</MenuItem>
              </Select>
            </FormControl>

            {(formData.type === 'url_visit' || formData.type === 'button_click') && (
              <TextField
                label="Target URL"
                fullWidth
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                placeholder="https://example.com/success"
              />
            )}

            {(formData.type === 'form_submit' || formData.type === 'custom') && (
              <TextField
                label="Event Name"
                fullWidth
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                placeholder="newsletter_signup"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveGoal} variant="contained">
            {editingGoal ? 'Save' : 'Add Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
