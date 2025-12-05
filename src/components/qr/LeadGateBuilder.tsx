'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Email,
  Phone,
  Person,
  Business,
  LocationOn,
  Visibility,
  Download,
  DragIndicator,
} from '@mui/icons-material';

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select fields
}

interface Submission {
  id: string;
  timestamp: Date;
  data: Record<string, string>;
}

interface LeadGateData {
  name: string;
  title: string;
  description?: string;
  fields: FormField[];
  redirectUrl: string;
  submitText: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
  submissions: Submission[];
  published: boolean;
}

interface LeadGateBuilderProps {
  data?: LeadGateData;
  onSave: (data: LeadGateData) => Promise<void>;
  onPreview?: () => void;
}

const defaultTheme = {
  primaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, sans-serif',
};

const fieldTypeIcons = {
  text: <Person />,
  email: <Email />,
  phone: <Phone />,
  textarea: <Business />,
  select: <LocationOn />,
  checkbox: <Person />,
};

const commonFields: Omit<FormField, 'id'>[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full Name',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    required: true,
  },
  {
    name: 'phone',
    type: 'phone',
    label: 'Phone Number',
    required: false,
  },
  {
    name: 'company',
    type: 'text',
    label: 'Company Name',
    required: false,
  },
  {
    name: 'message',
    type: 'textarea',
    label: 'Message',
    required: false,
  },
];

export default function LeadGateBuilder({
  data,
  onSave,
  onPreview,
}: LeadGateBuilderProps) {
  const [name, setName] = useState(data?.name || '');
  const [title, setTitle] = useState(data?.title || '');
  const [description, setDescription] = useState(data?.description || '');
  const [fields, setFields] = useState<FormField[]>(data?.fields || []);
  const [redirectUrl, setRedirectUrl] = useState(data?.redirectUrl || '');
  const [submitText, setSubmitText] = useState(
    data?.submitText || 'Get Access'
  );
  const [theme, setTheme] = useState(data?.theme || defaultTheme);
  const [submissions, setSubmissions] = useState<Submission[]>(
    data?.submissions || []
  );
  const [published, setPublished] = useState(data?.published || false);

  const [fieldDialog, setFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FormField['type']>('text');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);

  const [submissionsDialog, setSubmissionsDialog] = useState(false);

  const handleAddField = () => {
    setEditingField(null);
    setFieldName('');
    setFieldType('text');
    setFieldLabel('');
    setFieldPlaceholder('');
    setFieldRequired(false);
    setFieldOptions([]);
    setFieldDialog(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldName(field.name);
    setFieldType(field.type);
    setFieldLabel(field.label);
    setFieldPlaceholder(field.placeholder || '');
    setFieldRequired(field.required);
    setFieldOptions(field.options || []);
    setFieldDialog(true);
  };

  const handleSaveField = () => {
    const newField: FormField = {
      id: editingField?.id || `field-${Date.now()}`,
      name: fieldName,
      type: fieldType,
      label: fieldLabel,
      placeholder: fieldPlaceholder,
      required: fieldRequired,
      options: fieldType === 'select' ? fieldOptions : undefined,
    };

    if (editingField) {
      setFields(
        fields.map((field) => (field.id === editingField.id ? newField : field))
      );
    } else {
      setFields([...fields, newField]);
    }
    setFieldDialog(false);
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleAddCommonField = (fieldTemplate: Omit<FormField, 'id'>) => {
    const newField: FormField = {
      ...fieldTemplate,
      id: `field-${Date.now()}`,
    };
    setFields([...fields, newField]);
  };

  const handleSave = async () => {
    const gateData: LeadGateData = {
      name,
      title,
      description,
      fields,
      redirectUrl,
      submitText,
      theme,
      submissions,
      published,
    };
    await onSave(gateData);
  };

  const downloadSubmissions = () => {
    if (submissions.length === 0) return;

    const headers = fields.map((f) => f.label).join(',') + ',Timestamp\n';
    const rows = submissions
      .map((sub) => {
        const values = fields.map((f) => sub.data[f.name] || '');
        return [...values, new Date(sub.timestamp).toLocaleString()].join(',');
      })
      .join('\n');

    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead-gate-submissions-${Date.now()}.csv`;
    link.click();
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Panel - Editor */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Generation Gate Builder
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                Capture leads by requiring users to fill out a form before
                accessing your content or QR destination.
              </Alert>

              {/* Basic Info */}
              <TextField
                fullWidth
                required
                label="Internal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Product Demo Gate"
                helperText="For your reference only, not shown to users"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                label="Form Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Get Instant Access"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional subtitle or instructions"
                multiline
                rows={2}
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Quick Add Common Fields */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quick Add Common Fields
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonFields.map((field) => (
                    <Chip
                      key={field.name}
                      label={field.label}
                      onClick={() => handleAddCommonField(field)}
                      variant="outlined"
                      icon={fieldTypeIcons[field.type]}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Form Fields */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">Form Fields</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={handleAddField}
                  >
                    Custom Field
                  </Button>
                </Box>

                {fields.length === 0 ? (
                  <Alert severity="warning">
                    No fields added yet. Add at least one field to capture leads.
                  </Alert>
                ) : (
                  <List>
                    {fields.map((field, index) => (
                      <ListItem key={field.id} divider>
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <DragIndicator />
                        </IconButton>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              {field.label}
                              {field.required && (
                                <Chip label="Required" size="small" color="error" />
                              )}
                            </Box>
                          }
                          secondary={`Type: ${field.type} | Name: ${field.name}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handleEditField(field)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteField(field.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Redirect & Submit */}
              <Typography variant="subtitle1" gutterBottom>
                After Submission
              </Typography>
              <TextField
                fullWidth
                required
                label="Redirect URL"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://example.com/thank-you"
                helperText="Where to send users after they submit the form"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Submit Button Text"
                value={submitText}
                onChange={(e) => setSubmitText(e.target.value)}
                placeholder="Get Access"
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Theme */}
              <Typography variant="subtitle1" gutterBottom>
                Theme
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Primary Color"
                    value={theme.primaryColor}
                    onChange={(e) =>
                      setTheme({ ...theme, primaryColor: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Background Color"
                    value={theme.backgroundColor}
                    onChange={(e) =>
                      setTheme({ ...theme, backgroundColor: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Submissions */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">Lead Submissions</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {submissions.length} submission{submissions.length !== 1 ? 's' : ''} collected
                    </Typography>
                  </Box>
                  <Box>
                    {submissions.length > 0 && (
                      <>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={downloadSubmissions}
                          sx={{ mr: 1 }}
                        >
                          Export CSV
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => setSubmissionsDialog(true)}
                        >
                          View
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                    />
                  }
                  label="Published"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onPreview && (
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={onPreview}
                    >
                      Preview
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!name || !title || fields.length === 0 || !redirectUrl}
                  >
                    Save Lead Gate
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Live Preview */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box
                sx={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: 2,
                  p: 4,
                  minHeight: 500,
                }}
              >
                <Typography variant="h4" align="center" gutterBottom>
                  {title || 'Form Title'}
                </Typography>
                {description && (
                  <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    {description}
                  </Typography>
                )}

                <Box component="form" sx={{ width: '100%' }}>
                  {fields.map((field) => (
                    <Box key={field.id} sx={{ mb: 3 }}>
                      {field.type === 'textarea' ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label={field.label}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      ) : field.type === 'select' ? (
                        <TextField
                          fullWidth
                          select
                          label={field.label}
                          required={field.required}
                        >
                          {field.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : field.type === 'checkbox' ? (
                        <FormControlLabel
                          control={<Switch />}
                          label={field.label}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          type={field.type}
                          label={field.label}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      )}
                    </Box>
                  ))}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      backgroundColor: theme.primaryColor,
                      '&:hover': {
                        backgroundColor: theme.primaryColor,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {submitText}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Custom Field Dialog */}
      <Dialog
        open={fieldDialog}
        onClose={() => setFieldDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingField ? 'Edit Field' : 'Add Custom Field'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Field Name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g., companySize"
                helperText="Internal identifier (no spaces)"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Field Type"
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value as FormField['type'])}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="textarea">Textarea</MenuItem>
                <MenuItem value="select">Dropdown</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Field Label"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                placeholder="e.g., Company Size"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Placeholder"
                value={fieldPlaceholder}
                onChange={(e) => setFieldPlaceholder(e.target.value)}
                placeholder="Optional placeholder text"
              />
            </Grid>
            {fieldType === 'select' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Options (comma-separated)"
                  value={fieldOptions.join(', ')}
                  onChange={(e) =>
                    setFieldOptions(
                      e.target.value.split(',').map((opt) => opt.trim())
                    )
                  }
                  placeholder="Small, Medium, Large"
                  helperText="Enter dropdown options separated by commas"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={fieldRequired}
                    onChange={(e) => setFieldRequired(e.target.checked)}
                  />
                }
                label="Required field"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFieldDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveField}
            variant="contained"
            disabled={!fieldName || !fieldLabel}
          >
            {editingField ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submissions Dialog */}
      <Dialog
        open={submissionsDialog}
        onClose={() => setSubmissionsDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Lead Submissions</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {fields.map((field) => (
                    <TableCell key={field.id}>{field.label}</TableCell>
                  ))}
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    {fields.map((field) => (
                      <TableCell key={field.id}>
                        {sub.data[field.name] || '-'}
                      </TableCell>
                    ))}
                    <TableCell>
                      {new Date(sub.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
