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