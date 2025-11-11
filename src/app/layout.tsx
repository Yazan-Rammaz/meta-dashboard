import ClientRootLayout from '@/app/ClientRootLayout';
export { metadata } from '@/config/metadata';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
