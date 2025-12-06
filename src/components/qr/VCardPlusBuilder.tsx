'use client';

import React, { useState } from 'react';
import {
  User,
  Building,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Upload,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  Download,
  Eye,
  Save,
  Palette,
  Layout,
  Contact,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface VCardPlusData {
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  bio?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  customFields: CustomField[];
  theme: {
    primaryColor: string;
    backgroundColor: string;
  };
  downloadEnabled: boolean;
  published: boolean;
}

interface VCardPlusBuilderProps {
  data?: VCardPlusData;
  onSave: (data: VCardPlusData) => Promise<void>;
  onPreview?: () => void;
}

const defaultTheme = {
  primaryColor: '#3b82f6',
  backgroundColor: '#0f172a',
};

export default function VCardPlusBuilder({
  data,
  onSave,
  onPreview,
}: VCardPlusBuilderProps) {
  const [firstName, setFirstName] = useState(data?.firstName || '');
  const [lastName, setLastName] = useState(data?.lastName || '');
  const [company, setCompany] = useState(data?.company || '');
  const [jobTitle, setJobTitle] = useState(data?.jobTitle || '');
  const [email, setEmail] = useState(data?.email || '');
  const [phone, setPhone] = useState(data?.phone || '');
  const [website, setWebsite] = useState(data?.website || '');
  const [address, setAddress] = useState(data?.address || '');
  const [profilePhoto, setProfilePhoto] = useState(data?.profilePhoto || '');
  const [coverPhoto, setCoverPhoto] = useState(data?.coverPhoto || '');
  const [bio, setBio] = useState(data?.bio || '');
  const [socialLinks, setSocialLinks] = useState(
    data?.socialLinks || { linkedin: '', twitter: '', facebook: '', instagram: '' }
  );
  const [customFields, setCustomFields] = useState<CustomField[]>(
    data?.customFields || []
  );
  const [theme, setTheme] = useState(data?.theme || defaultTheme);
  const [downloadEnabled, setDownloadEnabled] = useState(
    data?.downloadEnabled ?? true
  );
  const [published, setPublished] = useState(data?.published ?? false);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');

  const [customFieldDialog, setCustomFieldDialog] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomField = () => {
    if (customFieldLabel && customFieldValue) {
      setCustomFields([
        ...customFields,
        {
          id: `field-${Date.now()}`,
          label: customFieldLabel,
          value: customFieldValue,
        },
      ]);
      setCustomFieldLabel('');
      setCustomFieldValue('');
      setCustomFieldDialog(false);
    }
  };

  const handleDeleteCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const handleSave = async () => {
    const vCardData: VCardPlusData = {
      firstName,
      lastName,
      company,
      jobTitle,
      email,
      phone,
      website,
      address,
      profilePhoto,
      coverPhoto,
      bio,
      socialLinks,
      customFields,
      theme,
      downloadEnabled,
      published,
    };
    await onSave(vCardData);
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
              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Upload size={18} className="text-primary" /> Media
                </h3>

                {/* Cover Photo */}
                <div className="space-y-2">
                  <Label>Cover Photo</Label>
                  <div
                    className="h-32 rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    {coverPhoto ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${coverPhoto})` }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload size={20} className="mb-2" />
                        <span className="text-xs">Click to upload cover</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Change Cover</span>
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleCoverPhotoUpload} />
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer">
                    <Avatar className="w-20 h-20 border-2 border-white/20">
                      <AvatarImage src={profilePhoto} />
                      <AvatarFallback className="bg-white/10 text-xl">{firstName ? firstName[0] : '?'}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={16} className="text-white" />
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer rounded-full" accept="image/*" onChange={handleProfilePhotoUpload} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Upload a professional photo.</p>
                    <p>Recommended size: 500x500px.</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User size={18} className="text-primary" /> Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <div className="relative">
                      <Building size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                      <Input className="pl-9" value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                      <Input className="pl-9" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself..." className="resize-none" />
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Contact size={18} className="text-primary" /> Contact Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                      <Input className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                      <Input className="pl-9" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                      <Input className="pl-9" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                      <Input className="pl-9" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Share2 size={18} className="text-primary" /> Social Media
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Linkedin size={16} className="absolute left-3 top-2.5 text-blue-400" />
                    <Input className="pl-9" placeholder="LinkedIn URL" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} />
                  </div>
                  <div className="relative">
                    <Twitter size={16} className="absolute left-3 top-2.5 text-sky-400" />
                    <Input className="pl-9" placeholder="Twitter URL" value={socialLinks.twitter} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} />
                  </div>
                  <div className="relative">
                    <Facebook size={16} className="absolute left-3 top-2.5 text-blue-600" />
                    <Input className="pl-9" placeholder="Facebook URL" value={socialLinks.facebook} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} />
                  </div>
                  <div className="relative">
                    <Instagram size={16} className="absolute left-3 top-2.5 text-pink-500" />
                    <Input className="pl-9" placeholder="Instagram URL" value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Plus size={18} className="text-primary" /> Custom Fields
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setCustomFieldDialog(true)}>Add Field</Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {customFields.map((field) => (
                    <Badge key={field.id} variant="secondary" className="pl-3 pr-1 py-1 gap-2">
                      <span className="font-semibold">{field.label}:</span> {field.value}
                      <button onClick={() => handleDeleteCustomField(field.id)} className="hover:text-red-400 ml-1">
                        <Trash2 size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette size={18} className="text-primary" /> Appearance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Color */}
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

                {/* Background Color */}
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
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/10 sticky bottom-4 z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="publish-switch" />
              <Label htmlFor="publish-switch" className={published ? "text-emerald-400 font-medium" : "text-muted-foreground"}>
                {published ? "Published" : "Draft Mode"}
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={downloadEnabled} onCheckedChange={setDownloadEnabled} id="download-switch" />
              <Label htmlFor="download-switch" className="text-muted-foreground">Allow .vcf Download</Label>
            </div>
          </div>

          <Button variant="glow" onClick={handleSave} disabled={!firstName || !lastName} size="lg">
            <Save size={16} className="mr-2" /> Save vCard
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-6">
          <div className="bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden aspect-[9/19] max-w-[320px] mx-auto relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-gray-800 rounded-b-xl z-20"></div>

            <div
              className="w-full h-full overflow-y-auto hide-scrollbar"
              style={{ backgroundColor: theme.backgroundColor }}
            >
              {/* Cover */}
              <div
                className="w-full h-32 bg-cover bg-center"
                style={{
                  backgroundImage: coverPhoto ? `url(${coverPhoto})` : 'none',
                  backgroundColor: coverPhoto ? 'transparent' : theme.primaryColor
                }}
              />

              {/* Content Container */}
              <div className="px-6 pb-8 -mt-12 relative flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 border-4" style={{ borderColor: theme.backgroundColor }}>
                  <AvatarImage src={profilePhoto} />
                  <AvatarFallback className="bg-gray-200 text-gray-500 text-2xl font-bold">{firstName ? firstName[0] : '?'}</AvatarFallback>
                </Avatar>

                <div className="mt-3 space-y-1">
                  <h2 className="text-xl font-bold text-white">{firstName} {lastName}</h2>
                  {(jobTitle || company) && (
                    <p className="text-sm text-gray-400">{jobTitle} {jobTitle && company ? 'at' : ''} {company}</p>
                  )}
                </div>

                {bio && <p className="text-sm text-gray-300 mt-4 leading-relaxed">{bio}</p>}

                {downloadEnabled && (
                  <Button
                    className="w-full mt-6 rounded-full font-medium shadow-lg"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Download size={16} className="mr-2" /> Save Contact
                  </Button>
                )}

                {/* Contact Links */}
                <div className="w-full mt-8 space-y-3">
                  {email && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="p-2 rounded-full bg-white/5 text-gray-300"><Mail size={16} /></div>
                      <span className="text-sm text-gray-300">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="p-2 rounded-full bg-white/5 text-gray-300"><Phone size={16} /></div>
                      <span className="text-sm text-gray-300">{phone}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="p-2 rounded-full bg-white/5 text-gray-300"><Globe size={16} /></div>
                      <span className="text-sm text-gray-300">{website}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="p-2 rounded-full bg-white/5 text-gray-300"><MapPin size={16} /></div>
                      <span className="text-sm text-gray-300">{address}</span>
                    </div>
                  )}
                </div>

                {/* Socials */}
                <div className="flex justify-center gap-4 mt-8">
                  {socialLinks.linkedin && <div style={{ color: theme.primaryColor }}><Linkedin size={20} /></div>}
                  {socialLinks.twitter && <div style={{ color: theme.primaryColor }}><Twitter size={20} /></div>}
                  {socialLinks.facebook && <div style={{ color: theme.primaryColor }}><Facebook size={20} /></div>}
                  {socialLinks.instagram && <div style={{ color: theme.primaryColor }}><Instagram size={20} /></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Field Dialog */}
      <Dialog open={customFieldDialog} onOpenChange={setCustomFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={customFieldLabel} onChange={(e) => setCustomFieldLabel(e.target.value)} placeholder="e.g. Fax" />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input value={customFieldValue} onChange={(e) => setCustomFieldValue(e.target.value)} placeholder="Value..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCustomFieldDialog(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleAddCustomField} disabled={!customFieldLabel || !customFieldValue}>
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
