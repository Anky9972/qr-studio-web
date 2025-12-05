import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Box, Container, Avatar, Typography, Button, Card, CardContent, Grid, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';
import DownloadIcon from '@mui/icons-material/Download';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vCard = await prisma.vCardPlus.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!vCard) {
    return { title: 'Not Found' };
  }

  return {
    title: `${vCard.firstName} ${vCard.lastName}`,
    description: vCard.bio || `Digital business card for ${vCard.firstName} ${vCard.lastName}`,
  };
}

export default async function VCardPlusPage({ params }: Props) {
  const vCard = await prisma.vCardPlus.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!vCard) {
    notFound();
  }

  const theme = vCard.theme as any || {
    primaryColor: '#1976D2',
    backgroundColor: '#ffffff',
  };

  const socialLinks = vCard.socialLinks as Record<string, string> || {};
  const customFields = vCard.customFields as Record<string, string> || {};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        {vCard.coverPhoto && (
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${vCard.coverPhoto})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '16px 16px 0 0',
              mb: -8,
            }}
          />
        )}

        <Card sx={{ borderRadius: 4, overflow: 'visible' }}>
          <CardContent sx={{ p: 4, pt: vCard.coverPhoto ? 10 : 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {vCard.profilePhoto && (
                <Avatar
                  src={vCard.profilePhoto}
                  alt={`${vCard.firstName} ${vCard.lastName}`}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid white',
                    boxShadow: 3,
                    mt: vCard.coverPhoto ? -8 : 0,
                  }}
                />
              )}
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {vCard.firstName} {vCard.lastName}
              </Typography>
              {vCard.jobTitle && (
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {vCard.jobTitle}
                </Typography>
              )}
              {vCard.company && (
                <Typography variant="body1" color="text.secondary">
                  {vCard.company}
                </Typography>
              )}
              {vCard.bio && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                  {vCard.bio}
                </Typography>
              )}

              {vCard.downloadEnabled && (
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{
                    mt: 3,
                    backgroundColor: theme.primaryColor,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: theme.primaryColor,
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => {
                    // Generate and download vCard
                    const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${vCard.firstName} ${vCard.lastName}
N:${vCard.lastName};${vCard.firstName};;;
${vCard.company ? `ORG:${vCard.company}` : ''}
${vCard.jobTitle ? `TITLE:${vCard.jobTitle}` : ''}
${vCard.email ? `EMAIL:${vCard.email}` : ''}
${vCard.phone ? `TEL:${vCard.phone}` : ''}
${vCard.website ? `URL:${vCard.website}` : ''}
${vCard.address ? `ADR:;;${vCard.address};;;;` : ''}
END:VCARD`;
                    
                    const blob = new Blob([vcfContent], { type: 'text/vcard' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${vCard.firstName}_${vCard.lastName}.vcf`;
                    a.click();
                  }}
                >
                  Save to Contacts
                </Button>
              )}
            </Box>

            <Grid container spacing={3}>
              {vCard.email && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    <MuiLink href={`mailto:${vCard.email}`} color="inherit">
                      {vCard.email}
                    </MuiLink>
                  </Typography>
                </Grid>
              )}
              {vCard.phone && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    <MuiLink href={`tel:${vCard.phone}`} color="inherit">
                      {vCard.phone}
                    </MuiLink>
                  </Typography>
                </Grid>
              )}
              {vCard.website && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Website
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    <MuiLink href={vCard.website} target="_blank" rel="noopener noreferrer" color="inherit">
                      {vCard.website}
                    </MuiLink>
                  </Typography>
                </Grid>
              )}
              {vCard.address && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {vCard.address}
                  </Typography>
                </Grid>
              )}
              {Object.entries(customFields).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="caption" color="text.secondary">
                    {key}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {Object.keys(socialLinks).length > 0 && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Connect
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <Button
                      key={platform}
                      component="a"
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {platform}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
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
