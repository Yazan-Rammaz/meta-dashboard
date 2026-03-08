'use client';

import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';

interface Props {
    onIntersect: () => void;
    isLoading: boolean;
    hasMore: boolean;
}

export default function InfiniteScrollTrigger({ onIntersect, isLoading, hasMore }: Props) {
    const triggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasMore) return;
        const el = triggerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onIntersect();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, onIntersect]);

    if (!hasMore) return null;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            {isLoading ? (
                <CircularProgress size={24} />
            ) : (
                <div ref={triggerRef} style={{ height: 1 }} />
            )}
        </Box>
    );
}
