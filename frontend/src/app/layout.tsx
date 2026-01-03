import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EshopBuilder | Vytvor si profesionálny e-shop za minúty',
  description: 'Najmodernejšia platforma na tvorbu e-shopov pre slovenský a český trh. AI-powered, rýchle, krásne.',
  keywords: ['e-shop', 'tvorba e-shopu', 'online obchod', 'slovenský e-shop', 'shopify alternatíva'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk" className="dark">
      <body className="noise">
        {children}
      </body>
    </html>
  )
}
