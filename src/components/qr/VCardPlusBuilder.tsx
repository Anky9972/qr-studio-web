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
  Avatar,
  Divider,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Upload,
  Phone,
  Email,
  Business,
  LocationOn,
  Language as WebIcon,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  Add,
  Delete,
  Download,
  Visibility,
} from '@mui/icons-material';

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
  primaryColor: '#6366f1',
  backgroundColor: '#f8f9fa',
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

  const [customFieldDialog, setCustomFieldDialog] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  const handleProfilePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string);
      };
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

  const generateVCF = () => {
    let vcf = 'BEGIN:VCARD\n';
    vcf += 'VERSION:3.0\n';
    vcf += `FN:${firstName} ${lastName}\n`;
    vcf += `N:${lastName};${firstName};;;\n`;
    if (company) vcf += `ORG:${company}\n`;
    if (jobTitle) vcf += `TITLE:${jobTitle}\n`;
    if (email) vcf += `EMAIL:${email}\n`;
    if (phone) vcf += `TEL:${phone}\n`;
    if (website) vcf += `URL:${website}\n`;
    if (address) vcf += `ADR:;;${address};;;;\n`;
    vcf += 'END:VCARD';

    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${firstName}_${lastName}.vcf`;
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
                vCard Plus Builder
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                Create a hosted digital business card that's editable anytime and
                includes a "Save Contact" button.
              </Alert>

              {/* Cover Photo */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Cover Photo (Optional)
                </Typography>
                {coverPhoto && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      backgroundImage: `url(${coverPhoto})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload />}
                  size="small"
                >
                  Upload Cover Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleCoverPhotoUpload}
                  />
                </Button>
              </Box>

              {/* Profile Photo */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Profile Photo
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={profilePhoto} sx={{ width: 80, height: 80 }} />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload />}
                  >
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                    />
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Basic Information */}
              <Typography variant="subtitle1" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    InputProps={{
                      startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    InputProps={{
                      startAdornment: <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Tell people about yourself or your business"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Social Links */}
              <Typography variant="subtitle1" gutterBottom>
                Social Media
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    value={socialLinks.linkedin}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username"
                    InputProps={{
                      startAdornment: <LinkedIn sx={{ mr: 1, color: '#0077b5' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Twitter/X"
                    value={socialLinks.twitter}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, twitter: e.target.value })
                    }
                    placeholder="https://twitter.com/username"
                    InputProps={{
                      startAdornment: <Twitter sx={{ mr: 1, color: '#1da1f2' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    value={socialLinks.facebook}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, facebook: e.target.value })
                    }
                    placeholder="https://facebook.com/username"
                    InputProps={{
                      startAdornment: <Facebook sx={{ mr: 1, color: '#1877f2' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={socialLinks.instagram}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, instagram: e.target.value })
                    }
                    placeholder="https://instagram.com/username"
                    InputProps={{
                      startAdornment: <Instagram sx={{ mr: 1, color: '#e4405f' }} />,
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Custom Fields */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">Custom Fields</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => setCustomFieldDialog(true)}
                  >
                    Add Field
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {customFields.map((field) => (
                    <Chip
                      key={field.id}
                      label={`${field.label}: ${field.value}`}
                      onDelete={() => handleDeleteCustomField(field.id)}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

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

              {/* Actions */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={downloadEnabled}
                        onChange={(e) => setDownloadEnabled(e.target.checked)}
                      />
                    }
                    label="Allow .vcf download"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                      />
                    }
                    label="Published"
                  />
                </Box>
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
                    disabled={!firstName || !lastName}
                  >
                    Save vCard
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
                  overflow: 'hidden',
                  minHeight: 500,
                }}
              >
                {/* Cover Photo */}
                {coverPhoto && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 120,
                      backgroundImage: `url(${coverPhoto})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}

                {/* Profile Section */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    src={profilePhoto}
                    sx={{
                      width: 100,
                      height: 100,
                      margin: '0 auto',
                      mb: 2,
                      border: `4px solid ${theme.backgroundColor}`,
                      mt: coverPhoto ? -7 : 0,
                    }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {firstName || 'First'} {lastName || 'Last'}
                  </Typography>
                  {jobTitle && (
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {jobTitle}
                      {company && ` at ${company}`}
                    </Typography>
                  )}
                  {bio && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      {bio}
                    </Typography>
                  )}

                  {/* Save Contact Button */}
                  {downloadEnabled && (
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Download />}
                      sx={{
                        mt: 2,
                        mb: 2,
                        backgroundColor: theme.primaryColor,
                        '&:hover': {
                          backgroundColor: theme.primaryColor,
                          opacity: 0.9,
                        },
                      }}
                      onClick={generateVCF}
                    >
                      Save Contact
                    </Button>
                  )}

                  {/* Contact Info */}
                  <Box sx={{ textAlign: 'left', mt: 3 }}>
                    {email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{email}</Typography>
                      </Box>
                    )}
                    {phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{phone}</Typography>
                      </Box>
                    )}
                    {website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{website}</Typography>
                      </Box>
                    )}
                    {address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{address}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Social Links */}
                  {(socialLinks.linkedin ||
                    socialLinks.twitter ||
                    socialLinks.facebook ||
                    socialLinks.instagram) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
                      {socialLinks.linkedin && (
                        <IconButton size="small" sx={{ color: '#0077b5' }}>
                          <LinkedIn />
                        </IconButton>
                      )}
                      {socialLinks.twitter && (
                        <IconButton size="small" sx={{ color: '#1da1f2' }}>
                          <Twitter />
                        </IconButton>
                      )}
                      {socialLinks.facebook && (
                        <IconButton size="small" sx={{ color: '#1877f2' }}>
                          <Facebook />
                        </IconButton>
                      )}
                      {socialLinks.instagram && (
                        <IconButton size="small" sx={{ color: '#e4405f' }}>
                          <Instagram />
                        </IconButton>
                      )}
                    </Box>
                  )}

                  {/* Custom Fields */}
                  {customFields.length > 0 && (
                    <Box sx={{ mt: 3, textAlign: 'left' }}>
                      <Divider sx={{ mb: 2 }} />
                      {customFields.map((field) => (
                        <Box key={field.id} sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {field.label}
                          </Typography>
                          <Typography variant="body2">{field.value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Custom Field Dialog */}
      <Dialog
        open={customFieldDialog}
        onClose={() => setCustomFieldDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Custom Field</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Field Label"
            value={customFieldLabel}
            onChange={(e) => setCustomFieldLabel(e.target.value)}
            placeholder="e.g., Fax, Department, etc."
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Field Value"
            value={customFieldValue}
            onChange={(e) => setCustomFieldValue(e.target.value)}
            placeholder="Enter value"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomFieldDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddCustomField}
            variant="contained"
            disabled={!customFieldLabel || !customFieldValue}
          >
            Add Field
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
