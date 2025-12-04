import { Box, Card, CardContent, Typography, Chip, Avatar } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

interface CaseStudyProps {
  company: string;
  industry: string;
  logo?: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
}

export default function CaseStudy({
  company,
  industry,
  logo,
  challenge,
  solution,
  results,
  quote
}: CaseStudyProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {logo ? (
            <Avatar
              src={logo}
              alt={company}
              sx={{ width: 60, height: 60 }}
              variant="rounded"
            />
          ) : (
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                fontSize: '1.5rem'
              }}
              variant="rounded"
            >
              {company.charAt(0)}
            </Avatar>
          )}
          <Box>
            <Typography variant="h5" component="h3" fontWeight="bold">
              {company}
            </Typography>
            <Chip label={industry} size="small" sx={{ mt: 0.5 }} />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="overline"
            color="primary"
            fontWeight="bold"
            sx={{ display: 'block', mb: 1 }}
          >
            The Challenge
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {challenge}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="overline"
            color="primary"
            fontWeight="bold"
            sx={{ display: 'block', mb: 1 }}
          >
            The Solution
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {solution}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: 'background.default',
            borderRadius: 2,
            p: 3,
            mb: quote ? 3 : 0
          }}
        >
          <Typography
            variant="overline"
            color="primary"
            fontWeight="bold"
            sx={{ display: 'block', mb: 2 }}
          >
            The Results
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3
            }}
          >
            {results.map((result, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    mb: 1
                  }}
                >
                  <TrendingUp color="success" />
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {result.value}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {result.metric}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {quote && (
          <Box
            sx={{
              borderLeft: 3,
              borderColor: 'primary.main',
              pl: 3,
              py: 2
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontStyle: 'italic', mb: 2, fontSize: '1.1rem' }}
            >
              &quot;{quote.text}&quot;
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              {quote.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {quote.role}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
