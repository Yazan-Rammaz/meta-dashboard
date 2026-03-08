'use client';

import ToastContainer from '@/components/Toast';
import { AppLangProvider } from '@/contexts/appLangContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ToastProvider } from '@/contexts/toastContext';
import { TranslationsProvider } from '@/contexts/translationContext';
import { queryClient } from '@/lib/queryClient';
import ThemeProvider from '@/theme/ThemeProvider';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'nprogress/nprogress.css';
import { HelmetProvider } from 'react-helmet-async';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <SidebarProvider>
                    <AppLangProvider>
                        <TranslationsProvider>
                            <ThemeProvider>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <ToastProvider>
                                        <CssBaseline />
                                        {children}
                                        <ToastContainer />
                                    </ToastProvider>
                                </LocalizationProvider>
                            </ThemeProvider>
                        </TranslationsProvider>
                    </AppLangProvider>
                </SidebarProvider>
            </HelmetProvider>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
