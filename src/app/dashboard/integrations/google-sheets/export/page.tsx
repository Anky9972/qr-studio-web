/**
 * Google Sheets Export Component
 * Export QR codes or analytics to Google Sheets
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Alert,
  CircularProgress,
  TextField,
  Checkbox,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { FileDownload as ExportIcon } from '@mui/icons-material';

interface QRCode {
  id: string;
  name: string;
  type: string;
  scanCount: number;
}

export default function GoogleSheetsExport() {
  const [exportType, setExportType] = useState<'qr-codes' | 'analytics'>('qr-codes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exportUrl, setExportUrl] = useState('');
  
  const [sheetName, setSheetName] = useState('');
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [selectedQrCodes, setSelectedQrCodes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    fetchQrCodes();
  }, []);

  const fetchQrCodes = async () => {
    try {
      const response = await fetch('/api/qr-codes');
      if (response.ok) {
        const data = await response.json();
        setQrCodes(data.qrCodes || []);
      }
    } catch (err) {
      console.error('Failed to fetch QR codes:', err);
    }
  };

  const handleExport = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const body: any = {
        exportType,
        sheetName: sheetName || (exportType === 'qr-codes' ? 'QR Codes' : 'Analytics'),
      };

      if (exportType === 'qr-codes' && !selectAll) {
        body.qrCodeIds = selectedQrCodes;
      }

      const response = await fetch('/api/integrations/google-sheets/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export to Google Sheets');
      }

      setSuccess(`Successfully exported ${data.exported} items!`);
      setExportUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedQrCodes([]);
    }
  };

  const handleQrCodeToggle = (id: string) => {
    setSelectAll(false);
    setSelectedQrCodes((prev) =>
      prev.includes(id) ? prev.filter((qrId) => qrId !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Export to Google Sheets
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Export your QR codes or analytics data to Google Sheets
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
          {exportUrl && (
            <Box sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                href={exportUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Spreadsheet
              </Button>
            </Box>
          )}
        </Alert>
      )}

      <Card>
        <CardContent>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">What do you want to export?</FormLabel>
            <RadioGroup
              value={exportType}
              onChange={(e) => setExportType(e.target.value as 'qr-codes' | 'analytics')}
            >
              <FormControlLabel value="qr-codes" control={<Radio />} label="QR Codes" />
              <FormControlLabel value="analytics" control={<Radio />} label="Analytics/Scans" />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label="Sheet Name (optional)"
            placeholder={exportType === 'qr-codes' ? 'QR Codes' : 'Analytics'}
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            sx={{ mb: 3 }}
          />

          {exportType === 'qr-codes' && qrCodes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select QR Codes</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectAll}
                        onChange={(e) => handleSelectAllChange(e.target.checked)}
                      />
                    }
                    label="Export All QR Codes"
                  />
                </FormGroup>
              </FormControl>

              {!selectAll && (
                <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e0e0e0', mt: 2 }}>
                  <List dense>
                    {qrCodes.map((qr, idx) => (
                      <React.Fragment key={qr.id}>
                        {idx > 0 && <Divider />}
                        <ListItem>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedQrCodes.includes(qr.id)}
                                onChange={() => handleQrCodeToggle(qr.id)}
                              />
                            }
                            label={
                              <ListItemText
                                primary={qr.name || 'Unnamed'}
                                secondary={`Type: ${qr.type} | Scans: ${qr.scanCount}`}
                              />
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            onClick={handleExport}
            disabled={loading || (!selectAll && selectedQrCodes.length === 0 && exportType === 'qr-codes')}
          >
            {loading ? <CircularProgress size={24} /> : 'Export to Google Sheets'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
