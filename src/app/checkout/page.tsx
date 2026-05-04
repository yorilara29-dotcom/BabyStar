"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  ShoppingBag,
  ChevronLeft,
  Lock,
  Check,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);

  const shipping = totalPrice >= 60 ? 0 : 4.99;
  const finalTotal = totalPrice + shipping;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    clearCart();
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-[#FFEDE5] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#FFDACB]" />
          </div>
          <h1 className="text-3xl font-display text-[#2D3436] mb-4">
            No hay productos en tu carrito
          </h1>
          <p className="text-[#636E72] font-body mb-8">
            Añade productos a tu carrito para continuar con el checkout.
          </p>
          <Button
            asChild
            className="bg-[#FF8B5C] hover:bg-[#FFAB85] text-white px-8 py-6"
          >
            <Link href="/tienda">Ir a la tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-[#5FE8C0] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-display text-[#2D3436] mb-4">
            ¡Pedido realizado!
          </h1>
          <p className="text-[#636E72] font-body mb-4">
            Gracias por tu compra. Hemos enviado la confirmación a tu email.
          </p>
          <p className="text-sm text-[#636E72] font-body mb-8">
            Número de pedido: <strong>PM-{Math.floor(Math.random() * 100000)}</strong>
          </p>
          <Button
            asChild
            className="bg-[#FF8B5C] hover:bg-[#FFAB85] text-white px-8 py-6"
          >
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-[#F5F0E8] py-6">
        <div className="container mx-auto px-4">
          <Link
            href="/carrito"
            className="inline-flex items-center text-[#636E72] hover:text-[#FF8B5C] font-body text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver al carrito
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[
              { num: 1, label: "Envío" },
              { num: 2, label: "Pago" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-body text-sm ${
                    step >= s.num
                      ? "bg-[#FF8B5C] text-white"
                      : "bg-[#F5F0E8] text-[#636E72]"
                  }`}
                >
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span
                  className={`ml-2 font-body text-sm ${
                    step >= s.num ? "text-[#2D3436]" : "text-[#636E72]"
                  }`}
                >
                  {s.label}
                </span>
                {i < 1 && (
                  <div
                    className={`w-20 h-0.5 mx-4 ${
                      step > s.num ? "bg-[#FF8B5C]" : "bg-[#F5F0E8]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmitOrder}>
                {step === 1 && (
                  <div className="bg-white rounded-2xl border border-[#F5F0E8] p-6">
                    <h2 className="text-xl font-display text-[#2D3436] mb-6">
                      Datos de envío
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Nombre *
                        </label>
                        <Input
                          required
                          placeholder="Tu nombre"
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Apellidos *
                        </label>
                        <Input
                          required
                          placeholder="Tus apellidos"
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Email *
                        </label>
                        <Input
                          required
                          type="email"
                          placeholder="tu@email.com"
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Teléfono *
                        </label>
                        <Input
                          required
                          type="tel"
                          placeholder="+34 600 000 000"
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Dirección *
                        </label>
                        <Input
                          required
                          placeholder="Calle, número, piso..."
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Ciudad *
                        </label>
                        <Input
                          required
                          placeholder="Tu ciudad"
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Código postal *
                        </label>
                        <Input
                          required
                          placeholder="00000"
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Provincia *
                        </label>
                        <Select required>
                          <SelectTrigger className="border-[#F5F0E8]">
                            <SelectValue placeholder="Selecciona provincia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="madrid">Madrid</SelectItem>
                            <SelectItem value="barcelona">Barcelona</SelectItem>
                            <SelectItem value="valencia">Valencia</SelectItem>
                            <SelectItem value="sevilla">Sevilla</SelectItem>
                            <SelectItem value="otras">Otras</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full mt-6 bg-[#FF8B5C] hover:bg-[#FFAB85] text-white py-6"
                    >
                      Continuar al pago
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white rounded-2xl border border-[#F5F0E8] p-6">
                    <h2 className="text-xl font-display text-[#2D3436] mb-6">
                      Método de pago
                    </h2>

                    {/* Payment methods */}
                    <div className="space-y-3 mb-6">
                      {[
                        { id: "card", label: "Tarjeta de crédito/débito" },
                        { id: "paypal", label: "PayPal" },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center gap-3 p-4 border border-[#F5F0E8] rounded-xl cursor-pointer hover:border-[#FFDACB]"
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            defaultChecked={method.id === "card"}
                            className="accent-[#FF8B5C]"
                          />
                          <span className="font-body text-[#2D3436]">
                            {method.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Card form */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Número de tarjeta *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
                          <Input
                            required
                            placeholder="0000 0000 0000 0000"
                            className="pl-10 border-[#F5F0E8] focus:border-[#FF8B5C]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-body text-[#636E72] mb-2">
                            Fecha expiración *
                          </label>
                          <Input
                            required
                            placeholder="MM/AA"
                            className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-body text-[#636E72] mb-2">
                            CVV *
                          </label>
                          <Input
                            required
                            placeholder="123"
                            className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-body text-[#636E72] mb-2">
                          Nombre en la tarjeta *
                        </label>
                        <Input
                          required
                          placeholder="NOMBRE APELLIDOS"
                          className="border-[#F5F0E8] focus:border-[#FF8B5C]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-[#F0FDF9] rounded-xl mb-6">
                      <Lock className="w-5 h-5 text-[#14B88C]" />
                      <span className="text-sm font-body text-[#2D3436]">
                        Tu pago está protegido con encriptación SSL
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 border-[#FFDACB] text-[#2D3436] hover:bg-[#FFEDE5] py-6"
                      >
                        Volver
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#FF8B5C] hover:bg-[#FFAB85] text-white py-6"
                      >
                        Pagar {finalTotal.toFixed(2)}€
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#F5F0E8] p-6 sticky top-24">
                <h2 className="text-lg font-display text-[#2D3436] mb-4">
                  Tu pedido
                </h2>

                <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F5F0E8] flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2D3436] text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-[#2D3436] truncate">
                          {item.name}
                        </p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-[#636E72] font-body">
                            {item.size} {item.color}
                          </p>
                        )}
                      </div>
                      <span className="font-body text-sm text-[#2D3436]">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 py-4 border-t border-[#F5F0E8]">
                  <div className="flex justify-between text-sm text-[#636E72] font-body">
                    <span>Subtotal</span>
                    <span>{totalPrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#636E72] font-body">
                    <span>Envío</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        `${shipping.toFixed(2)}€`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-4 border-t border-[#F5F0E8]">
                  <span className="font-display text-[#2D3436]">Total</span>
                  <span className="text-xl font-display font-semibold text-[#2D3436]">
                    {finalTotal.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
