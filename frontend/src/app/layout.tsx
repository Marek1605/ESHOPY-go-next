import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'EshopBuilder - Vytvorte si vlastný e-shop',
  description: 'Profesionálna e-commerce platforma pre váš online biznis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body className="bg-slate-950 text-white antialiased">
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} />
      </body>
    </html>
  );
}
