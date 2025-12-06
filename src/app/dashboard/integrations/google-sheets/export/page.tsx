'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  QrCode,
  BarChart2,
  CheckSquare,
  Square,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { cn } from '@/lib/utils'; // Assuming this utility exists, otherwise standard string interpolation
import { Badge } from '@/components/ui/Badge';

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

      if (!response.ok) throw new Error(data.error || 'Failed to export to Google Sheets');

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
    if (checked) setSelectedQrCodes([]);
  };

  const handleQrCodeToggle = (id: string, checked: boolean) => {
    setSelectAll(false);
    setSelectedQrCodes((prev) => checked ? [...prev, id] : prev.filter((qrId) => qrId !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <FileSpreadsheet className="text-green-500" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Export to Sheets</h1>
          <p className="text-muted-foreground">Send your QR data directly to Google Spreadsheets.</p>
        </div>
      </div>

      <Card variant="glass" className="p-8">
        {/* Success/Error Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle size={16} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="font-medium text-white">{success}</p>
                <p className="text-xs text-green-400">Data has been pushed to your Google Sheet.</p>
              </div>
            </div>
            {exportUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(exportUrl, '_blank')}>
                Open Sheet
              </Button>
            )}
          </div>
        )}

        {/* Step 1: Export Type */}
        <div className="space-y-4 mb-8">
          <Label className="text-base">What would you like to export?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setExportType('qr-codes')}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
                exportType === 'qr-codes' ? "bg-primary/20 border-primary shadow-lg shadow-primary/10" : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", exportType === 'qr-codes' ? "bg-primary text-white" : "bg-white/10 text-muted-foreground")}>
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="font-medium">QR Codes Data</h3>
                <p className="text-xs text-muted-foreground">Export links, types, and customization details.</p>
              </div>
              {exportType === 'qr-codes' && <CheckCircle className="text-primary ml-auto" size={18} />}
            </div>

            <div
              onClick={() => setExportType('analytics')}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
                exportType === 'analytics' ? "bg-primary/20 border-primary shadow-lg shadow-primary/10" : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", exportType === 'analytics' ? "bg-primary text-white" : "bg-white/10 text-muted-foreground")}>
                <BarChart2 size={20} />
              </div>
              <div>
                <h3 className="font-medium">Analytics & Scans</h3>
                <p className="text-xs text-muted-foreground">Export detailed scan logs and device data.</p>
              </div>
              {exportType === 'analytics' && <CheckCircle className="text-primary ml-auto" size={18} />}
            </div>
          </div>
        </div>

        {/* Step 2: Details */}
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <Label>Sheet Name (Optional)</Label>
            <Input
              placeholder={exportType === 'qr-codes' ? 'My QR Codes' : 'Scan Analytics'}
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
            />
          </div>

          {/* QR Selection */}
          {exportType === 'qr-codes' && qrCodes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select QR Codes</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAllChange} />
                  <Label htmlFor="select-all" className="text-sm cursor-pointer">Export All ({qrCodes.length})</Label>
                </div>
              </div>

              {!selectAll && (
                <div className="max-h-60 overflow-y-auto border border-white/10 rounded-lg bg-black/20 p-2 space-y-1">
                  {qrCodes.map((qr) => (
                    <div key={qr.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                      <Checkbox
                        id={`qr-${qr.id}`}
                        checked={selectedQrCodes.includes(qr.id)}
                        onCheckedChange={(c) => handleQrCodeToggle(qr.id, !!c)}
                      />
                      <Label htmlFor={`qr-${qr.id}`} className="flex-1 cursor-pointer flex justify-between">
                        <span className="truncate max-w-[200px]">{qr.name || 'Unnamed QR'}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] h-5">{qr.type}</Badge>
                          <span>{qr.scanCount} scans</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action */}
        <Button
          variant="glow"
          size="lg"
          className="w-full"
          onClick={handleExport}
          disabled={loading || (exportType === 'qr-codes' && !selectAll && selectedQrCodes.length === 0)}
        >
          {loading ? "Exporting..." : "Start Export"} <ArrowRight size={16} className="ml-2" />
        </Button>
      </Card>
    </div>
  );
}
