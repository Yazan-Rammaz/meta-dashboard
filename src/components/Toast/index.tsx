'use client';

import type { Toast } from '@/contexts/toastContext';
import { useToast } from '@/contexts/toastContext';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

const MAX_TOASTS = 5;

const toastStyles: Record<Toast['type'], { bg: string; color: string; border: string }> = {
    success: {
        bg: '#404040',
        color: '#ffffff',
        border: '#5d5d5d',
    },
    error: {
        bg: '#8E8E8E',
        color: '#ffffff',
        border: '#A2A0A0',
    },
    info: {
        bg: '#5d5d5d',
        color: '#ffffff',
        border: '#8E8E8E',
    },
};

export default function ToastContainer() {
    const { toasts, dismiss } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Show only the most recent MAX_TOASTS
    const visible = isMounted ? toasts.slice(-MAX_TOASTS) : [];

    if (!isMounted) {
        return null;
    }

    return (
        <Box
            suppressHydrationWarning
            sx={{
                position: 'fixed',
                top: 24,
                right: 24,
                zIndex: 2000,
                maxWidth: 400,
                width: '100%',
                pointerEvents: 'none',
            }}
        >
            {visible.map((toast, index) => {
                const styles = toastStyles[toast.type];
                const isNewest = index === visible.length - 1;
                const offsetFromTop = (visible.length - 1 - index) * 10;

                return (
                    <Box
                        key={toast.id}
                        sx={{
                            position: 'absolute',
                            top: `${offsetFromTop}px`,
                            right: 0,
                            width: '100%',
                            opacity: isNewest ? 1 : 0.9,
                            transform: isNewest ? 'scale(1)' : 'scale(0.98)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            pointerEvents: 'auto',
                            zIndex: index,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: styles.bg,
                                color: styles.color,
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${styles.border}`,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                fontSize: '14px',
                                fontWeight: 500,
                                letterSpacing: '0.3px',
                            }}
                        >
                            <Box sx={{ flex: 1, mr: 2 }}>{toast.message}</Box>
                            <IconButton
                                aria-label="close"
                                size="small"
                                onClick={() => dismiss(toast.id)}
                                sx={{
                                    color: styles.color,
                                    opacity: 0.8,
                                    '&:hover': {
                                        opacity: 1,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
