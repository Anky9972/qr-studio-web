'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  MoveVertical,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Phone,
  Upload,
  Eye,
  Save,
  Palette,
  Layout,
  Globe,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Wand2,
  Loader2
} from 'lucide-react';
import { useAIStore } from '@/store/ai-store';
import { clientAI } from '@/lib/ai/client-ai';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';
import PhonePreview from '@/components/ui/PhonePreview';
import ThemeEditor from '@/components/ui/ThemeEditor';
import { ThemeConfig } from '@/types/theme';
import { themePresets } from '@/lib/theme-presets';

interface SocialLink {
  platform: string;
  url: string;
  visible: boolean;
}

interface BioLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  visible: boolean;
  clickCount?: number;
}

interface LinkInBioData {
  title: string;
  description?: string;
  profileImage?: string;
  links: BioLink[];
  socialLinks: SocialLink[];
  theme: ThemeConfig;
  published: boolean;
}

interface LinkInBioBuilderProps {
  initialData?: LinkInBioData;
  onSave: (data: LinkInBioData) => Promise<void>;
  onPreview?: () => void;
}

const defaultTheme = themePresets[0].config;

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', icon: <Facebook size={16} /> },
  { value: 'twitter', label: 'Twitter/X', icon: <Twitter size={16} /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
  { value: 'youtube', label: 'YouTube', icon: <Youtube size={16} /> },
  { value: 'github', label: 'GitHub', icon: <Github size={16} /> },
  { value: 'email', label: 'Email', icon: <Mail size={16} /> },
  { value: 'phone', label: 'Phone', icon: <Phone size={16} /> },
];

export default function LinkInBioBuilder({
  initialData,
  onSave,
  onPreview,
}: LinkInBioBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [profileImage, setProfileImage] = useState(initialData?.profileImage || '');
  const [links, setLinks] = useState<BioLink[]>(initialData?.links || []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialData?.socialLinks || []);
  const [theme, setTheme] = useState(initialData?.theme || defaultTheme);
  const [published, setPublished] = useState(initialData?.published || false);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  // AI State
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAddLink = () => {
    setEditingLink(null);
    setLinkTitle('');
    setLinkUrl('');
    setLinkDialogOpen(true);
  };

  const handleEditLink = (link: BioLink) => {
    setEditingLink(link);
    setLinkTitle(link.title);
    setLinkUrl(link.url);
    setLinkDialogOpen(true);
  };

  const handleSaveLink = () => {
    if (editingLink) {
      setLinks(
        links.map((link) =>
          link.id === editingLink.id
            ? { ...link, title: linkTitle, url: linkUrl }
            : link
        )
      );
    } else {
      const newLink: BioLink = {
        id: `link-${Date.now()}`,
        title: linkTitle,
        url: linkUrl,
        visible: true,
      };
      setLinks([...links, newLink]);
    }
    setLinkDialogOpen(false);
  };

  const handleDeleteLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleToggleLinkVisibility = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, visible: !link.visible } : link
      )
    );
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links];
    if (direction === 'up' && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    } else if (direction === 'down' && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    }
    setLinks(newLinks);
  };

  const handleAddSocialLink = () => {
    if (selectedPlatform && socialUrl) {
      const existingIndex = socialLinks.findIndex(
        (link) => link.platform === selectedPlatform
      );
      if (existingIndex >= 0) {
        setSocialLinks(
          socialLinks.map((link, index) =>
            index === existingIndex ? { ...link, url: socialUrl } : link
          )
        );
      } else {
        setSocialLinks([
          ...socialLinks,
          { platform: selectedPlatform, url: socialUrl, visible: true },
        ]);
      }
      setSocialDialogOpen(false);
      setSelectedPlatform('');
      setSocialUrl('');
    }
  };

  const handleDeleteSocialLink = (platform: string) => {
    setSocialLinks(socialLinks.filter((link) => link.platform !== platform));
  };

  const handleSaveAll = async () => {
    const bioData: LinkInBioData = {
      title,
      description,
      profileImage,
      links,
      socialLinks,
      theme,
      published,
    };
    await onSave(bioData);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;

    const apiKey = useAIStore.getState().getApiKey();
    if (!apiKey) {
      alert('Please configure your AI API Key in Settings first.');
      return;
    }

    setIsAiGenerating(true);
    try {
      const systemPrompt = `You are a Social Media Manager. Generate a "Link in Bio" profile based on the user's description.
      Output valid JSON with:
      {
        "title": "Short catchy title/name",
        "description": "Engaging short bio (max 150 chars)",
        "links": [
           { "title": "Link Title", "url": "https://placeholder.url" }
        ]
      }
      Generate at least 3 relevant links. Use placeholder URLs if needed.`;

      const { text, error } = await clientAI.generateText(aiPrompt, {
        systemPrompt,
        temperature: 0.8,
        jsonMode: true
      });

      if (error) throw new Error(error);
      if (!text) throw new Error('No content returned');

      const data = JSON.parse(text);

      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.links && Array.isArray(data.links)) {
        const newLinks: BioLink[] = data.links.map((l: any, i: number) => ({
          id: `ai-link-${Date.now()}-${i}`,
          title: l.title,
          url: l.url,
          visible: true
        }));
        setLinks(newLinks);
      }

      setAiDialogOpen(false);
    } catch (e: any) {
      alert('AI Generation failed: ' + e.message);
    } finally {
      setIsAiGenerating(false);
    }
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
            <Layout size={16} /> Content
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'design' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
            )}
          >
            <Palette size={16} /> Design
          </button>
        </div>

        <Card variant="glass" className="p-6 space-y-6">
          {activeTab === 'content' ? (
            <>
              {/* Profile Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe size={18} className="text-primary" /> Profile
                </h3>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setAiDialogOpen(true)} className="border-primary/30 hover:bg-primary/5 text-primary">
                    <Sparkles size={14} className="mr-2" /> AI Autofill
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-24 h-24 border-4 border-white/5">
                      <AvatarImage src={profileImage} />
                      <AvatarFallback className="text-2xl">{title ? title[0] : '?'}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="bg-white/5 hover:bg-white/10 text-xs px-3 py-1 rounded border border-white/10 flex items-center gap-1 transition-colors">
                        <Upload size={12} /> Upload
                      </div>
                      <input id="image-upload" type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </Label>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-1.5">
                      <Label>Page Title</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="@yourbrand" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Bio</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell your story..."
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Links Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <LinkIcon size={18} className="text-primary" /> Links
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddLink}>
                    <Plus size={14} className="mr-2" /> Add Link
                  </Button>
                </div>

                {links.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/20 rounded-lg bg-white/5">
                    <p className="text-sm text-muted-foreground">No links added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {links.map((link, idx) => (
                      <div key={link.id} className="group bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3 hover:border-primary/30 transition-colors">
                        <div className="flex flex-col gap-1">
                          <button disabled={idx === 0} onClick={() => moveLink(idx, 'up')} className="text-muted-foreground hover:text-white disabled:opacity-30"><ArrowUp size={12} /></button>
                          <button disabled={idx === links.length - 1} onClick={() => moveLink(idx, 'down')} className="text-muted-foreground hover:text-white disabled:opacity-30"><ArrowDown size={12} /></button>
                        </div>
                        <div className="flex-1 min-w-0" onClick={() => handleEditLink(link)}>
                          <p className="font-medium truncate cursor-pointer hover:text-primary transition-colors">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={link.visible} onCheckedChange={() => handleToggleLinkVisibility(link.id)} />
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => handleEditLink(link)}>
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400" onClick={(e) => handleDeleteLink(link.id, e)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10" />

              {/* Social Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Globe size={18} className="text-primary" /> Socials
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setSocialDialogOpen(true)}>
                    <Plus size={14} className="mr-2" /> Add Social
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <Badge key={link.platform} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                      {socialPlatforms.find(p => p.value === link.platform)?.icon}
                      {link.platform}
                      <button onClick={() => handleDeleteSocialLink(link.platform)} className="ml-1 hover:text-red-400">
                        <Trash2 size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <ThemeEditor theme={theme} onChange={setTheme} />
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
          <Button variant="glow" onClick={handleSaveAll} disabled={!title}>
            <Save size={16} className="mr-2" /> Save & Publish
          </Button>
        </div>
      </div>

      {/* Preview Panel (Sticky) */}
      <PhonePreview theme={theme} className="lg:col-span-5">
        <div className="flex flex-col items-center gap-4 text-center">
          {profileImage ? (
            <img src={profileImage} alt={title} className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-white/50">
              {title ? title[0] : '?'}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.textColor }}>{title || "Your Page Title"}</h2>
            {description && (
              <p className="text-sm mt-1 opacity-80 whitespace-pre-wrap" style={{ color: theme.textColor }}>
                {description}
              </p>
            )}
          </div>

          <div className="w-full space-y-3 mt-4">
            {links.filter(l => l.visible).map(link => (
              <div
                key={link.id}
                className={cn(
                  "w-full py-3 px-4 text-center font-medium shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center justify-center relative overflow-hidden",
                  theme.buttonStyle === 'rounded' && "rounded-lg",
                  theme.buttonStyle === 'pill' && "rounded-full",
                  theme.buttonStyle === 'square' && "rounded-none",
                  theme.buttonStyle === 'soft' && "rounded-xl",
                  theme.cardStyle === 'glass' && "backdrop-blur-sm bg-opacity-80",
                )}
                style={{
                  backgroundColor: theme.primaryColor,
                  color: '#ffffff'
                }}
              >
                {link.title}
              </div>
            ))}
          </div>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {socialLinks.map(link => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  style={{ color: theme.textColor }}
                >
                  {socialPlatforms.find(p => p.value === link.platform)?.icon || <LinkIcon size={20} />}
                </a>
              ))}
            </div>
          )}
        </div>
      </PhonePreview>

      {/* Dialogs */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="My Awesome Website" />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleSaveLink} disabled={!linkTitle || !linkUrl}>
              {editingLink ? 'Update Link' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Social Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map(p => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        {p.icon} <span>{p.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL / Username</Label>
              <Input value={socialUrl} onChange={(e) => setSocialUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSocialDialogOpen(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleAddSocialLink} disabled={!selectedPlatform || !socialUrl}>
              Add Social
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              AI Content Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>What is this page for?</Label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. A photography portfolio for landscapes, selling prints and booking workshops."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">The AI will generate a title, bio, and suggested links for you.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAiDialogOpen(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleAiGenerate} disabled={isAiGenerating || !aiPrompt}>
              {isAiGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
              Generate Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
