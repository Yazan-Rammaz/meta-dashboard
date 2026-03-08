'use client';

import type { Toast } from '@/contexts/toastContext';
import { useToast } from '@/contexts/toastContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { Box, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const MAX_TOASTS = 5;

const toastStyles: Record<
    Toast['type'],
    {
        border: string;
        icon: React.ComponentType;
        iconColor: string;
        progressColor: string;
        duration: number;
    }
> = {
    success: {
        border: '#10b981',
        icon: CheckCircleIcon,
        iconColor: '#10b981',
        progressColor: '#10b981',
        duration: 4000,
    },
    error: {
        border: '#ef4444',
        icon: ErrorIcon,
        iconColor: '#ef4444',
        progressColor: '#ef4444',
        duration: 4000,
    },
    info: {
        border: '#3b82f6',
        icon: InfoIcon,
        iconColor: '#3b82f6',
        progressColor: '#3b82f6',
        duration: 3000,
    },
};

export default function ToastContainer() {
    const { toasts, dismiss } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const startTimes = useRef<Record<string, number>>({});
    const pausedElapsed = useRef<Record<string, number>>({});
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [hoveredToastId, setHoveredToastId] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Get the top (newest) toast
        const topToast = toasts[toasts.length - 1];

        const interval = setInterval(() => {
            if (!topToast) return;

            // Only process the top toast
            const toast = topToast;
            const styles = toastStyles[toast.type];

            // Pause if hovered
            if (hoveredToastId === toast.id) {
                // Store current elapsed time when paused
                if (startTimes.current[toast.id]) {
                    const elapsed =
                        (pausedElapsed.current[toast.id] || 0) +
                        (Date.now() - startTimes.current[toast.id]);
                    pausedElapsed.current[toast.id] = elapsed;
                    delete startTimes.current[toast.id];
                }
                return;
            }

            if (styles.duration > 0) {
                // Initialize start time if needed
                if (!startTimes.current[toast.id]) {
                    startTimes.current[toast.id] = Date.now();
                    if (!pausedElapsed.current[toast.id]) {
                        pausedElapsed.current[toast.id] = 0;
                    }
                }

                const elapsed =
                    (pausedElapsed.current[toast.id] || 0) +
                    (Date.now() - startTimes.current[toast.id]);

                // Auto-dismiss when duration expires
                if (elapsed >= styles.duration) {
                    dismiss(toast.id);
                    return;
                }

                // Update progress for the top toast
                setProgress((prev) => ({
                    ...prev,
                    [toast.id]: Math.max(0, ((styles.duration - elapsed) / styles.duration) * 100),
                }));
            }
        }, 50);

        return () => clearInterval(interval);
    }, [toasts, dismiss, hoveredToastId]);

    // When a toast moves from top position, store its elapsed time
    useEffect(() => {
        const topToast = toasts[toasts.length - 1];

        toasts.forEach((toast) => {
            // If this toast is not at the top but has a start time, pause it
            if (toast.id !== topToast?.id && startTimes.current[toast.id]) {
                const elapsed =
                    (pausedElapsed.current[toast.id] || 0) +
                    (Date.now() - startTimes.current[toast.id]);
                pausedElapsed.current[toast.id] = elapsed;
                // Reset start time so it doesn't keep accumulating
                delete startTimes.current[toast.id];
            }
        });

        // When a toast becomes the top toast, resume from where it left off
        if (topToast && !startTimes.current[topToast.id] && pausedElapsed.current[topToast.id]) {
            startTimes.current[topToast.id] = Date.now();
        }
    }, [toasts]);

    // Cleanup times for dismissed toasts
    useEffect(() => {
        const toastIds = new Set(toasts.map((t) => t.id));
        Object.keys(startTimes.current).forEach((id) => {
            if (!toastIds.has(id)) {
                delete startTimes.current[id];
                delete pausedElapsed.current[id];
            }
        });
    }, [toasts]);

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
                maxWidth: 420,
                width: '100%',
                pointerEvents: 'none',
            }}
        >
            {visible.map((toast, index) => {
                const styles = toastStyles[toast.type];
                const IconComponent = styles.icon;
                const isNewest = index === visible.length - 1;
                const offsetFromTop = (visible.length - 1 - index) * 12;
                // Show progress only for the top toast, others show full bar
                const toastProgress = isNewest ? (progress[toast.id] ?? 100) : 100;

                return (
                    <Box
                        key={toast.id}
                        onMouseEnter={() => setHoveredToastId(toast.id)}
                        onMouseLeave={() => setHoveredToastId(null)}
                        sx={{
                            position: 'absolute',
                            top: `${offsetFromTop}px`,
                            right: 0,
                            width: '100%',
                            opacity: isNewest ? 1 : 0.85,
                            transform: isNewest
                                ? 'translateX(0) scale(1)'
                                : 'translateX(4px) scale(0.97)',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            pointerEvents: 'auto',
                            zIndex: index,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                backgroundColor: '#ffffff',
                                color: '#1f2937',
                                padding: '16px 20px',
                                borderRadius: '10px',
                                border: `2px solid ${styles.border}`,
                                boxShadow:
                                    '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
                                fontSize: '15px',
                                fontWeight: 500,
                                letterSpacing: '0.2px',
                                lineHeight: 1.5,
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flex: 1,
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box
                                        component={IconComponent}
                                        sx={{
                                            fontSize: '22px',
                                            color: styles.iconColor,
                                            flexShrink: 0,
                                            marginTop: '2px',
                                        }}
                                    />
                                    <Box sx={{ flex: 1 }}>{toast.message}</Box>
                                </Box>
                                <IconButton
                                    aria-label="close"
                                    size="small"
                                    onClick={() => dismiss(toast.id)}
                                    sx={{
                                        color: styles.iconColor,
                                        opacity: 0.7,
                                        padding: '4px',
                                        flexShrink: 0,
                                        '&:hover': {
                                            opacity: 1,
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            {styles.duration > 0 && (
                                <Box
                                    sx={{
                                        height: '3px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '2px',
                                        marginTop: '12px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            backgroundColor: styles.progressColor,
                                            width: `${toastProgress}%`,
                                            transition: 'width 0.05s linear',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
