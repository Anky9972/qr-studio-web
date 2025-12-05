'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Switch,
  FormControlLabel,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  DragIndicator,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  GitHub,
  Email,
  Phone,
  Upload,
  Visibility,
} from '@mui/icons-material';

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
  theme: {
    backgroundColor: string;
    buttonColor: string;
    buttonTextColor: string;
    fontFamily: string;
  };
  published: boolean;
}

interface LinkInBioBuilderProps {
  data?: LinkInBioData;
  onSave: (data: LinkInBioData) => Promise<void>;
  onPreview?: () => void;
}

const defaultTheme = {
  backgroundColor: '#ffffff',
  buttonColor: '#6366f1',
  buttonTextColor: '#ffffff',
  fontFamily: 'Inter, sans-serif',
};

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', icon: <Facebook /> },
  { value: 'twitter', label: 'Twitter/X', icon: <Twitter /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <LinkedIn /> },
  { value: 'youtube', label: 'YouTube', icon: <YouTube /> },
  { value: 'github', label: 'GitHub', icon: <GitHub /> },
  { value: 'email', label: 'Email', icon: <Email /> },
  { value: 'phone', label: 'Phone', icon: <Phone /> },
];

export default function LinkInBioBuilder({
  data,
  onSave,
  onPreview,
}: LinkInBioBuilderProps) {
  const [title, setTitle] = useState(data?.title || '');
  const [description, setDescription] = useState(data?.description || '');
  const [profileImage, setProfileImage] = useState(data?.profileImage || '');
  const [links, setLinks] = useState<BioLink[]>(data?.links || []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    data?.socialLinks || []
  );
  const [theme, setTheme] = useState(data?.theme || defaultTheme);
  const [published, setPublished] = useState(data?.published || false);

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

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

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleToggleLinkVisibility = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, visible: !link.visible } : link
      )
    );
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
      // In production, upload to storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Panel - Editor */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Link in Bio Builder
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                Create a mobile-optimized landing page with multiple links, perfect
                for social media bios.
              </Alert>

              {/* Profile Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Profile Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    src={profileImage}
                    sx={{ width: 80, height: 80 }}
                  />
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
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your Name or Brand"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short bio or tagline"
                  multiline
                  rows={2}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Links Section */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">Links</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={handleAddLink}
                  >
                    Add Link
                  </Button>
                </Box>

                <List>
                  {links.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No links yet"
                        secondary="Add your first link to get started"
                      />
                    </ListItem>
                  ) : (
                    links.map((link) => (
                      <ListItem key={link.id} divider>
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <DragIndicator />
                        </IconButton>
                        <ListItemText
                          primary={link.title}
                          secondary={link.url}
                          sx={{ opacity: link.visible ? 1 : 0.5 }}
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={link.visible}
                            onChange={() => handleToggleLinkVisibility(link.id)}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleEditLink(link)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteLink(link.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Social Links */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">Social Links</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => setSocialDialogOpen(true)}
                  >
                    Add Social
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {socialLinks.map((link) => (
                    <Chip
                      key={link.platform}
                      label={link.platform}
                      onDelete={() => handleDeleteSocialLink(link.platform)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Theme Customization */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Theme
                </Typography>
                <Grid container spacing={2}>
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
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Button Color"
                      value={theme.buttonColor}
                      onChange={(e) =>
                        setTheme({ ...theme, buttonColor: e.target.value })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                    />
                  }
                  label="Published"
                />
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
                  onClick={handleSaveAll}
                  disabled={!title}
                >
                  Save Link in Bio
                </Button>
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
                  p: 3,
                  minHeight: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {profileImage && (
                  <Avatar
                    src={profileImage}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                )}
                <Typography variant="h5" gutterBottom align="center">
                  {title || 'Your Name'}
                </Typography>
                {description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 3 }}
                  >
                    {description}
                  </Typography>
                )}

                <Box sx={{ width: '100%', maxWidth: 400 }}>
                  {links
                    .filter((link) => link.visible)
                    .map((link) => (
                      <Button
                        key={link.id}
                        fullWidth
                        variant="contained"
                        sx={{
                          mb: 1.5,
                          backgroundColor: theme.buttonColor,
                          color: theme.buttonTextColor,
                          '&:hover': {
                            backgroundColor: theme.buttonColor,
                            opacity: 0.9,
                          },
                        }}
                      >
                        {link.title}
                      </Button>
                    ))}
                </Box>

                {socialLinks.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    {socialLinks.map((link) => (
                      <IconButton
                        key={link.platform}
                        size="small"
                        sx={{ color: theme.buttonColor }}
                      >
                        {socialPlatforms.find((p) => p.value === link.platform)
                          ?.icon || <LinkIcon />}
                      </IconButton>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Link Dialog */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingLink ? 'Edit Link' : 'Add New Link'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Link Title"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            placeholder="e.g., My Website"
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveLink}
            variant="contained"
            disabled={!linkTitle || !linkUrl}
          >
            {editingLink ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Social Link Dialog */}
      <Dialog
        open={socialDialogOpen}
        onClose={() => setSocialDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Social Link</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Platform"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          >
            {socialPlatforms.map((platform) => (
              <MenuItem key={platform.value} value={platform.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {platform.icon}
                  {platform.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="URL or Username"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            placeholder="https://facebook.com/username or @username"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSocialDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddSocialLink}
            variant="contained"
            disabled={!selectedPlatform || !socialUrl}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
