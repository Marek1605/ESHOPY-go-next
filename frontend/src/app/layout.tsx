import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: 'EshopBuilder - Vytvorte si profesionálny e-shop',
  description: 'Najlepšia platforma pre e-commerce. Vytvorte si e-shop za pár minút bez programovania.',
  keywords: 'e-shop, eshop, online obchod, e-commerce, shoptet, shopify, woocommerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
