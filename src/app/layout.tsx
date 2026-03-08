import ClientRootLayout from '@/app/ClientRootLayout';
import { Inter } from 'next/font/google';
export { metadata } from '@/config/metadata';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClientRootLayout>{children}</ClientRootLayout>
            </body>
        </html>
    );
}
