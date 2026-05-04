"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

export default function CarritoPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } =
    useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = totalPrice >= 60 ? 0 : 4.99;
  const discount = couponApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "BIENVENIDO20") {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-[#FFEDE5] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#FFDACB]" />
          </div>
          <h1 className="text-3xl font-display text-[#2D3436] mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-[#636E72] font-body mb-8">
            Parece que aún no has añadido ningún producto a tu carrito.
            ¡Explora nuestra tienda!
          </p>
          <Button
            asChild
            className="bg-[#FF8B5C] hover:bg-[#FFAB85] text-white px-8 py-6"
          >
            <Link href="/tienda">
              Ir a la tienda
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="bg-gradient-to-r from-[#FFEDE5] to-[#F0FDF9] py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-display text-[#2D3436]">Tu Carrito</h1>
          <p className="text-[#636E72] font-body mt-2">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#F5F0E8] overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-[#F5F0E8] text-sm font-body text-[#636E72]">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Precio</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="grid md:grid-cols-12 gap-4 p-4 border-b border-[#F5F0E8] last:border-b-0 items-center"
                >
                  {/* Product */}
                  <div className="md:col-span-6 flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F5F0E8] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/producto/${item.id}`}
                        className="font-display text-[#2D3436] hover:text-[#FF8B5C] transition-colors"
                      >
                        {item.name}
                      </Link>
                      {(item.size || item.color) && (
                        <p className="text-sm text-[#636E72] font-body mt-1">
                          {item.size && `Talla: ${item.size}`}
                          {item.size && item.color && " · "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-500 hover:text-red-600 font-body mt-2 md:hidden"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-center">
                    <span className="md:hidden text-sm text-[#636E72] font-body mr-2">
                      Precio:
                    </span>
                    <span className="font-body text-[#2D3436]">
                      {item.price.toFixed(2)}€
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-center">
                    <div className="flex items-center bg-[#F5F0E8] rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-body text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 flex items-center justify-end gap-2">
                    <span className="md:hidden text-sm text-[#636E72] font-body">
                      Total:
                    </span>
                    <span className="font-body font-semibold text-[#2D3436]">
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#636E72] hover:text-red-500 hidden md:flex"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
              <Button
                variant="outline"
                asChild
                className="border-[#FFDACB] text-[#2D3436] hover:bg-[#FFEDE5]"
              >
                <Link href="/tienda">Seguir comprando</Link>
              </Button>
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Vaciar carrito
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#F5F0E8] p-6 sticky top-24">
              <h2 className="text-xl font-display text-[#2D3436] mb-6">
                Resumen del pedido
              </h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-body text-[#636E72] mb-2">
                  Código de descuento
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636E72]" />
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Introduce tu código"
                      className="pl-10 border-[#F5F0E8]"
                      disabled={couponApplied}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    className="border-[#FF8B5C] text-[#FF8B5C] hover:bg-[#FFEDE5]"
                    disabled={couponApplied}
                  >
                    {couponApplied ? "Aplicado" : "Aplicar"}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-green-600 font-body mt-2">
                    Código aplicado: 10% de descuento
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#636E72] font-body">
                  <span>Subtotal</span>
                  <span>{totalPrice.toFixed(2)}€</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-body">
                    <span>Descuento</span>
                    <span>-{discount.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between text-[#636E72] font-body">
                  <span>Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      `${shipping.toFixed(2)}€`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#636E72] font-body">
                    Envío gratis a partir de 60€
                  </p>
                )}
              </div>

              <div className="flex justify-between py-4 border-t border-[#F5F0E8]">
                <span className="text-lg font-display text-[#2D3436]">
                  Total
                </span>
                <span className="text-2xl font-display font-semibold text-[#2D3436]">
                  {finalTotal.toFixed(2)}€
                </span>
              </div>

              <Button
                asChild
                className="w-full bg-[#FF8B5C] hover:bg-[#FFAB85] text-white py-6 text-base mt-4"
              >
                <Link href="/checkout">
                  Finalizar compra
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>

              <p className="text-xs text-center text-[#636E72] font-body mt-4">
                Aceptamos Visa, Mastercard y PayPal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
