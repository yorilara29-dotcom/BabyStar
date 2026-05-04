'use client';

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ChevronLeft, Lock, Check, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    notes: "",
  });

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const finalTotal = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const checkoutData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        email: formData.email,
        notes: formData.notes,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al procesar el pedido");
        setLoading(false);
        return;
      }

      setOrderId(data.orderId);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-baby-rose/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-baby-rose" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No hay productos en tu carrito</h1>
          <p className="text-gray-500 mb-8">Añade productos a tu carrito para continuar.</p>
          <Link href="/tienda" className="glass-button inline-block">Ir a la tienda</Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-baby-mint rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido realizado!</h1>
          <p className="text-gray-500 mb-4">Gracias por tu compra.</p>
          <p className="text-sm text-gray-500 mb-8">Número de pedido: <strong className="text-baby-rose-dark">{orderId.slice(0, 8)}</strong></p>
          <Link href="/" className="glass-button">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <Link href="/carrito" className="inline-flex items-center text-gray-500 hover:text-baby-rose-dark text-sm">
            <ChevronLeft className="w-4 h-4 mr-1" />Volver al carrito
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Datos de envío</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Nombre completo *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required placeholder="Juan García" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Email *</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Teléfono *</label>
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+34 600 000 000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Dirección *</label>
                    <input name="address" value={formData.address} onChange={handleChange} required placeholder="Calle, número, piso..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Ciudad *</label>
                    <input name="city" value={formData.city} onChange={handleChange} required placeholder="Madrid" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Código postal *</label>
                    <input name="postalCode" value={formData.postalCode} onChange={handleChange} required placeholder="28013" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Notas (opcional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Instrucciones especiales..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-baby-mint/20 rounded-xl">
                <Lock className="w-5 h-5 text-baby-mint-dark" />
                <span className="text-sm text-gray-600">Tu pago está protegido</span>
              </div>

              <button type="submit" disabled={loading} className="w-full glass-button py-3 disabled:opacity-50">
                {loading ? "Procesando..." : `Pagar ${formatPrice(finalTotal)}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tu pedido</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{item.name}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 py-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between text-sm text-gray-500"><span>Envío</span><span>{shipping === 0 ? <span className="text-green-600">Gratis</span> : formatPrice(shipping)}</span></div>
              </div>
              <div className="flex justify-between py-4 border-t border-gray-100">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}