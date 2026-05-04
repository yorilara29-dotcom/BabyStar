import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartSlideOver } from '@/components/CartSlideOver';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Baby Star | Todo lo mejor para tu pequeña estrella',
  description: 'Tienda online de ropa, accesorios y juguetes para bebés.',
  keywords: 'bebe, ropa bebe, juguetes, accesorios, tienda infantil',
  openGraph: {
    title: 'Baby Star',
    description: 'Todo lo mejor para tu pequeña estrella',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-baby-white flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSlideOver />
        </CartProvider>
      </body>
    </html>
  );
}