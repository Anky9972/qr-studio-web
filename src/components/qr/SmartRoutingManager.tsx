'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  SmartphoneOutlined,
  Schedule,
  Language,
  PinDrop,
  LimitIcon,
} from '@mui/icons-material';
import { RoutingCondition, RoutingRuleType } from '@/types/routing';

interface RoutingRule {
  id: string;
  type: RoutingRuleType;
  condition: RoutingCondition;
  destination: string;
  priority: number;
  active: boolean;
}

interface SmartRoutingManagerProps {
  qrCodeId: string;
  rules: RoutingRule[];
  onRuleAdd: (rule: Omit<RoutingRule, 'id'>) => Promise<void>;
  onRuleUpdate: (ruleId: string, updates: Partial<RoutingRule>) => Promise<void>;
  onRuleDelete: (ruleId: string) => Promise<void>;
}

export default function SmartRoutingManager({
  qrCodeId,
  rules,
  onRuleAdd,
  onRuleUpdate,
  onRuleDelete,
}: SmartRoutingManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);
  const [ruleType, setRuleType] = useState<RoutingRuleType>('device');
  const [destination, setDestination] = useState('');
  const [priority, setPriority] = useState(0);

  // Device routing state
  const [selectedDevices, setSelectedDevices] = useState<string[]>(['ios']);
  
  // Time routing state
  const [timeSchedule, setTimeSchedule] = useState({
    startTime: '09:00',
    endTime: '17:00',
    days: [] as number[],
  });

  // Language routing state
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);

  // Scan limit state
  const [scanLimit, setScanlimit] = useState(1000);

  const handleOpenDialog = (rule?: RoutingRule) => {
    if (rule) {
      setEditingRule(rule);
      setRuleType(rule.type);
      setDestination(rule.destination);
      setPriority(rule.priority);
      // TODO: Parse condition based on type
    } else {
      setEditingRule(null);
      setRuleType('device');
      setDestination('');
      setPriority(0);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRule(null);
  };

  const handleSave = async () => {
    let condition: RoutingCondition;

    // Build condition based on type
    switch (ruleType) {
      case 'device':
        condition = { type: 'device', devices: selectedDevices as any };
        break;
      case 'time':
        condition = {
          type: 'time',
          schedule: [{
            startTime: timeSchedule.startTime,
            endTime: timeSchedule.endTime,
            days: timeSchedule.days,
          }],
        };
        break;
      case 'language':
        condition = { type: 'language', languages: selectedLanguages };
        break;
      case 'scanLimit':
        condition = { type: 'scanLimit', maxScans: scanLimit };
        break;
      default:
        return;
    }

    const ruleData = {
      type: ruleType,
      condition,
      destination,
      priority,
      active: true,
    };

    if (editingRule) {
      await onRuleUpdate(editingRule.id, ruleData);
    } else {
      await onRuleAdd(ruleData);
    }

    handleCloseDialog();
  };

  const getRuleIcon = (type: RoutingRuleType) => {
    switch (type) {
      case 'device':
        return <SmartphoneOutlined />;
      case 'time':
        return <Schedule />;
      case 'language':
        return <Language />;
      case 'geo':
        return <PinDrop />;
      default:
        return null;
    }
  };

  const getRuleDescription = (rule: RoutingRule): string => {
    switch (rule.type) {
      case 'device':
        const deviceCond = rule.condition as any;
        return `Devices: ${deviceCond.devices?.join(', ')}`;
      case 'time':
        const timeCond = rule.condition as any;
        return `Time: ${timeCond.schedule?.[0]?.startTime} - ${timeCond.schedule?.[0]?.endTime}`;
      case 'language':
        const langCond = rule.condition as any;
        return `Languages: ${langCond.languages?.join(', ')}`;
      case 'scanLimit':
        const limitCond = rule.condition as any;
        return `Max scans: ${limitCond.maxScans}`;
      default:
        return 'Custom rule';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Smart Routing Rules</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Rule
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          Smart routing allows you to redirect users to different URLs based on device, time, language, or other conditions.
        </Alert>

        <List>
          {rules.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No routing rules yet"
                secondary="Add a rule to enable conditional redirects"
              />
            </ListItem>
          ) : (
            rules.map((rule) => (
              <ListItem key={rule.id} divider>
                <Box sx={{ mr: 2 }}>{getRuleIcon(rule.type)}</Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={rule.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Priority: {rule.priority}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">{getRuleDescription(rule)}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        → {rule.destination}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={rule.active}
                    onChange={(e) => onRuleUpdate(rule.id, { active: e.target.checked })}
                  />
                  <IconButton onClick={() => handleOpenDialog(rule)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onRuleDelete(rule.id)} color="error">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingRule ? 'Edit Routing Rule' : 'Add Routing Rule'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Rule Type"
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as RoutingRuleType)}
                >
                  <MenuItem value="device">Device Detection (iOS/Android)</MenuItem>
                  <MenuItem value="time">Time-Based Routing</MenuItem>
                  <MenuItem value="language">Language Detection</MenuItem>
                  <MenuItem value="scanLimit">Scan Limit</MenuItem>
                  <MenuItem value="geo">Geographic Location</MenuItem>
                </TextField>
              </Grid>

              {/* Device Selection */}
              {ruleType === 'device' && (
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Target Devices"
                    value={selectedDevices}
                    onChange={(e) => setSelectedDevices([e.target.value])}
                    helperText="Select which devices should use this route"
                  >
                    <MenuItem value="ios">iOS (iPhone/iPad)</MenuItem>
                    <MenuItem value="android">Android</MenuItem>
                    <MenuItem value="windows">Windows</MenuItem>
                    <MenuItem value="mac">Mac</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* Time Schedule */}
              {ruleType === 'time' && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Start Time"
                      value={timeSchedule.startTime}
                      onChange={(e) => setTimeSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="time"
                      label="End Time"
                      value={timeSchedule.endTime}
                      onChange={(e) => setTimeSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}

              {/* Language Selection */}
              {ruleType === 'language' && (
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Languages"
                    value={selectedLanguages[0]}
                    onChange={(e) => setSelectedLanguages([e.target.value])}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="pt">Portuguese</MenuItem>
                    <MenuItem value="zh">Chinese</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* Scan Limit */}
              {ruleType === 'scanLimit' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Scans"
                    value={scanLimit}
                    onChange={(e) => setScanLimit(parseInt(e.target.value))}
                    helperText="Redirect to this URL after reaching scan limit"
                  />
                </Grid>
              )}

              {/* Destination URL */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Destination URL"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="https://example.com/destination"
                  helperText="Where users matching this rule will be redirected"
                />
              </Grid>

              {/* Priority */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value))}
                  helperText="Higher priority rules are evaluated first (default: 0)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={!destination}>
              {editingRule ? 'Update' : 'Add'} Rule
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
