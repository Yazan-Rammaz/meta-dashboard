'use client';

import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function ClientsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: 2,
            }}
        >
            <Typography variant="h6" color="error">
                {error.message || 'Something went wrong loading clients.'}
            </Typography>
            <Button variant="contained" onClick={reset}>
                Try again
            </Button>
        </Box>
    );
}
