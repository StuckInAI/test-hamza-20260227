import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { initializeDatabase } from '@/lib/db';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'test',
  description: 'A food and drink calculator for recipe scaling, unit conversion, and nutrition analysis.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize database on server start
  await initializeDatabase();

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-green-50 to-blue-50`}>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}