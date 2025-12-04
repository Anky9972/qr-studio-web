import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome,
  Gradient,
  Pattern,
  Animation,
  Star,
} from '@mui/icons-material';
import { QRTemplate, QR_TEMPLATES, getTemplatesByCategory } from '@/lib/qr-templates';

interface TemplateGallerySelectorProps {
  onSelectTemplate: (template: QRTemplate) => void;
  selectedTemplateId?: string;
  showPremium?: boolean;
}

export const TemplateGallerySelector: React.FC<TemplateGallerySelectorProps> = ({
  onSelectTemplate,
  selectedTemplateId,
  showPremium = true,
}) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const categories = [
    { label: 'All', value: 'all', icon: <AutoAwesome /> },
    { label: 'Minimal', value: 'minimal', icon: <Pattern /> },
    { label: 'Gradient', value: 'gradient', icon: <Gradient /> },
    { label: 'Pattern', value: 'pattern', icon: <Pattern /> },
    { label: 'Animated', value: 'animated', icon: <Animation /> },
    { label: 'Premium', value: 'premium', icon: <Star /> },
  ];

  const getFilteredTemplates = () => {
    const category = categories[selectedCategory].value;
    if (category === 'all') {
      return showPremium ? QR_TEMPLATES : QR_TEMPLATES.filter(t => !t.premium);
    }
    const templates = getTemplatesByCategory(category as any);
    return showPremium ? templates : templates.filter(t => !t.premium);
  };

  const templates = getFilteredTemplates();

  const getGradientPreview = (template: QRTemplate) => {
    if (template.gradient) {
      const stops = template.gradient.colorStops
        .map((stop) => `${stop.color} ${stop.offset * 100}%`)
        .join(', ');
      
      if (template.gradient.type === 'linear') {
        return `linear-gradient(${template.gradient.rotation || 0}deg, ${stops})`;
      } else {
        return `radial-gradient(circle, ${stops})`;
      }
    }
    return template.foreground;
  };

  return (
    <Box>
      <Tabs
        value={selectedCategory}
        onChange={(_, newValue) => setSelectedCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {categories.map((cat, index) => (
          <Tab
            key={cat.value}
            label={cat.label}
            icon={cat.icon}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        ))}
      </Tabs>

      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={6} sm={4} md={3} key={template.id}>
            <Card
              onClick={() => onSelectTemplate(template)}
              sx={{
                cursor: 'pointer',
                border: 2,
                borderColor:
                  selectedTemplateId === template.id
                    ? 'primary.main'
                    : 'transparent',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: 'primary.light',
                },
              }}
            >
              <Box
                sx={{
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: template.background,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Mini QR Preview */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    background: getGradientPreview(template),
                    borderRadius: template.pattern === 'dots' ? '50%' : 
                                 template.pattern === 'rounded' ? '12px' : 
                                 template.pattern === 'extra-rounded' ? '20px' : '4px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gridTemplateRows: 'repeat(8, 1fr)',
                    gap: '2px',
                    p: 1,
                  }}
                >
                  {[...Array(64)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        background: Math.random() > 0.5 ? 'currentColor' : 'transparent',
                        borderRadius: template.pattern === 'dots' ? '50%' : 
                                     template.pattern.includes('rounded') ? '2px' : 0,
                        opacity: 0.3,
                      }}
                    />
                  ))}
                </Box>

                {/* Badges */}
                {template.animated && (
                  <Chip
                    label="Animated"
                    size="small"
                    color="primary"
                    icon={<Animation fontSize="small" />}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontSize: '10px',
                    }}
                  />
                )}
                {template.premium && (
                  <Chip
                    label="Premium"
                    size="small"
                    color="warning"
                    icon={<Star fontSize="small" />}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      fontSize: '10px',
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {template.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {template.pattern}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {templates.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6">No templates found</Typography>
          <Typography variant="body2">
            Try selecting a different category
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TemplateGallerySelector;
