# Baby Star — Contexto: Frontend Storefront & Carrito
# Agente recomendado: frontend-developer
# ================================================================

## Objetivo
Crear toda la experiencia de tienda pública: Home, Tienda, Producto, Carrito, Checkout — con Server Components, Framer Motion y glassmorfismo.

## Dependencias
- framer-motion
- lucide-react
- next/image

## Archivos a crear

### src/context/CartContext.tsx
```typescript
'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'baby-star-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) { console.error('Error loading cart:', e); }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  const addItem = useCallback((product: any) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, {
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: product.images?.[0] || '',
        quantity: 1,
        slug: product.slug,
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) { removeItem(id); return; }
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
```

### src/components/Header.tsx
```typescript
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
              <Image src="/logos/Logo Baby Star.png" alt="Baby Star" fill className="object-contain" priority />
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
```

### src/components/HeroSection.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-baby-rose/20 via-baby-white to-baby-mint/20 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-baby-rose rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-baby-mint rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-baby-sky rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-baby-rose-dark" />
            <span className="text-sm font-medium text-gray-700">Nueva Colección 2026</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gradient leading-tight">{title}</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tienda"><button className="glass-button text-gray-800">Explorar Tienda</button></Link>
            <Link href="/tienda?featured=true"><button className="px-6 py-3 rounded-full font-medium border-2 border-baby-rose text-baby-rose-dark hover:bg-baby-rose/10 transition-all">Ver Destacados</button></Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### src/components/ProductCard.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    comparePrice?: number | string | null;
    images: string[];
    category: { name: string };
    inventory?: { quantity: number } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isLowStock = product.inventory && product.inventory.quantity <= 5;
  const isOutOfStock = product.inventory && product.inventory.quantity === 0;

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }} className="glass-card overflow-hidden group">
      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image src={product.images[0] || '/placeholder.jpg'} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          {isLowStock && !isOutOfStock && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">¡Últimas unidades!</span>
          )}
          {isOutOfStock && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">Agotado</span>
          )}
          <button onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs font-medium text-baby-rose-dark uppercase tracking-wider">{product.category.name}</span>
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 mt-1 mb-2 line-clamp-2 hover:text-baby-rose-dark transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.comparePrice && <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>}
        </div>
        <button onClick={() => addItem(product)} disabled={isOutOfStock} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-baby-rose to-baby-mint text-gray-800 font-medium hover:shadow-lg hover:shadow-baby-rose/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </motion.div>
  );
}
```

### src/components/CartSlideOver.tsx
```typescript
'use client';

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export function CartSlideOver() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Tu Carrito</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                  <button onClick={() => setIsOpen(false)} className="mt-4 text-baby-rose-dark font-medium hover:underline">Seguir comprando</button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="flex gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-baby-rose-dark font-semibold mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-lg bg-white border border-gray-200 hover:border-baby-rose transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-lg bg-white border border-gray-200 hover:border-baby-rose transition-colors"><Plus className="w-4 h-4" /></button>
                        <button onClick={() => removeItem(item.id)} className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gradient">{formatPrice(totalPrice)}</span>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <button className="w-full glass-button py-3 text-center">Proceder al pago</button>
                </Link>
                <button onClick={clearCart} className="w-full py-3 text-gray-500 hover:text-red-500 transition-colors text-sm">Vaciar carrito</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### src/app/page.tsx (Home SSR + ISR)
```typescript
import { getFeaturedProducts, getContentBlock, getCategories } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { HeroSection } from '@/components/HeroSection';
import { CategorySection } from '@/components/CategorySection';
import { ContentBlock } from '@/components/ContentBlock';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, categories, heroTitle, heroSubtitle] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getContentBlock('hero_title'),
    getContentBlock('hero_subtitle'),
  ]);

  return (
    <div className="space-y-16 pb-16">
      <HeroSection title={heroTitle?.value || 'Bienvenido a Baby Star'} subtitle={heroSubtitle?.value || 'Todo lo mejor para tu pequeña estrella ✨'} />
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Categorías</h2>
        <CategorySection categories={categories} />
      </section>
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
      <section className="container mx-auto px-4">
        <ContentBlock blockKey="about_text" />
      </section>
    </div>
  );
}
```

### src/components/CategorySection.tsx
```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shirt, Baby, Puzzle } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ropa: Shirt,
  accesorios: Baby,
  juguetes: Puzzle,
};

export function CategorySection({ categories }: { categories: { id: string; name: string; slug: string; description: string | null }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {categories.map((cat, i) => {
        const Icon = iconMap[cat.slug] || Baby;
        return (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={`/tienda?category=${cat.slug}`}>
              <div className="glass-card p-8 text-center group cursor-pointer">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-baby-rose to-baby-mint mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-gray-500 mt-2 text-sm">{cat.description}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
```

### src/components/ContentBlock.tsx
```typescript
import { getContentBlock } from '@/lib/data';

export async function ContentBlock({ blockKey }: { blockKey: string }) {
  const block = await getContentBlock(blockKey);
  if (!block) return null;
  return (
    <div className="glass-card p-8 text-center max-w-3xl mx-auto">
      <p className="text-lg text-gray-700 leading-relaxed">{block.value}</p>
    </div>
  );
}
```

### src/components/Footer.tsx
```typescript
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gradient text-lg">Baby Star</h3>
            <p className="text-sm text-gray-500 mt-1">Todo lo mejor para tu pequeña estrella</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/tienda" className="hover:text-baby-rose-dark transition-colors">Tienda</Link>
            <Link href="/login" className="hover:text-baby-rose-dark transition-colors">Admin</Link>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-baby-rose fill-baby-rose" /> para los más pequeños
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## Reglas críticas
1. **Server Components para data fetching**: `page.tsx`, `layout.tsx` deben ser async donde consulten Prisma
2. **Client Components para interactividad**: Todo lo que use hooks, eventos o Framer Motion debe tener `'use client'`
3. **Framer Motion NUNCA en Server Components**: Solo en archivos con 'use client'
4. **next/image obligatorio**: Todas las imágenes usan `<Image>` con `fill` o dimensiones explícitas
5. **CartContext es Client Component**: Porque usa localStorage y hooks de React
6. **ISR en páginas públicas**: `export const revalidate = 60` para regeneración incremental
7. **Parallel fetching**: Usar `Promise.all([])` cuando se necesiten múltiples datos
