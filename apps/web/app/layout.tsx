import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'Hire Codec — Real-Time Technical Interview Platform',
  description:
    'A production-grade, real-time collaborative technical interview platform with live code editing, video calls, and Docker-sandboxed execution.',
  keywords: ['technical interview', 'coding interview', 'collaborative editor', 'code execution'],
};

import SessionProvider from '@/components/SessionProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-dash-bg dark:bg-editor-bg antialiased transition-colors duration-300">
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
