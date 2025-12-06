'use client';

import React, { useState } from 'react';
import {
  FileText,
  Settings,
  Palette,
  Layout,
  Plus,
  Trash2,
  Edit2,
  Download,
  Eye,
  Save,
  CheckCircle,
  Database,
  ArrowUp,
  ArrowDown,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  List,
  Type,
  CheckSquare,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

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
  primaryColor: '#8b5cf6',
  backgroundColor: '#171717',
  fontFamily: 'Inter, sans-serif',
};

const commonFields: Omit<FormField, 'id'>[] = [
  { name: 'fullName', type: 'text', label: 'Full Name', required: true },
  { name: 'email', type: 'email', label: 'Email Address', required: true },
  { name: 'phone', type: 'phone', label: 'Phone Number', required: false },
  { name: 'company', type: 'text', label: 'Company Name', required: false },
  { name: 'message', type: 'textarea', label: 'Message', required: false },
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
  const [submitText, setSubmitText] = useState(data?.submitText || 'Get Access');
  const [theme, setTheme] = useState(data?.theme || defaultTheme);
  const [submissions, setSubmissions] = useState<Submission[]>(data?.submissions || []);
  const [published, setPublished] = useState(data?.published || false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'results'>('content');

  // Field Dialog State
  const [fieldDialog, setFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FormField['type']>('text');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);

  // Submissions Dialog
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
      setFields(fields.map(f => f.id === editingField.id ? newField : f));
    } else {
      setFields([...fields, newField]);
    }
    setFieldDialog(false);
  };

  const handleDeleteField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFields(fields.filter(f => f.id !== id));
  };

  const handleAddCommonField = (template: Omit<FormField, 'id'>) => {
    setFields([...fields, { ...template, id: `field-${Date.now()}` }]);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    if (direction === 'up' && index > 0) {
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    }
    setFields(newFields);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'content' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
            )}
          >
            <Layout size={16} /> Form Setup
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'design' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
            )}
          >
            <Palette size={16} /> Appearance
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'results' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
            )}
          >
            <Database size={16} /> Results
          </button>
        </div>

        <Card variant="glass" className="p-6 space-y-6">
          {activeTab === 'content' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText size={18} className="text-primary" /> Basic Info
                </h3>
                <div className="space-y-2">
                  <Label>Internal Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 Marketing Lead Capture" />
                </div>
                <div className="space-y-2">
                  <Label>Public Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Get Your Free Guide" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter details to unlock..." rows={2} />
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Layout size={18} className="text-primary" /> Form Fields
                </h3>

                {/* Quick Add */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {commonFields.map(f => (
                    <Button key={f.name} variant="outline" size="sm" onClick={() => handleAddCommonField(f)} className="gap-2">
                      <Plus size={12} /> {f.label}
                    </Button>
                  ))}
                </div>

                <Button variant="outline" className="w-full mb-4 border-dashed" onClick={handleAddField}>
                  <Plus size={14} className="mr-2" /> Add Custom Field
                </Button>

                {fields.length === 0 ? (
                  <div className="text-center py-8 opacity-50 border border-dashed border-white/20 rounded-lg">No fields added</div>
                ) : (
                  <div className="space-y-2">
                    {fields.map((field, idx) => (
                      <div key={field.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleEditField(field)}>
                        <div className="flex flex-col gap-1">
                          <button disabled={idx === 0} onClick={(e) => { e.stopPropagation(); moveField(idx, 'up'); }} className="text-muted-foreground hover:text-white disabled:opacity-30"><ArrowUp size={12} /></button>
                          <button disabled={idx === fields.length - 1} onClick={(e) => { e.stopPropagation(); moveField(idx, 'down'); }} className="text-muted-foreground hover:text-white disabled:opacity-30"><ArrowDown size={12} /></button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{field.label}</span>
                            {field.required && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Required</Badge>}
                          </div>
                          <span className="text-xs text-muted-foreground capitalize">{field.type}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={(e) => handleDeleteField(field.id, e)} className="hover:text-red-400"><Trash2 size={14} /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle size={18} className="text-primary" /> Submission Action
                </h3>
                <div className="space-y-2">
                  <Label>Redirect URL</Label>
                  <Input value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} placeholder="https://example.com/ebook.pdf" />
                  <p className="text-xs text-muted-foreground">Where to send users after they successfully submit the form.</p>
                </div>
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input value={submitText} onChange={(e) => setSubmitText(e.target.value)} placeholder="Get Access Now" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette size={18} className="text-primary" /> Theme
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-white/20 overflow-hidden relative">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                      />
                    </div>
                    <Input value={theme.primaryColor} onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })} className="font-mono" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-white/20 overflow-hidden relative">
                      <input
                        type="color"
                        value={theme.backgroundColor}
                        onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                      />
                    </div>
                    <Input value={theme.backgroundColor} onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })} className="font-mono" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Database size={18} className="text-primary" /> Collected Leads
                </h3>
                <Button variant="outline" size="sm" onClick={downloadSubmissions} disabled={submissions.length === 0}>
                  <Download size={14} className="mr-2" /> Export CSV
                </Button>
              </div>

              <div className="border border-white/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-muted-foreground font-medium border-b border-white/10">
                      <tr>
                        <th className="p-3">Date</th>
                        {fields.slice(0, 3).map(f => <th key={f.id} className="p-3">{f.label}</th>)}
                        {fields.length > 3 && <th className="p-3">...</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {submissions.length === 0 ? (
                        <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No submissions yet</td></tr>
                      ) : (
                        submissions.slice(0, 10).map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/5">
                            <td className="p-3 whitespace-nowrap opacity-70">{new Date(sub.timestamp).toLocaleDateString()}</td>
                            {fields.slice(0, 3).map(f => <td key={f.id} className="p-3">{sub.data[f.name] || '-'}</td>)}
                            {fields.length > 3 && <td className="p-3 opacity-50">...</td>}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {submissions.length > 10 && <div className="p-2 text-center text-xs text-muted-foreground border-t border-white/10">Showing recent 10 of {submissions.length}</div>}
              </div>
            </div>
          )}
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/10 sticky bottom-4 z-10">
          <div className="flex items-center gap-3">
            <Switch checked={published} onCheckedChange={setPublished} id="publish-switch" />
            <Label htmlFor="publish-switch" className={published ? "text-emerald-400 font-medium" : "text-muted-foreground"}>
              {published ? "Published" : "Draft Mode"}
            </Label>
          </div>

          <Button variant="glow" onClick={handleSave} disabled={!name || !title || fields.length === 0} size="lg">
            <Save size={16} className="mr-2" /> Save Lead Gate
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-6">
          <div className="bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden aspect-[9/19] max-w-[320px] mx-auto relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-gray-800 rounded-b-xl z-20"></div>

            <div
              className="w-full h-full overflow-y-auto hide-scrollbar p-6 pt-12"
              style={{ backgroundColor: theme.backgroundColor, fontFamily: theme.fontFamily }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: theme.primaryColor }}>{title}</h2>
                <p className="text-sm opacity-80 whitespace-pre-wrap" style={{ color: '#fff' }}>{description}</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {fields.map(field => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-xs font-medium ml-1" style={{ color: '#ccc' }}>
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="w-full rounded-lg bg-white/10 border-transparent focus:border-white/30 focus:ring-0 text-white text-sm p-3 min-h-[80px]"
                        placeholder={field.placeholder}
                      ></textarea>
                    ) : field.type === 'select' ? (
                      <select className="w-full rounded-lg bg-white/10 border-transparent focus:border-white/30 focus:ring-0 text-white text-sm p-3">
                        <option value="">Select option...</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full rounded-lg bg-white/10 border-transparent focus:border-white/30 focus:ring-0 text-white text-sm p-3"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}

                <button
                  className="w-full py-3 rounded-lg font-bold text-white shadow-lg mt-6"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {submitText}
                </button>

                <p className="text-[10px] text-center opacity-40 mt-4 text-white">
                  Securely processed by QR Studio
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Field Dialog */}
      <Dialog open={fieldDialog} onOpenChange={setFieldDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingField ? 'Edit Field' : 'Add Custom Field'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Internal Name</Label>
                <Input value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder="companySize" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={fieldType} onValueChange={(val: any) => setFieldType(val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="textarea">Long Text</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} placeholder="Company Size" />
            </div>
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input value={fieldPlaceholder} onChange={(e) => setFieldPlaceholder(e.target.value)} placeholder="e.g. 10-50 employees" />
            </div>
            {fieldType === 'select' && (
              <div className="space-y-2">
                <Label>Options (comma separated)</Label>
                <Input value={fieldOptions.join(', ')} onChange={(e) => setFieldOptions(e.target.value.split(',').map(s => s.trim()))} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Switch checked={fieldRequired} onCheckedChange={setFieldRequired} id="req-field" />
              <Label htmlFor="req-field">Required Field</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFieldDialog(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleSaveField} disabled={!fieldName || !fieldLabel}>{editingField ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
