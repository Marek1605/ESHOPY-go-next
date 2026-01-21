import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: 'EshopBuilder | Vytvorte si profesionálny e-shop',
  description: 'Vytvorte si profesionálny e-shop za pár minút s pomocou AI. Slovenská platforma pre online predaj.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
