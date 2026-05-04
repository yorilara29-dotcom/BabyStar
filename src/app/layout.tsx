import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baby Star | Ropa y Accesorios para Bebés",
  description:
    "Tienda online de ropa, accesorios y juguetes para bebés. Materiales de calidad, diseños únicos y envío gratis a partir de 60€.",
  keywords:
    "ropa bebé, accesorios bebé, tienda bebé, bodies, pijamas, juguetes, alimentación bebé",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
