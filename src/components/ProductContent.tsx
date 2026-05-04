"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import {
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  Shield,
  ChevronRight,
  Star,
} from "lucide-react";

export function ProductContent({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [currentImage, setCurrentImage] = useState(0);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div className="bg-[var(--cream-dark)] py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm font-body">
            <Link href="/" className="text-[var(--warm-gray)] hover:text-[var(--peach-500)]">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-[var(--warm-gray)]" />
            <Link href="/tienda" className="text-[var(--warm-gray)] hover:text-[var(--peach-500)]">
              Tienda
            </Link>
            <ChevronRight className="w-4 h-4 text-[var(--warm-gray)]" />
            <Link
              href={`/tienda?category=${product.categoryId}`}
              className="text-[var(--warm-gray)] hover:text-[var(--peach-500)] capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-[var(--warm-gray)]" />
            <span className="text-[var(--charcoal)]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--peach-50)] mb-4 glass-card border-none">
              <Image
                src={product.images[currentImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-[var(--mint-300)] text-[var(--charcoal)] text-sm font-body font-semibold px-4 py-1 rounded-full">
                  Nuevo
                </span>
              )}
              {product.isOnSale && discount > 0 && (
                <span className="absolute top-4 right-4 bg-[var(--peach-500)] text-white text-sm font-body font-semibold px-4 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden ${
                      currentImage === i
                        ? "ring-2 ring-[var(--peach-500)]"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <p className="text-sm text-[var(--warm-gray)] font-body uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-display text-[var(--charcoal)] mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-[var(--peach-400)] text-[var(--peach-400)]"
                          : "text-[var(--cream-dark)]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[var(--warm-gray)] font-body">
                  ({product.rating}) · {product.stock} en stock
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-display font-semibold text-[var(--charcoal)]">
                {product.price.toFixed(2)}€
              </span>
              {product.originalPrice && (
                <span className="text-xl text-[var(--warm-gray)] line-through font-body">
                  {product.originalPrice.toFixed(2)}€
                </span>
              )}
            </div>

            <p className="text-[var(--warm-gray)] font-body mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-body text-[var(--charcoal)] mb-2">
                  Talla
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
                        selectedSize === size
                          ? "bg-[var(--charcoal)] text-white"
                          : "bg-[var(--cream-dark)] text-[var(--charcoal)] hover:bg-[var(--peach-100)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-body text-[var(--charcoal)] mb-2">
                  Color: <span className="font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
                        selectedColor === color
                          ? "bg-[var(--charcoal)] text-white"
                          : "bg-[var(--cream-dark)] text-[var(--charcoal)] hover:bg-[var(--peach-100)]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and add to cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center bg-[var(--cream-dark)] rounded-xl">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-body text-lg">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-[var(--peach-500)] hover:bg-[var(--peach-400)] text-white py-6 text-base rounded-xl"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Añadir al carrito
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 border-[var(--peach-200)] hover:bg-[var(--peach-100)] rounded-xl"
              >
                <Heart className="w-5 h-5 text-[var(--charcoal)]" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-[var(--cream-dark)]">
              <div className="text-center">
                <Truck className="w-6 h-6 text-[var(--peach-500)] mx-auto mb-2" />
                <p className="text-xs text-[var(--warm-gray)] font-body">
                  Envío gratis +60€
                </p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-[var(--peach-500)] mx-auto mb-2" />
                <p className="text-xs text-[var(--warm-gray)] font-body">
                  Devolución 30 días
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-[var(--peach-500)] mx-auto mb-2" />
                <p className="text-xs text-[var(--warm-gray)] font-body">Pago seguro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="text-2xl md:text-3xl font-display text-[var(--charcoal)] mb-8">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
