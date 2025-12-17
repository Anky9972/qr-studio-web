'use client';

import { useState, useEffect } from 'react'; // Removed MUI imports
import {
  User,
  Lock,
  Key,
  Webhook,
  Settings as SettingsIcon,
  CreditCard,
  Upload,
  Save,
  Trash2,
  Copy,
  Plus,
  AlertTriangle,
  CheckCircle,
  Activity,
  History,
  Bell,
  Bot,
  Sparkles
} from 'lucide-react';
import { AISettingsModal } from '@/components/settings/AISettingsModal';
import { usePreferencesStore } from '@/store/preferencesStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';

// Mock Alert component if not exists, or just use div. 
// I'll create a simple inline Alert for now since I don't have proper Alert component in ui folder yet (only reviewed basics).
// Actually, I'll allow the import but if it fails I'll fallback to div in my mind, but for code I'll define a local Alert since I haven't created it yet.

// LocalAlert removed, using imported Alert


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const prefs = usePreferencesStore(state => state.preferences);
  const updatePreferences = usePreferencesStore(state => state.updatePreferences);

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userPlan, setUserPlan] = useState('');
  const [joinedDate, setJoinedDate] = useState('');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; keyPrefix: string; name: string; createdAt: string; lastUsedAt: string | null; expiresAt: string | null }>>([]);
  const [newKeyData, setNewKeyData] = useState<{ key: string; name: string } | null>(null);
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiration, setNewKeyExpiration] = useState<string>('');

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [openWebhookDialog, setOpenWebhookDialog] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['qr.bulk.completed']);

  // AI Settings
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Available webhook events
  const WEBHOOK_EVENTS = [
    { value: 'qr.bulk.completed', label: 'Bulk QR Generation Completed' },
    { value: 'qr.export.completed', label: 'Large Export Completed' },
    { value: 'campaign.milestone', label: 'Campaign Milestone Reached' },
    { value: 'scan.threshold', label: 'Scan Threshold Reached' },
  ];

  // Preferences
  const [localPrefs, setLocalPrefs] = useState(prefs);

  useEffect(() => {
    fetchUserProfile();
    fetchApiKeys();
    fetchWebhooks();
  }, []);

  useEffect(() => setLocalPrefs(prefs), [prefs]);

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setName(data.user.name || '');
        setEmail(data.user.email || '');
        setAvatarPreview(data.user.image || null);
        setUserPlan(data.user.subscription || data.user.plan || 'FREE');
        setJoinedDate(data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Name and Email are required');
      return;
    }
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, image: avatarPreview }),
      });
      if (response.ok) {
        alert('Profile updated successfully');
        fetchUserProfile();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert('Please enter both passwords');
      return;
    }
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (response.ok) {
        alert('Password changed');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys || []);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName || 'Unnamed Key',
          expiresIn: newKeyExpiration || undefined,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setNewKeyData({ key: data.key, name: data.apiKey.name });
        setCreateKeyDialogOpen(false);
        setNewKeyName('');
        setNewKeyExpiration('');
        fetchApiKeys();
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
    }
  };

  const revokeApiKey = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/api-keys/${id}`, { method: 'DELETE' });
      if (response.ok) setApiKeys(prev => prev.filter(k => k.id !== id));
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/webhooks');
      if (response.ok) {
        const data = await response.json();
        setWebhooks(data.webhooks || []);
      }
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  };

  const createWebhook = async () => {
    if (!webhookUrl || selectedEvents.length === 0) {
      alert('Please enter URL and select events');
      return;
    }
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, events: selectedEvents }),
      });
      if (response.ok) {
        setWebhookUrl('');
        setSelectedEvents(['qr.bulk.completed']);
        setOpenWebhookDialog(false);
        fetchWebhooks();
        alert('Webhook created!');
      } else {
        alert('Failed to create webhook');
      }
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchWebhooks();
        alert('Webhook deleted');
      }
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const toggleWebhook = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (response.ok) fetchWebhooks();
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl) return;
    setWebhookTesting(true);
    setWebhookTestResult(null);
    try {
      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, event: 'qr.bulk.completed', payload: { qrCount: 100, format: 'zip', status: 'completed' } }),
      });
      const data = await response.json();
      setWebhookTestResult({ success: data.success || false, message: data.message || (response.ok ? 'Success!' : 'Failed') });
    } catch (error) {
      setWebhookTestResult({ success: false, message: 'Network error' });
    } finally {
      setWebhookTesting(false);
    }
  };

  const savePreferences = () => updatePreferences(localPrefs);
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your profile, security, API keys, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile"><User size={16} className="mr-2" /> Profile</TabsTrigger>
          <TabsTrigger value="security"><Lock size={16} className="mr-2" /> Security</TabsTrigger>
          <TabsTrigger value="api-keys"><Key size={16} className="mr-2" /> API Keys</TabsTrigger>
          <TabsTrigger value="webhooks"><Webhook size={16} className="mr-2" /> Webhooks</TabsTrigger>
          <TabsTrigger value="ai"><Bot size={16} className="mr-2" /> AI Features</TabsTrigger>
          <TabsTrigger value="preferences"><SettingsIcon size={16} className="mr-2" /> Preferences</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard size={16} className="mr-2" /> Billing</TabsTrigger>
        </TabsList>

        {/* AI TAB */}
        <TabsContent value="ai" className="mt-6">
          <Card variant="neon" className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Supercharge QR Studio with AI</h3>
                <p className="text-muted-foreground">
                  Connect your own API keys to enable next-generation features like Magic Themes, AI Microsite Builder, and Smart Analytics.
                  Your keys are stored securely in your browser.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="mb-2 font-semibold flex items-center justify-center gap-2"><SettingsIcon size={14} /> Magic Themes</div>
                  <p className="text-xs text-muted-foreground">Generate beautiful QR styles from text descriptions.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="mb-2 font-semibold flex items-center justify-center gap-2"><Bot size={14} /> Smart Analytics</div>
                  <p className="text-xs text-muted-foreground">Chat with your data to get instant insights.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="mb-2 font-semibold flex items-center justify-center gap-2"><Sparkles size={14} /> AI Microsites</div>
                  <p className="text-xs text-muted-foreground">Auto-generate landing page content.</p>
                </div>
              </div>

              <Button size="lg" variant="glow" onClick={() => setAiModalOpen(true)} className="mt-4">
                <Key size={16} className="mr-2" /> Configure API Keys
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="glass" className="p-6 col-span-1 lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold flex items-center"><User className="mr-2 text-primary" size={20} /> Personal Information</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-32 h-32 border-4 border-white/5">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="text-4xl">{name ? name[0].toUpperCase() : '?'}</AvatarFallback>
                  </Avatar>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" className="pointer-events-none" asChild>
                      <span><Upload size={14} className="mr-2" /> Upload</span>
                    </Button>
                    <input id="avatar-upload" type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                  </Label>
                  <p className="text-xs text-muted-foreground text-center">JPG, PNG or GIF (max 2MB)</p>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" />
                  </div>
                  <div className="pt-2 flex gap-3">
                    <Button variant="glow" onClick={handleSaveProfile} disabled={profileLoading}>
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                    <Button variant="ghost">Disconnect OAuth</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="neon" className="p-6 col-span-1 space-y-6">
              <h3 className="text-lg font-semibold flex items-center"><Activity className="mr-2 text-primary" size={20} /> Account Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-muted-foreground text-sm">Current Plan</span>
                  <Badge variant="default">{userPlan.toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-muted-foreground text-sm">Member Since</span>
                  <span className="font-mono text-sm">{joinedDate || 'N/A'}</span>
                </div>
                <div className="py-2 border-b border-white/10">
                  <span className="text-muted-foreground text-sm block mb-1">Account ID</span>
                  <code className="text-xs bg-black/30 p-1 rounded break-all block">{email ? email : 'N/A'}</code>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Active</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center"><Lock className="mr-2 text-primary" size={20} /> Change Password</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <Button onClick={handleChangePassword} className="w-full mt-2">Update Password</Button>
              </div>
            </Card>

            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center"><CheckCircle className="mr-2 text-primary" size={20} /> Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account by enabling TOTP-based 2FA.</p>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="font-medium">2FA Status</span>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-medium", twoFAEnabled ? "text-emerald-400" : "text-muted-foreground")}>
                    {twoFAEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* API KEYS TAB */}
        <TabsContent value="api-keys" className="mt-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">API Keys</h3>
              <p className="text-sm text-muted-foreground">Manage authorized access keys for your applications.</p>
            </div>
            <Button variant="glow" onClick={() => setCreateKeyDialogOpen(true)}>
              <Plus size={16} className="mr-2" /> Generate New Key
            </Button>
          </div>

          {newKeyData && (
            <Alert variant="destructive" className="flex flex-col gap-2 border-emerald-500/50 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 [&>svg]:text-emerald-500">
              <div className="flex items-center gap-2 font-semibold"><CheckCircle size={16} /> API Key Created: {newKeyData.name}</div>
              <p className="text-xs opacity-90">Copy this key now. You won&apos;t be able to see it again!</p>
              <div className="flex items-center gap-2 bg-black/20 p-2 rounded mt-1">
                <code className="flex-1 font-mono text-xs">{newKeyData.key}</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(newKeyData.key)}><Copy size={14} /></Button>
              </div>
              <Button variant="outline" size="sm" className="self-start mt-2" onClick={() => setNewKeyData(null)}>I&apos;ve saved this key</Button>
            </Alert>
          )}

          <Card variant="glass" className="overflow-hidden">
            {apiKeys.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Key size={48} className="mx-auto mb-4 opacity-50" />
                <p>No API keys found. Create one to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {apiKeys.length > 0 && apiKeys.map(key => (
                  <div key={key.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-sm">{key.keyPrefix}••••</span>
                        <span className="font-semibold">{key.name}</span>
                        {key.expiresAt && new Date(key.expiresAt) < new Date() && (
                          <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex gap-4">
                        <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                        {key.lastUsedAt && <span>Last Used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(key.keyPrefix)}><Copy size={14} /></Button>
                      <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300" onClick={() => revokeApiKey(key.id)}><Trash2 size={14} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Alert variant="destructive" className="flex items-center gap-2 border-amber-500/50 bg-amber-500/10 text-amber-500 dark:text-amber-400 [&>svg]:text-amber-500">
            <AlertTriangle size={16} /> <span>Treat your API keys like passwords. Do not share them in client-side code.</span>
          </Alert>
        </TabsContent>

        {/* WEBHOOKS TAB */}
        <TabsContent value="webhooks" className="mt-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Webhooks</h3>
              <p className="text-sm text-muted-foreground">Get notified when events occur in your account.</p>
            </div>
            <Button variant="glow" onClick={() => setOpenWebhookDialog(true)}>
              <Plus size={16} className="mr-2" /> Create Webhook
            </Button>
          </div>

          <Card variant="glass" className="overflow-hidden">
            {webhooks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Webhook size={48} className="mx-auto mb-4 opacity-50" />
                <p>No webhooks configured.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {webhooks.map(wh => (
                  <div key={wh.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{wh.url}</span>
                        {wh.failureCount > 0 && <Badge variant="destructive">{wh.failureCount} failures</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Events: {wh.events.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={wh.active} onCheckedChange={(checked: boolean) => toggleWebhook(wh.id, wh.active)} />
                      <div className="h-4 w-px bg-white/10 mx-1"></div>
                      <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300" onClick={() => deleteWebhook(wh.id)}><Trash2 size={14} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* PREFERENCES TAB */}
        <TabsContent value="preferences" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center"><SettingsIcon className="mr-2 text-primary" size={20} /> General</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-sm font-medium">Appearance</Label>
                    <p className="text-xs text-muted-foreground mt-1">Dark mode is enabled permanently</p>
                  </div>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Dark</Badge>
                </div>
                <Button variant="glow" onClick={savePreferences} className="w-full">
                  <Save size={16} className="mr-2" /> Save Preferences
                </Button>
              </div>
            </Card>
            <Card variant="glass" className="p-6 space-y-6">
              <h3 className="text-lg font-semibold flex items-center"><History className="mr-2 text-primary" size={20} /> History & Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Notifications</Label>
                  <Switch checked={localPrefs.notificationsEnabled} onCheckedChange={(c) => setLocalPrefs({ ...localPrefs, notificationsEnabled: c })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-Open URLs</Label>
                  <Switch checked={localPrefs.autoOpen} onCheckedChange={(c) => setLocalPrefs({ ...localPrefs, autoOpen: c })} />
                </div>
                <div className="space-y-2 pt-2">
                  <Label>Max History Items</Label>
                  <Input
                    type="number"
                    value={localPrefs.maxHistoryItems}
                    onChange={(e) => setLocalPrefs({ ...localPrefs, maxHistoryItems: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value="billing" className="mt-6">
          <Card variant="glass" className="p-8 text-center space-y-6">
            <CreditCard size={48} className="mx-auto text-primary opacity-80" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Manage Subscription</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                View your current plan details, manage payment methods, and download invoices.
                Stripe integration is coming soon.
              </p>
            </div>
            <Button variant="outline" size="lg">Manage Billing on Stripe</Button>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CREATE API KEY DIALOG */}
      <Dialog open={createKeyDialogOpen} onOpenChange={setCreateKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. Production Server" />
            </div>
            <div className="space-y-2">
              <Label>Expiration</Label>
              <Select value={newKeyExpiration} onValueChange={setNewKeyExpiration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Never</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button variant="glow" onClick={generateApiKey} disabled={!newKeyName.trim()}>Generate Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE WEBHOOK DIALOG */}
      <Dialog open={openWebhookDialog} onOpenChange={setOpenWebhookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://api.yourapp.com/webhooks" />
            </div>
            <div className="space-y-2">
              <Label>Events</Label>
              {/* Simple mock multi-select using standard select for now or checkbox list */}
              <div className="space-y-2 border border-white/10 rounded p-3 bg-black/20 max-h-40 overflow-y-auto">
                {WEBHOOK_EVENTS.map(ev => (
                  <div key={ev.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={ev.value}
                      checked={selectedEvents.includes(ev.value)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedEvents(prev => [...prev, ev.value]);
                        else setSelectedEvents(prev => prev.filter(x => x !== ev.value));
                      }}
                      className="rounded border-white/20 bg-white/5"
                    />
                    <label htmlFor={ev.value} className="text-sm cursor-pointer">{ev.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={testWebhook} disabled={!webhookUrl || webhookTesting} className="w-full">
                {webhookTesting ? 'Testing...' : 'Test Endpoint'}
              </Button>
              {webhookTestResult && (
                <div className={cn("mt-2 text-xs p-2 rounded", webhookTestResult.success ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                  {webhookTestResult.message}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button variant="glow" onClick={createWebhook} disabled={!webhookUrl || selectedEvents.length === 0}>Create Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AISettingsModal open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </div>
  );
}
