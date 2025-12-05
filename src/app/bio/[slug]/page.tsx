import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Box, Container, Avatar, Typography, Button, IconButton, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const linkInBio = await prisma.linkInBio.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!linkInBio) {
    return { title: 'Not Found' };
  }

  return {
    title: linkInBio.title,
    description: linkInBio.description || `${linkInBio.title}'s links`,
  };
}

export default async function LinkInBioPage({ params }: Props) {
  const linkInBio = await prisma.linkInBio.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!linkInBio) {
    notFound();
  }

  const theme = linkInBio.theme as any || {
    backgroundColor: '#ffffff',
    buttonColor: '#1976D2',
    buttonTextColor: '#ffffff',
    fontFamily: 'Inter',
  };

  const links = linkInBio.links as any[] || [];
  const socialLinks = linkInBio.socialLinks as Record<string, string> || {};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {linkInBio.profileImage && (
            <Avatar
              src={linkInBio.profileImage}
              alt={linkInBio.title}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 3, border: '4px solid white', boxShadow: 3 }}
            />
          )}
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {linkInBio.title}
          </Typography>
          {linkInBio.description && (
            <Typography variant="body1" color="text.secondary">
              {linkInBio.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          {links.filter((link: any) => link.visible).map((link: any, index: number) => (
            <Button
              key={index}
              component="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              sx={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
                py: 2,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: theme.buttonColor,
                  opacity: 0.9,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              {link.title}
            </Button>
          ))}
        </Box>

        {Object.keys(socialLinks).length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {Object.entries(socialLinks).map(([platform, url]) => (
              <IconButton
                key={platform}
                component="a"
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                {/* Add social icons based on platform */}
                <Typography>{platform}</Typography>
              </IconButton>
            ))}
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <MuiLink href="/" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
            Powered by QR Studio
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
}
