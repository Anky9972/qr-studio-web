'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Paper,
    Grid,
    IconButton,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Save,
    ArrowBack,
    Add,
    Delete,
    DragIndicator,
    Visibility,
    Code,
} from '@mui/icons-material';

interface Section {
    id: string;
    type: 'hero' | 'text' | 'image' | 'button' | 'form' | 'spacer';
    content: Record<string, unknown>;
}

interface LandingPage {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    content: { sections: Section[] };
    theme: Record<string, string> | null;
    published: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    customCss: string | null;
}

const SECTION_TYPES = [
    { value: 'hero', label: 'Hero Section', description: 'Large heading with subtitle' },
    { value: 'text', label: 'Text Block', description: 'Paragraph content' },
    { value: 'image', label: 'Image', description: 'Image with optional caption' },
    { value: 'button', label: 'Button', description: 'Call-to-action button' },
    { value: 'form', label: 'Contact Form', description: 'Simple contact form' },
    { value: 'spacer', label: 'Spacer', description: 'Vertical spacing' },
];

export default function EditLandingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [page, setPage] = useState<LandingPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [addSectionDialog, setAddSectionDialog] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [published, setPublished] = useState(false);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [customCss, setCustomCss] = useState('');
    const [sections, setSections] = useState<Section[]>([]);
    const [primaryColor, setPrimaryColor] = useState('#2563eb');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    const fetchPage = useCallback(async () => {
        try {
            const response = await fetch(`/api/landing-pages/${id}`);
            if (response.ok) {
                const data = await response.json();
                const p = data.landingPage;
                setPage(p);
                setTitle(p.title);
                setDescription(p.description || '');
                setSlug(p.slug);
                setPublished(p.published);
                setSeoTitle(p.seoTitle || '');
                setSeoDescription(p.seoDescription || '');
                setCustomCss(p.customCss || '');
                setSections(p.content?.sections || []);
                if (p.theme) {
                    setPrimaryColor(p.theme.primaryColor || '#2563eb');
                    setBackgroundColor(p.theme.backgroundColor || '#ffffff');
                }
            } else {
                setError('Failed to load landing page');
            }
        } catch (err) {
            setError('Failed to load landing page');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPage();
    }, [fetchPage]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/landing-pages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    slug,
                    published,
                    seoTitle,
                    seoDescription,
                    customCss,
                    content: { sections },
                    theme: { primaryColor, backgroundColor },
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save');
            }

            setSuccess('Changes saved!');
            setTimeout(() => setSuccess(null), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const addSection = (type: Section['type']) => {
        const newSection: Section = {
            id: `section-${Date.now()}`,
            type,
            content: getDefaultContent(type),
        };
        setSections([...sections, newSection]);
        setAddSectionDialog(false);
    };

    const getDefaultContent = (type: Section['type']): Record<string, unknown> => {
        switch (type) {
            case 'hero':
                return { heading: 'Welcome', subheading: 'Your subtitle here', buttonText: 'Get Started', buttonUrl: '#' };
            case 'text':
                return { text: 'Your content here...' };
            case 'image':
                return { url: '', alt: '', caption: '' };
            case 'button':
                return { text: 'Click Me', url: '#', style: 'primary' };
            case 'form':
                return { fields: ['name', 'email', 'message'], submitText: 'Submit' };
            case 'spacer':
                return { height: 40 };
            default:
                return {};
        }
    };

    const updateSection = (index: number, content: Record<string, unknown>) => {
        const updated = [...sections];
        updated[index] = { ...updated[index], content };
        setSections(updated);
    };

    const removeSection = (index: number) => {
        const updated = sections.filter((_, i) => i !== index);
        setSections(updated);
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;

        const updated = [...sections];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setSections(updated);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!page) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Landing page not found</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => router.push('/dashboard/landing-pages')}>
                        <ArrowBack />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Edit: {page.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            /lp/{slug}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        component="a"
                        href={`/lp/${slug}`}
                        target="_blank"
                        disabled={!published}
                    >
                        Preview
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        Save
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label="Content" />
                <Tab label="Settings" />
                <Tab label="SEO" />
                <Tab label="Custom CSS" />
            </Tabs>

            {/* Content Tab */}
            {tabValue === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Page Sections</Typography>
                        <Button startIcon={<Add />} onClick={() => setAddSectionDialog(true)}>
                            Add Section
                        </Button>
                    </Box>

                    {sections.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                No sections yet. Add your first section to get started.
                            </Typography>
                            <Button variant="contained" startIcon={<Add />} onClick={() => setAddSectionDialog(true)}>
                                Add Section
                            </Button>
                        </Paper>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {sections.map((section, index) => (
                                <Card key={section.id}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <DragIndicator sx={{ color: 'text.secondary' }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                                    {section.type}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => moveSection(index, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    ↑
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => moveSection(index, 'down')}
                                                    disabled={index === sections.length - 1}
                                                >
                                                    ↓
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => removeSection(index)}>
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        {/* Section editor based on type */}
                                        {section.type === 'hero' && (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <TextField
                                                    label="Heading"
                                                    fullWidth
                                                    value={section.content.heading as string || ''}
                                                    onChange={(e) => updateSection(index, { ...section.content, heading: e.target.value })}
                                                />
                                                <TextField
                                                    label="Subheading"
                                                    fullWidth
                                                    value={section.content.subheading as string || ''}
                                                    onChange={(e) => updateSection(index, { ...section.content, subheading: e.target.value })}
                                                />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Button Text"
                                                            fullWidth
                                                            value={section.content.buttonText as string || ''}
                                                            onChange={(e) => updateSection(index, { ...section.content, buttonText: e.target.value })}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Button URL"
                                                            fullWidth
                                                            value={section.content.buttonUrl as string || ''}
                                                            onChange={(e) => updateSection(index, { ...section.content, buttonUrl: e.target.value })}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}

                                        {section.type === 'text' && (
                                            <TextField
                                                label="Text Content"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={section.content.text as string || ''}
                                                onChange={(e) => updateSection(index, { ...section.content, text: e.target.value })}
                                            />
                                        )}

                                        {section.type === 'image' && (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <TextField
                                                    label="Image URL"
                                                    fullWidth
                                                    value={section.content.url as string || ''}
                                                    onChange={(e) => updateSection(index, { ...section.content, url: e.target.value })}
                                                />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Alt Text"
                                                            fullWidth
                                                            value={section.content.alt as string || ''}
                                                            onChange={(e) => updateSection(index, { ...section.content, alt: e.target.value })}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Caption"
                                                            fullWidth
                                                            value={section.content.caption as string || ''}
                                                            onChange={(e) => updateSection(index, { ...section.content, caption: e.target.value })}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}

                                        {section.type === 'button' && (
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Button Text"
                                                        fullWidth
                                                        value={section.content.text as string || ''}
                                                        onChange={(e) => updateSection(index, { ...section.content, text: e.target.value })}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="URL"
                                                        fullWidth
                                                        value={section.content.url as string || ''}
                                                        onChange={(e) => updateSection(index, { ...section.content, url: e.target.value })}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Style</InputLabel>
                                                        <Select
                                                            value={section.content.style as string || 'primary'}
                                                            label="Style"
                                                            onChange={(e) => updateSection(index, { ...section.content, style: e.target.value })}
                                                        >
                                                            <MenuItem value="primary">Primary</MenuItem>
                                                            <MenuItem value="secondary">Secondary</MenuItem>
                                                            <MenuItem value="outline">Outline</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        )}

                                        {section.type === 'spacer' && (
                                            <TextField
                                                label="Height (px)"
                                                type="number"
                                                value={section.content.height as number || 40}
                                                onChange={(e) => updateSection(index, { ...section.content, height: parseInt(e.target.value) })}
                                                sx={{ width: 150 }}
                                            />
                                        )}

                                        {section.type === 'form' && (
                                            <TextField
                                                label="Submit Button Text"
                                                value={section.content.submitText as string || 'Submit'}
                                                onChange={(e) => updateSection(index, { ...section.content, submitText: e.target.value })}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* Settings Tab */}
            {tabValue === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Page Title"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="URL Slug"
                                fullWidth
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                helperText={`/lp/${slug}`}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={2}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />}
                                label="Published"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Theme
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField
                                label="Primary Color"
                                type="color"
                                fullWidth
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField
                                label="Background Color"
                                type="color"
                                fullWidth
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* SEO Tab */}
            {tabValue === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="SEO Title"
                                fullWidth
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                helperText="Appears in search results and browser tab"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="SEO Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                helperText="Appears in search result snippets"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Custom CSS Tab */}
            {tabValue === 3 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add custom CSS to style your landing page. Use .landing-page as the root selector.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={15}
                        value={customCss}
                        onChange={(e) => setCustomCss(e.target.value)}
                        placeholder={`.landing-page {\n  /* Your custom styles here */\n}`}
                        sx={{ fontFamily: 'monospace' }}
                    />
                </Paper>
            )}

            {/* Add Section Dialog */}
            <Dialog open={addSectionDialog} onClose={() => setAddSectionDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Section</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {SECTION_TYPES.map((type) => (
                            <Grid item key={type.value} xs={6}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                                        border: '2px solid transparent',
                                    }}
                                    onClick={() => addSection(type.value as Section['type'])}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {type.label}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {type.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddSectionDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
