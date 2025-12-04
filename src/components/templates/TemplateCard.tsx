import { Card, CardContent, CardMedia, Typography, Chip, Button, Box } from '@mui/material';
import { Star, Visibility } from '@mui/icons-material';
import Link from 'next/link';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  rating?: number;
  usageCount?: number;
  isPro?: boolean;
  isAuthenticated?: boolean;
}

export default function TemplateCard({
  id,
  name,
  description,
  category,
  thumbnail,
  rating = 0,
  usageCount = 0,
  isPro = false,
  isAuthenticated = false
}: TemplateCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="div"
          sx={{
            height: 200,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                opacity: 0.1,
                borderRadius: 2
              }}
            />
          )}
        </CardMedia>
        {isPro && (
          <Chip
            label="PRO"
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Box sx={{ mb: 1.5 }}>
          <Chip label={category} size="small" variant="outlined" />
        </Box>

        <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {description}
        </Typography>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {rating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: 18, color: 'warning.main' }} />
              <Typography variant="body2" fontWeight="bold">
                {rating.toFixed(1)}
              </Typography>
            </Box>
          )}
          {usageCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Visibility sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {usageCount >= 1000 ? `${(usageCount / 1000).toFixed(1)}k` : usageCount}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action Button */}
        <Button
          component={Link}
          href={isAuthenticated ? `/dashboard?template=${id}` : '/signup'}
          variant="contained"
          fullWidth
        >
          {isAuthenticated ? 'Use Template' : 'Sign Up to Use'}
        </Button>
      </CardContent>
    </Card>
  );
}
