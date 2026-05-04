'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/tienda', label: 'Tienda' },
    { href: '/tienda?featured=true', label: 'Destacados' },
  ];

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image src="/logos/logo-baby-star.png" alt="Baby Star" fill className="object-contain" priority />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">Baby Star</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-baby-rose-dark font-medium transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="p-2 rounded-full hover:bg-baby-rose/10 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full hover:bg-baby-rose/10 transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-baby-rose text-gray-800 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full hover:bg-baby-rose/10 transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/20">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-baby-rose-dark font-medium">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}