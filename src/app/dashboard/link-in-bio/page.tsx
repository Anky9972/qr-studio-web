'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import { useState } from 'react';
import LinkInBioBuilder from '@/components/qr/LinkInBioBuilder';
import AddIcon from '@mui/icons-material/Add';

export default function LinkInBioPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Link in Bio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create beautiful social landing pages for your QR codes
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setShowBuilder(true)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
              boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Create New
          </Button>
        </Box>

        {showBuilder ? (
          <LinkInBioBuilder 
            onSave={async (data) => {
              // Save to API
              await fetch('/api/link-in-bio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              setShowBuilder(false);
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 3,
              p: 4,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Link in Bio pages yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first social landing page to get started
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowBuilder(true)}
            >
              Create Your First Link in Bio
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
