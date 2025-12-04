import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { CheckCircle, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

interface SuccessStoryProps {
  title: string;
  company: string;
  industry: string;
  summary: string;
  achievements: string[];
  tags: string[];
  cta?: {
    text: string;
    href: string;
  };
}

export default function SuccessStory({
  title,
  company,
  industry,
  summary,
  achievements,
  tags,
  cta
}: SuccessStoryProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="overline" color="primary" fontWeight="bold">
            {industry}
          </Typography>
          <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            {company}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {summary}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Key Achievements:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none' }}>
            {achievements.map((achievement, index) => (
              <Box
                key={index}
                component="li"
                sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1 }}
              >
                <CheckCircle
                  color="success"
                  sx={{ fontSize: 18, mt: 0.25, flexShrink: 0 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {achievement}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: cta ? 2 : 0 }}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        {cta && (
          <Button
            component={Link}
            href={cta.href}
            variant="text"
            endIcon={<ArrowForward />}
            size="small"
            sx={{ mt: 1 }}
          >
            {cta.text}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
