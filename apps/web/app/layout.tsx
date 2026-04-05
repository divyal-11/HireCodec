import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Hire Codec — Real-Time Technical Interview Platform',
  description:
    'A production-grade, real-time collaborative technical interview platform with live code editing, video calls, and Docker-sandboxed execution.',
  keywords: ['technical interview', 'coding interview', 'collaborative editor', 'code execution'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dash-bg antialiased">
        {children}
      </body>
    </html>
  );
}
