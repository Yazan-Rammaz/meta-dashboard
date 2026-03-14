'use client';

import SidebarLayout from '@/layouts/SidebarLayout';
import { useAuthStore } from '@/stores/authStore';
import { Box, CircularProgress } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        useAuthStore.persist.rehydrate();
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && !user && pathname !== '/login') {
            router.replace('/login');
        }
    }, [isClient, user, pathname, router]);

    if (!isClient) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (pathname === '/login' || pathname === '/meta-login-frame') {
        return <>{children}</>;
    }

    return <SidebarLayout>{children}</SidebarLayout>;
}
