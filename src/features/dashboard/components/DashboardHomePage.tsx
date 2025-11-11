'use client';
import { Box, Grid, styled, Typography } from '@mui/material';

const DashboardWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2)
  }
}));

const DashboardHome = () => {
  return (
    <DashboardWrapper>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Your Meta Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your key insights and quick actions.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}></Grid>
        <Grid item xs={12} md={6}></Grid>
      </Grid>
    </DashboardWrapper>
  );
};

export default DashboardHome;
