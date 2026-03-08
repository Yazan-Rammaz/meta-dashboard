'use client';

import type { Toast } from '@/contexts/toastContext';
import { useToast } from '@/contexts/toastContext';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, IconButton, Stack } from '@mui/material';

const MAX_TOASTS = 5;

const severityMap: Record<Toast['type'], 'success' | 'error' | 'info'> = {
    success: 'success',
    error: 'error',
    info: 'info',
};

export default function ToastContainer() {
    const { toasts, dismiss } = useToast();
    // Show only the most recent MAX_TOASTS
    const visible = toasts.slice(-MAX_TOASTS);

    return (
        <Stack
            spacing={1}
            sx={{
                position: 'fixed',
                top: 24,
                right: 24,
                zIndex: 2000,
                maxWidth: 480,
                width: '100%',
            }}
        >
            {visible.map((toast) => (
                <Alert
                    key={toast.id}
                    severity={severityMap[toast.type]}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => dismiss(toast.id)}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ boxShadow: 3 }}
                >
                    {toast.message}
                </Alert>
            ))}
        </Stack>
    );
}
