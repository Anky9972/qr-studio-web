import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface IndustryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  useCases: string[];
  benefits: string[];
  cta?: {
    text: string;
    href: string;
  };
}

export default function IndustryCard({
  title,
  description,
  icon,
  useCases,
  benefits,
  cta
}: IndustryCardProps) {
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
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h5" component="h3" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Common Use Cases:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {useCases.map((useCase, index) => (
              <Chip key={index} label={useCase} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Key Benefits:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {benefits.map((benefit, index) => (
              <Typography
                key={index}
                component="li"
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                {benefit}
              </Typography>
            ))}
          </Box>
        </Box>

        {cta && (
          <Button
            component={Link}
            href={cta.href}
            variant="outlined"
            endIcon={<ArrowForward />}
            fullWidth
          >
            {cta.text}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
