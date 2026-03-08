'use client';

import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error boundary:', error);
    }, [error]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 3,
                padding: 3,
            }}
        >
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
            <Typography variant="h4" color="error" textAlign="center">
                Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={600}>
                {error.message || 'An unexpected error occurred. Please try again.'}
            </Typography>
            <Button variant="contained" color="primary" onClick={reset} size="large">
                Try again
            </Button>
        </Box>
    );
}
