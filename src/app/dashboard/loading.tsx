import { Box, CircularProgress, Typography } from '@mui/material';

export default function DashboardLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="body1" color="text.secondary">
        Loading dashboard...
      </Typography>
    </Box>
  );
}
