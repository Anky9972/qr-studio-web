import { Box, Card, CardContent, Typography, Avatar, Rating } from '@mui/material';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
  text: string;
  industry?: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  avatar,
  rating,
  text,
  industry
}: TestimonialCardProps) {
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
          borderColor: 'primary.light',
          boxShadow: 2
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {avatar ? (
            <Avatar src={avatar} alt={name} sx={{ width: 56, height: 56 }} />
          ) : (
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              {name.charAt(0)}
            </Avatar>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role} at {company}
            </Typography>
            {industry && (
              <Typography variant="caption" color="text.secondary">
                {industry}
              </Typography>
            )}
          </Box>
        </Box>

        <Rating value={rating} readOnly size="small" sx={{ mb: 2 }} />

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontStyle: 'italic',
            lineHeight: 1.7,
            '&::before': { content: '"\u201C"' },
            '&::after': { content: '"\u201D"' }
          }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}
