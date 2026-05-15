'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, ImageOff } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    category?: { name: string } | null;
    inventory?: { quantity: number } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const isLowStock = product.inventory && product.inventory.quantity <= 5 && product.inventory.quantity > 0;
  const isOutOfStock = !product.inventory || product.inventory.quantity === 0;

  return (
    <motion.div 
      whileHover={{ y: -8 }} 
      transition={{ type: 'spring', stiffness: 300 }} 
      className="glass-card overflow-hidden group"
    >
      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageError || !product.images || product.images.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-pink-50 to-blue-50/30 text-gray-400">
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-full mb-3 shadow-sm border border-white/40">
                <ImageOff className="w-8 h-8 text-slate-300 stroke-[1.5]" />
              </div>
              <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">Sin imagen</span>
            </div>
          ) : (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImageError(true)}
            />
          )}
          {isLowStock && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              ¡Últimas unidades!
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">
              Agotado
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              // TODO: Wishlist
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </Link>

      <div className="p-4">
        {product.category && (
          <span className="text-xs font-medium text-baby-rose-dark uppercase tracking-wider">
            {product.category.name}
          </span>
        )}
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 mt-1 mb-2 line-clamp-2 hover:text-baby-rose-dark transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={isOutOfStock}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-baby-rose to-baby-mint text-gray-800 font-medium hover:shadow-lg hover:shadow-baby-rose/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </motion.div>
  );
}
