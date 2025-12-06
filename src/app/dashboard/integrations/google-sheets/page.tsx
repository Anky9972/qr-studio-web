'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Database,
  Link as LinkIcon,
  Table as TableIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

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

  const steps = [
    { id: 0, title: 'Connect', icon: LinkIcon },
    { id: 1, title: 'Select Sheet', icon: TableIcon },
    { id: 2, title: 'Map Fields', icon: Database },
    { id: 3, title: 'Import', icon: Upload }
  ];

  const qrFields = [
    { key: 'content', label: 'QR Content', required: true, desc: 'URL or text for the QR code' },
    { key: 'name', label: 'Name', required: false, desc: 'Internal name for the QR code' },
    { key: 'type', label: 'QR Type', required: false, desc: 'e.g., URL, Text, WiFi' },
    { key: 'color', label: 'Foreground Color', required: false, desc: 'Hex color code (e.g., #000000)' },
    { key: 'bgColor', label: 'Background Color', required: false, desc: 'Hex color code (e.g., #FFFFFF)' },
  ];

  // Steps handling logic (kept from original)
  const handleFetchSheetInfo = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`/api/integrations/google-sheets/info?url=${encodeURIComponent(sheetUrl)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch sheet info');
      setSheetInfo(data.data);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSheetData = async () => {
    if (!sheetInfo || !selectedSheet) return;
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`/api/integrations/google-sheets/data?id=${sheetInfo.id}&sheet=${encodeURIComponent(selectedSheet)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch sheet data');
      setSheetData(data.data.parsed);
      setActiveStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateMapping = () => {
    if (!columnMapping.content) {
      setError('Content field mapping is required');
      return;
    }
    setError('');
    setActiveStep(3);
  };

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
      if (!response.ok) throw new Error(data.error || 'Failed to import QR codes');
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <FileSpreadsheet className="text-green-500" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Google Sheets Import</h1>
          <p className="text-muted-foreground">Bulk create QR codes directly from your spreadsheets.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0 hidden md:block"></div>
        <div className="grid grid-cols-4 relative z-10 gap-4">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div
                  className={`
                         w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                         ${isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-110' : ''}
                         ${isCompleted ? 'bg-primary/20 border-primary text-primary' : ''}
                         ${!isActive && !isCompleted ? 'bg-black/40 border-white/10 text-muted-foreground' : ''}
                       `}
                >
                  {isCompleted ? <CheckCircle size={18} /> : <step.icon size={18} />}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-muted-foreground'}`}>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card variant="glass" className="p-8 min-h-[400px]">
            {/* General Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle size={16} />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 0: Connect */}
            {activeStep === 0 && (
              <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto space-y-6 text-center py-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Connect Your Sheet</h2>
                  <p className="text-muted-foreground">Make sure your sheet is accessible to anyone with the link or share it with our service account.</p>
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-2 text-left">
                    <Label>Google Sheets URL</Label>
                    <Input
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Button variant="glow" size="lg" className="w-full" onClick={handleFetchSheetInfo} disabled={!sheetUrl || loading}>
                    {loading ? "Connecting..." : "Connect Sheet"} <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Tip: Ensure the first row contains column headers.
                </p>
              </div>
            )}

            {/* Step 1: Select Sheet */}
            {activeStep === 1 && sheetInfo && (
              <div className="max-w-xl mx-auto space-y-8 py-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <FileSpreadsheet className="text-green-500" size={24} />
                  <div>
                    <h3 className="font-semibold text-white">{sheetInfo.title}</h3>
                    <p className="text-sm text-green-400">Connected Successfully</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Select Worksheet</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {sheetInfo.sheets.map((sheet) => (
                      <div
                        key={sheet.id}
                        onClick={() => setSelectedSheet(sheet.title)}
                        className={`
                               p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between group
                               ${selectedSheet === sheet.title
                            ? 'bg-primary/20 border-primary shadow-inner'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }
                             `}
                      >
                        <div className="flex items-center gap-3">
                          <TableIcon size={18} className={selectedSheet === sheet.title ? 'text-primary' : 'text-muted-foreground'} />
                          <span className="font-medium">{sheet.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                          {sheet.rowCount} rows • {sheet.columnCount} cols
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={handleReset} disabled={loading}>Cancel</Button>
                  <Button variant="glow" onClick={handleFetchSheetData} disabled={!selectedSheet || loading}>
                    {loading ? "Loading Data..." : "Continue"} <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Map Fields */}
            {activeStep === 2 && sheetData && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Map Columns</h2>
                  <p className="text-muted-foreground">Match columns from your sheet to QR code properties.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {qrFields.map((field) => (
                    <div key={field.key} className="space-y-2 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">{field.label}</Label>
                        {field.required && <Badge variant="destructive" className="text-[10px]">Required</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{field.desc}</p>

                      <Select value={columnMapping[field.key]} onValueChange={(val) => setColumnMapping({ ...columnMapping, [field.key]: val })}>
                        <SelectTrigger className="bg-black/20 border-white/10">
                          <SelectValue placeholder="Select Column..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-- Skip --</SelectItem>
                          {sheetData.headers.map(header => (
                            <SelectItem key={header} value={header}>{header}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="border rounded-lg border-white/10 overflow-hidden">
                  <div className="bg-white/5 p-3 font-medium text-sm border-b border-white/10 flex items-center gap-2">
                    <TableIcon size={14} /> Data Preview (First 5 rows)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground bg-black/20 uppercase">
                        <tr>
                          {sheetData.headers.map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sheetData.rows.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            {sheetData.headers.map(h => <td key={h} className="px-4 py-3">{row[h]}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setActiveStep(1)}><ArrowLeft size={16} className="mr-2" /> Back</Button>
                  <Button variant="glow" onClick={handleValidateMapping}>Confirm Mapping <ArrowRight size={16} className="ml-2" /></Button>
                </div>
              </div>
            )}

            {/* Step 3: Import */}
            {activeStep === 3 && (
              <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto space-y-8 py-8">
                {importResult ? (
                  <div className="text-center space-y-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/10">
                      <CheckCircle size={40} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold text-white">Import Complete!</h2>
                      <p className="text-muted-foreground">{success}</p>
                    </div>
                    {importResult.errors > 0 && <Alert variant="destructive" className="text-left"><AlertDescription>{importResult.errors} rows failed to import.</AlertDescription></Alert>}

                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={handleReset}>Import More</Button>
                      <Button variant="glow" onClick={() => window.location.href = '/dashboard/qr-codes'}>View QR Codes</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Ready to Import</h2>
                      <p className="text-muted-foreground">You are about to import <span className="text-white font-bold">{sheetData?.rows.length}</span> QR codes.</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-left space-y-3 w-full">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Summary</h3>
                      <div className="flex justify-between text-sm"><span>Source Sheet:</span> <span className="text-white">{sheetInfo?.title} / {selectedSheet}</span></div>
                      <div className="flex justify-between text-sm"><span>Total Rows:</span> <span className="text-white">{sheetData?.rows.length}</span></div>
                      <div className="flex justify-between text-sm"><span>Mapped Fields:</span> <span className="text-white">{Object.values(columnMapping).filter(Boolean).length}</span></div>
                    </div>

                    <div className="flex gap-4 w-full">
                      <Button variant="ghost" className="flex-1" onClick={() => setActiveStep(2)} disabled={loading}>Back</Button>
                      <Button variant="glow" size="lg" className="flex-[2]" onClick={handleImport} disabled={loading}>
                        {loading ? "Importing..." : "Start Import"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
