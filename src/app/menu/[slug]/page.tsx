import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Card, CardMedia, CardContent, Grid, Tabs, Tab, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const menu = await prisma.digitalMenu.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!menu) {
    return { title: 'Not Found' };
  }

  return {
    title: menu.title,
    description: menu.description || `Digital ${menu.type} - ${menu.title}`,
  };
}

export default async function DigitalMenuPage({ params }: Props) {
  const menu = await prisma.digitalMenu.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!menu) {
    notFound();
  }

  const theme = menu.theme as any || {
    primaryColor: '#1976D2',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
  };

  const settings = menu.settings as any || {
    currency: '$',
    showPrices: true,
    showImages: true,
  };

  const categories = menu.categories as any[] || [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: theme.primaryColor,
          color: 'white',
          py: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {menu.coverImage && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${menu.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
            }}
          />
        )}
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center' }}>
            {menu.logo && (
              <Box
                component="img"
                src={menu.logo}
                alt={menu.title}
                sx={{ height: 80, mb: 2 }}
              />
            )}
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {menu.title}
            </Typography>
            {menu.description && (
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {menu.description}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {categories.map((category: any, catIndex: number) => (
          <Box key={catIndex} sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              {category.name}
            </Typography>
            {category.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {category.description}
              </Typography>
            )}

            <Grid container spacing={3}>
              {category.items?.map((item: any, itemIndex: number) => (
                <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    {settings.showImages && item.image && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {item.name}
                        </Typography>
                        {settings.showPrices && item.price && (
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ color: theme.primaryColor }}
                          >
                            {settings.currency}{item.price}
                          </Typography>
                        )}
                      </Box>
                      {item.description && (
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>

      <Box sx={{ textAlign: 'center', pb: 4 }}>
        <MuiLink href="/" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
          Powered by QR Studio
        </MuiLink>
      </Box>
    </Box>
  );
}
