/**
 * Google Sheets Integration Page
 * Import QR codes from Google Sheets
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Grid,
} from '@mui/material';
import { Google as GoogleIcon, Upload as UploadIcon } from '@mui/icons-material';

interface SheetInfo {
  id: string;
  title: string;
  sheets: { id: number; title: string; rowCount: number; columnCount: number }[];
}

interface ParsedData {
  headers: string[];
  rows: Record<string, string>[];
}

export default function GoogleSheetsIntegrationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [sheetInfo, setSheetInfo] = useState<SheetInfo | null>(null);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [sheetData, setSheetData] = useState<ParsedData | null>(null);
  
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    content: '',
    name: '',
    type: '',
    color: '',
    bgColor: '',
  });
  
  const [importResult, setImportResult] = useState<any>(null);

  const steps = ['Enter Sheet URL', 'Select Sheet', 'Map Columns', 'Import'];

  const qrFields = [
    { key: 'content', label: 'Content (Required)', required: true },
    { key: 'name', label: 'Name', required: false },
    { key: 'type', label: 'Type', required: false },
    { key: 'color', label: 'Foreground Color', required: false },
    { key: 'bgColor', label: 'Background Color', required: false },
  ];

  // Step 1: Fetch sheet info
  const handleFetchSheetInfo = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `/api/integrations/google-sheets/info?url=${encodeURIComponent(sheetUrl)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sheet info');
      }

      setSheetInfo(data.data);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Fetch sheet data
  const handleFetchSheetData = async () => {
    if (!sheetInfo || !selectedSheet) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `/api/integrations/google-sheets/data?id=${sheetInfo.id}&sheet=${encodeURIComponent(
          selectedSheet
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sheet data');
      }

      setSheetData(data.data.parsed);
      setActiveStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Validate mapping and preview
  const handleValidateMapping = () => {
    if (!columnMapping.content) {
      setError('Content field is required');
      return;
    }

    setError('');
    setActiveStep(3);
  };

  // Step 4: Import QR codes
  const handleImport = async () => {
    if (!sheetInfo || !selectedSheet) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/integrations/google-sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: sheetInfo.id,
          sheet: selectedSheet,
          mapping: columnMapping,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import QR codes');
      }

      setImportResult(data);
      setSuccess(`Successfully imported ${data.imported} QR codes!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setSheetUrl('');
    setSheetInfo(null);
    setSelectedSheet('');
    setSheetData(null);
    setColumnMapping({ content: '', name: '', type: '', color: '', bgColor: '' });
    setImportResult(null);
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Google Sheets Integration
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Import QR codes from your Google Sheets spreadsheet
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Step 1: Enter Sheet URL */}
      {activeStep === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Step 1: Enter Google Sheets URL
            </Typography>
            <TextField
              fullWidth
              label="Google Sheets URL"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleFetchSheetInfo}
              disabled={!sheetUrl || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Connect to Sheet'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Sheet */}
      {activeStep === 1 && sheetInfo && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Step 2: Select Sheet Tab
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Spreadsheet: <strong>{sheetInfo.title}</strong>
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sheet Tab</InputLabel>
              <Select
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                label="Sheet Tab"
              >
                {sheetInfo.sheets.map((sheet) => (
                  <MenuItem key={sheet.id} value={sheet.title}>
                    {sheet.title} ({sheet.rowCount} rows, {sheet.columnCount} columns)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleReset}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleFetchSheetData}
                disabled={!selectedSheet || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Map Columns */}
      {activeStep === 2 && sheetData && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Step 3: Map Columns
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Map your sheet columns to QR code fields
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {qrFields.map((field) => (
                <Grid item xs={12} md={6} key={field.key}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {field.label} {field.required && <Chip label="Required" size="small" />}
                    </InputLabel>
                    <Select
                      value={columnMapping[field.key]}
                      onChange={(e) =>
                        setColumnMapping({ ...columnMapping, [field.key]: e.target.value })
                      }
                      label={field.label}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {sheetData.headers.map((header) => (
                        <MenuItem key={header} value={header}>
                          {header}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>

            <Typography variant="subtitle2" gutterBottom>
              Preview (first 5 rows):
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {sheetData.headers.map((header) => (
                      <TableCell key={header}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sheetData.rows.slice(0, 5).map((row, idx) => (
                    <TableRow key={idx}>
                      {sheetData.headers.map((header) => (
                        <TableCell key={header}>{row[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setActiveStep(1)}>
                Back
              </Button>
              <Button variant="contained" onClick={handleValidateMapping}>
                Next
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Import */}
      {activeStep === 3 && sheetData && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Step 4: Import QR Codes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ready to import {sheetData.rows.length} QR codes
            </Typography>

            {importResult ? (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Successfully imported {importResult.imported} QR codes
                </Alert>
                {importResult.errors > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {importResult.errors} errors occurred during import
                  </Alert>
                )}
                <Button variant="contained" onClick={handleReset}>
                  Import Another Sheet
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => setActiveStep(2)}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={handleImport}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Import Now'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
