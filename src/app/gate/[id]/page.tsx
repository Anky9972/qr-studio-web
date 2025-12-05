'use client';

import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default function LeadGatePage({ params }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // In a real implementation, you'd fetch the lead gate data from the API
  // For now, this is a placeholder structure
  const leadGate = {
    title: 'Download Your Free Guide',
    description: 'Enter your details to access exclusive content',
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'company', label: 'Company', type: 'text', required: false },
    ],
    redirectUrl: 'https://example.com/download',
    submitText: 'Get Access',
    theme: {
      primaryColor: '#1976D2',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit form data to API
      const response = await fetch(`/api/lead-gate/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = leadGate.redirectUrl;
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4 }}>
            <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
              ✓ Success!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Thank you for your submission. Redirecting you now...
            </Typography>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box
            sx={{
              backgroundColor: leadGate.theme.primaryColor,
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {leadGate.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {leadGate.description}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {leadGate.fields.map((field: any) => (
                  <TextField
                    key={field.id}
                    label={field.label}
                    type={field.type}
                    required={field.required}
                    fullWidth
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                ))}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    backgroundColor: leadGate.theme.primaryColor,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: leadGate.theme.primaryColor,
                      opacity: 0.9,
                    },
                  }}
                >
                  {loading ? 'Submitting...' : leadGate.submitText}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <MuiLink href="/" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
            Powered by QR Studio
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
}
