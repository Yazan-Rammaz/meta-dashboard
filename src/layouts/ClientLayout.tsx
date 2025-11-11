'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Box, CircularProgress } from '@mui/material';

export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !auth.user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isClient, auth.user, pathname, router]);

  if (!isClient) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}
