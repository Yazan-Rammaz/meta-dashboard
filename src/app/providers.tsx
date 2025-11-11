'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { HelmetProvider } from 'react-helmet-async';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { TranslationsProvider } from '@/contexts/translationContext';
import { AppLangProvider } from '@/contexts/appLangContext';
import ThemeProvider from '@/theme/ThemeProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <SidebarProvider>
          <AppLangProvider>
            <TranslationsProvider>
              <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CssBaseline />
                  {children}
                  <ToastContainer position="top-center" />
                </LocalizationProvider>
              </ThemeProvider>
            </TranslationsProvider>
          </AppLangProvider>
        </SidebarProvider>
      </HelmetProvider>
    </Provider>
  );
}
