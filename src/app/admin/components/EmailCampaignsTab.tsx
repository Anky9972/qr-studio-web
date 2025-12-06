'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Switch } from "@/components/ui/switch";
import { Send, Mail, Server, Shield, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';

interface EmailCampaignsTabProps {
    form: any;
    setForm: (form: any) => void;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleSend: () => void;
}

export function EmailCampaignsTab({
    form,
    setForm,
    dialogOpen,
    setDialogOpen,
    handleSend
}: EmailCampaignsTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-electric-cyan" />
                        Email Campaigns
                    </h2>
                    <p className="text-sm text-gray-400">Send bulk emails and newsletters to your audience.</p>
                </div>
                <Button variant="glow" onClick={() => setDialogOpen(true)}>
                    <Send className="w-4 h-4 mr-2" /> Compose Email
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                <Server className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-500 mb-1">SMTP Configuration Required</h4>
                                <p className="text-sm text-amber-500/80 leading-relaxed">
                                    To send emails, please ensure your SMTP server settings are correctly configured in the environment variables.
                                    We recommend using a transactional email service like SendGrid or AWS SES for better deliverability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <Card variant="glass" className="p-5 h-full">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            Server Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">SMTP Host</span>
                                <span className="text-white font-mono bg-white/5 px-2 py-1 rounded">smtp.example.com</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Port</span>
                                <span className="text-white font-mono bg-white/5 px-2 py-1 rounded">587</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Secure</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    TLS Enabled
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2">
                                Test Connection
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Compose Email Campaign</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-300">Subject Line</label>
                            <Input
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                placeholder="Exciting News!"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-300">Email Body (HTML Supported)</label>
                            <Textarea
                                value={form.body}
                                onChange={(e) => setForm({ ...form, body: e.target.value })}
                                placeholder="Dear user..."
                                className="min-h-[250px] bg-black/50 border-white/10 text-white font-mono text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Recipients</label>
                                <Select
                                    value={form.recipients}
                                    onValueChange={(val) => setForm({ ...form, recipients: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select recipients" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        <SelectItem value="free">Free Users Only</SelectItem>
                                        <SelectItem value="pro">Pro Users Only</SelectItem>
                                        <SelectItem value="business">Business Users Only</SelectItem>
                                        <SelectItem value="inactive">Inactive Users (30+ days)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-300">Schedule (Optional)</label>
                                <div className="relative">
                                    <Input
                                        type="datetime-local"
                                        value={form.sendAt}
                                        onChange={(e) => setForm({ ...form, sendAt: e.target.value })}
                                        className="bg-black/50 pl-10"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button variant="glow" onClick={handleSend} disabled={!form.subject || !form.body}>
                            <Send className="w-4 h-4 mr-2" />
                            {form.sendAt ? 'Schedule Campaign' : 'Send Immediately'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
