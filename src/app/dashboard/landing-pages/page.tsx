'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Tooltip,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Visibility,
    VisibilityOff,
    MoreVert,
    Launch,
    ContentCopy,
    QrCode,
} from '@mui/icons-material';

interface LandingPage {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    published: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
    _count: {
        FormSubmissions: number;
    };
}

export default function LandingPagesPage() {
    const [pages, setPages] = useState<LandingPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [formSlug, setFormSlug] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);

    const fetchPages = useCallback(async () => {
        try {
            const response = await fetch('/api/landing-pages');
            if (response.ok) {
                const data = await response.json();
                setPages(data.landingPages || []);
            }
        } catch (err) {
            console.error('Failed to fetch landing pages:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const handleCreate = async () => {
        setError(null);

        if (!formTitle || !formSlug) {
            setError('Title and slug are required');
            return;
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(formSlug)) {
            setError('Slug can only contain lowercase letters, numbers, and hyphens');
            return;
        }

        try {
            const response = await fetch('/api/landing-pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formTitle,
                    slug: formSlug,
                    description: formDescription,
                    content: { sections: [] },
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create page');
            }

            setSuccess('Landing page created!');
            setOpenDialog(false);
            setFormTitle('');
            setFormSlug('');
            setFormDescription('');
            fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this landing page?')) return;

        try {
            const response = await fetch(`/api/landing-pages/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');

            setSuccess('Landing page deleted!');
            fetchPages();
        } catch (err) {
            setError('Failed to delete landing page');
        }
        setAnchorEl(null);
    };

    const handleTogglePublish = async (page: LandingPage) => {
        try {
            const response = await fetch(`/api/landing-pages/${page.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !page.published }),
            });

            if (!response.ok) throw new Error('Failed to update');

            setSuccess(page.published ? 'Page unpublished' : 'Page published!');
            fetchPages();
        } catch (err) {
            setError('Failed to update page');
        }
        setAnchorEl(null);
    };

    const copyUrl = (slug: string) => {
        const url = `${window.location.origin}/lp/${slug}`;
        navigator.clipboard.writeText(url);
        setSuccess('URL copied!');
        setTimeout(() => setSuccess(null), 2000);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 50);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Landing Pages
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Create custom landing pages for your QR codes
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    fullWidth
                    sx={{ maxWidth: { xs: '100%', sm: 'auto' } }}
                >
                    Create Page
                </Button>
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

            {pages.length === 0 ? (
                <Card sx={{ textAlign: 'center', py: 6 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            No landing pages yet
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Create your first landing page to get started
                        </Typography>
                        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                            Create Your First Page
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {pages.map((page) => (
                        <Grid item key={page.id} xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {page.title}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setAnchorEl(e.currentTarget);
                                                setSelectedPage(page);
                                            }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                        {page.description || 'No description'}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                        <Chip
                                            icon={page.published ? <Visibility /> : <VisibilityOff />}
                                            label={page.published ? 'Published' : 'Draft'}
                                            size="small"
                                            color={page.published ? 'success' : 'default'}
                                        />
                                        <Chip label={`${page.views} views`} size="small" variant="outlined" />
                                        <Chip label={`${page._count.FormSubmissions} submissions`} size="small" variant="outlined" />
                                    </Box>

                                    <Typography variant="caption" color="text.secondary">
                                        /lp/{page.slug}
                                    </Typography>
                                </CardContent>

                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        size="small"
                                        startIcon={<Edit />}
                                        component={Link}
                                        href={`/dashboard/landing-pages/${page.id}/edit`}
                                    >
                                        Edit
                                    </Button>
                                    <Tooltip title="Copy URL">
                                        <IconButton size="small" onClick={() => copyUrl(page.slug)}>
                                            <ContentCopy fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {page.published && (
                                        <Tooltip title="View page">
                                            <IconButton
                                                size="small"
                                                component="a"
                                                href={`/lp/${page.slug}`}
                                                target="_blank"
                                            >
                                                <Launch fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem
                    onClick={() => {
                        if (selectedPage) handleTogglePublish(selectedPage);
                    }}
                >
                    {selectedPage?.published ? 'Unpublish' : 'Publish'}
                </MenuItem>
                <MenuItem
                    component={Link}
                    href={selectedPage ? `/dashboard/landing-pages/${selectedPage.id}/edit` : '#'}
                    onClick={() => setAnchorEl(null)}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (selectedPage) handleDelete(selectedPage.id);
                    }}
                    sx={{ color: 'error.main' }}
                >
                    Delete
                </MenuItem>
            </Menu>

            {/* Create Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Landing Page</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Page Title"
                        fullWidth
                        value={formTitle}
                        onChange={(e) => {
                            setFormTitle(e.target.value);
                            if (!formSlug) {
                                setFormSlug(generateSlug(e.target.value));
                            }
                        }}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="URL Slug"
                        fullWidth
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        helperText={`Your page will be at: /lp/${formSlug || 'your-slug'}`}
                    />
                    <TextField
                        margin="dense"
                        label="Description (optional)"
                        fullWidth
                        multiline
                        rows={2}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
