'use client';

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
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
          <div className="w-24 h-24 bg-baby-rose/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-baby-rose" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-500 mb-8">
            Parece que aún no has añadido ningún producto a tu carrito.
            ¡Explora nuestra tienda!
          </p>
          <Link href="/tienda">
            <button className="glass-button">
              Ir a la tienda
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="bg-gradient-to-r from-baby-rose/20 to-baby-mint/20 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Tu Carrito</h1>
          <p className="text-gray-500 mt-2">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm text-gray-500">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Precio</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid md:grid-cols-12 gap-4 p-4 border-b border-gray-100 last:border-b-0 items-center">
                  <div className="md:col-span-6 flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <Link href={`/producto/${item.slug}`} className="font-medium text-gray-900 hover:text-baby-rose-dark">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:text-red-600 mt-2 md:hidden block">
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center">
                    <span className="font-medium">€{item.price.toFixed(2)}</span>
                  </div>

                  <div className="md:col-span-2 flex justify-center">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-200"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-200"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-2">
                    <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 hidden md:flex"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
              <Link href="/tienda" className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Seguir comprando</Link>
              <button onClick={clearCart} className="text-red-500 hover:text-red-600">Vaciar carrito</button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>

              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-2">Código de descuento</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Introduce tu código" className="pl-10" disabled={couponApplied} />
                  </div>
                  <button onClick={handleApplyCoupon} disabled={couponApplied} className="px-3 py-2 border border-baby-rose rounded-lg hover:bg-baby-rose/10 disabled:opacity-50">
                    {couponApplied ? "Aplicado" : "Aplicar"}
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>€{totalPrice.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento</span><span>-€{discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Envío</span><span>{shipping === 0 ? <span className="text-green-600">Gratis</span> : `€${shipping.toFixed(2)}`}</span></div>
              </div>

              <div className="flex justify-between py-4 border-t border-gray-100">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">€{finalTotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="glass-button w-full py-3 text-center block mt-4">
                Finalizar compra
                <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}