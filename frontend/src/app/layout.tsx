import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'EshopBuilder v3',
  description: 'Modern e-commerce platform with feed import system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
