'use client';
import { Box, styled, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid';
import { useEffect } from 'react';

const DashboardWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    },
}));
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api/v1';

const DashboardHome = () => {
    useEffect(() => {
        console.log(`baseUrl: ${baseUrl}`);
    }, [baseUrl]);

    return (
        <DashboardWrapper>
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Your Meta Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Overview of your key insights and quick actions.
            </Typography>

            <Grid2 container spacing={4}>
                <Grid2 size={{ xs: 12, md: 6 }}></Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}></Grid2>
            </Grid2>
        </DashboardWrapper>
    );
};

export default DashboardHome;
