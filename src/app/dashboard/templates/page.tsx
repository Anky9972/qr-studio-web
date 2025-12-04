'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  QrCode2,
  Add,
  Business,
  Wifi,
  Restaurant,
  Event,
  Shop,
  Share,
  Email,
  Phone,
  LocationOn,
  Sms,
  Apps as AppsIcon,
  LocalOffer,
  Payment,
  VideoLibrary,
  Description,
  CalendarMonth,
  Feedback,
  Star,
  LinkedIn,
  Instagram,
} from '@mui/icons-material';

interface Template {
  id: string;
  name: string;
  category: string;
  qrType: string;
  thumbnail: string;
  design: any;
  isPredefined: boolean;
}

interface GroupedTemplates {
  category: string;
  templates: Template[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Business: <Business />,
  Connectivity: <Wifi />,
  Restaurant: <Restaurant />,
  Events: <Event />,
  'E-commerce': <Shop />,
  Social: <Share />,
  Communication: <Sms />,
  Mobile: <AppsIcon />,
  Marketing: <LocalOffer />,
  Finance: <Payment />,
  Documents: <Description />,
  Maps: <LocationOn />,
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [grouped, setGrouped] = useState<GroupedTemplates[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
        setGrouped(data.grouped);
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template: Template) => {
    // Store template in session storage and navigate to generate page
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    router.push('/dashboard/generate');
  };

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              QR Code Templates
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start with pre-designed templates for common use cases
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => router.push('/dashboard/generate')}
          >
            Create from Scratch
          </Button>
        </Box>
      </Box>

      {/* Category Filter */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Templates" value="all" />
          {categories.map((category) => (
            <Tab
              key={category}
              label={category}
              value={category}
              icon={categoryIcons[category] as any}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Templates Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            sx={{
              flex: '1 1 calc(25% - 18px)',
              minWidth: 250,
              maxWidth: 300,
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s',
              },
            }}
          >
            <Box
              sx={{
                height: 200,
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* QR Code Preview Placeholder */}
              <QrCode2 sx={{ fontSize: 120, color: template.design.foreground, opacity: 0.8 }} />
              {!template.isPredefined && (
                <Chip
                  label="Custom"
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />
              )}
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {template.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={template.category} size="small" />
                <Chip label={template.qrType.toUpperCase()} size="small" variant="outlined" />
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleUseTemplate(template)}
              >
                Use Template
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {filteredTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <QrCode2 sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No templates found
          </Typography>
        </Box>
      )}
    </Box>
  );
}
