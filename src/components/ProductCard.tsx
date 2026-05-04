"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link href={`/producto/${product.id}`}>
      <div className="product-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-[#F5F0E8]">
        {/* Image container */}
        <div className="relative aspect-square bg-[#F5F0E8] img-zoom-container">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-[#5FE8C0] text-[#2D3436] text-xs font-body font-semibold px-3 py-1 rounded-full">
                Nuevo
              </span>
            )}
            {product.isOnSale && discount > 0 && (
              <span className="bg-[#FF8B5C] text-white text-xs font-body font-semibold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="w-4 h-4 text-[#2D3436]" />
            </Button>
          </div>

          {/* Add to cart button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#2D3436] hover:bg-[#FF8B5C] text-white py-5 rounded-xl font-body text-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Añadir al carrito
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-[#636E72] font-body uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-display text-lg text-[#2D3436] mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0)
                      ? "fill-[#FFAB85] text-[#FFAB85]"
                      : "text-[#F5F0E8]"
                  }`}
                />
              ))}
              <span className="text-xs text-[#636E72] font-body ml-1">
                ({product.rating})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-body font-semibold text-[#2D3436]">
              {product.price.toFixed(2)}€
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#636E72] line-through font-body">
                {product.originalPrice.toFixed(2)}€
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
