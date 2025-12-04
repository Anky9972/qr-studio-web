import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface TemplatePreviewProps {
  open: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail?: string;
    features?: string[];
    isPro?: boolean;
  } | null;
  isAuthenticated?: boolean;
}

export default function TemplatePreview({
  open,
  onClose,
  template,
  isAuthenticated = false
}: TemplatePreviewProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {template.name}
          </Typography>
          {template.isPro && <Chip label="PRO" size="small" color="primary" />}
        </Box>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1 }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent>
        <Chip label={template.category} size="small" sx={{ mb: 2 }} />

        {/* Preview Image */}
        <Box
          sx={{
            width: '100%',
            height: 400,
            bgcolor: 'background.default',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box
              sx={{
                width: 200,
                height: 200,
                bgcolor: 'primary.main',
                opacity: 0.1,
                borderRadius: 4
              }}
            />
          )}
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          {template.description}
        </Typography>

        {template.features && template.features.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Features:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {template.features.map((feature, index) => (
                <Typography key={index} component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {feature}
                </Typography>
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          href={isAuthenticated ? `/dashboard?template=${template.id}` : '/signup'}
        >
          {isAuthenticated ? 'Use Template' : 'Sign Up to Use'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
