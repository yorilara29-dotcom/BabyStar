"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function CartSlideOver() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FEFCF9] shadow-xl z-50 flex flex-col slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#FFEDE5]">
          <h2 className="text-2xl font-display text-[#2D3436]">Tu Carrito</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
            className="text-[#2D3436] hover:text-[#FF8B5C]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-[#FFDACB] mb-4" />
              <p className="text-[#636E72] font-body mb-4">
                Tu carrito está vacío
              </p>
              <Button
                onClick={() => setIsCartOpen(false)}
                className="bg-[#FF8B5C] hover:bg-[#FFAB85] text-white"
                asChild
              >
                <Link href="/tienda">Explorar productos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-4 bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F5F0E8]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-[#2D3436] text-lg leading-tight">
                      {item.name}
                    </h3>
                    {(item.size || item.color) && (
                      <p className="text-sm text-[#636E72] font-body mt-1">
                        {item.size && `Talla: ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-[#F5F0E8] rounded-full">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center font-body text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-body font-semibold text-[#2D3436]">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#636E72] hover:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#FFEDE5] p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[#636E72] font-body">Subtotal</span>
              <span className="text-xl font-display font-semibold text-[#2D3436]">
                {totalPrice.toFixed(2)}€
              </span>
            </div>
            <p className="text-xs text-[#636E72] font-body text-center">
              Gastos de envío calculados en el checkout
            </p>
            <div className="space-y-2">
              <Button
                className="w-full bg-[#FF8B5C] hover:bg-[#FFAB85] text-white py-6 text-base"
                asChild
                onClick={() => setIsCartOpen(false)}
              >
                <Link href="/checkout">Finalizar compra</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#FFDACB] text-[#2D3436] hover:bg-[#FFEDE5] py-6 text-base"
                asChild
                onClick={() => setIsCartOpen(false)}
              >
                <Link href="/carrito">Ver carrito</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
