'use client';
import Providers from '@/app/providers';
import ClientLayout from '@/layouts/ClientLayout';
import './globals.css';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <ClientLayout>{children}</ClientLayout>
        </Providers>
    );
}
