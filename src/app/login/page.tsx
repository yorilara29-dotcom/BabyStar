"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[var(--blue-50)] via-[var(--cream)] to-[var(--peach-50)]">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--blue-200)] rounded-full blur-3xl mix-blend-multiply animate-pulse duration-[3000ms]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--mint-200)] rounded-full blur-3xl mix-blend-multiply animate-pulse duration-[4000ms]" />
      </div>

      <div className="relative w-full max-w-md px-4 fade-in">
        <div className="glass-card p-8 text-center slide-up">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center border border-white/40 shadow-sm">
              <Shield className="w-8 h-8 text-[var(--peach-500)]" />
            </div>
          </div>
          
          <h1 className="text-3xl font-display text-[var(--charcoal)] mb-2">
            Baby Star Admin
          </h1>
          <p className="text-[var(--warm-gray)] font-body text-sm mb-8">
            Ingresa tus credenciales para acceder al panel.
          </p>

          <form action={dispatch} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-body text-[var(--charcoal)] ml-1">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@babystar.es"
                required
                className="bg-white/50 border-white/40 focus:border-[var(--peach-400)] focus:ring-[var(--peach-400)] h-12"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <label className="text-sm font-body text-[var(--charcoal)] ml-1">Contraseña</label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="bg-white/50 border-white/40 focus:border-[var(--peach-400)] focus:ring-[var(--peach-400)] h-12"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-100/80 border border-red-200 text-red-600 rounded-lg text-sm font-body animate-bounce">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[var(--peach-500)] hover:bg-[var(--peach-400)] text-white font-body text-base mt-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20">
            <Link href="/" className="text-sm font-body text-[var(--warm-gray)] hover:text-[var(--peach-500)] transition-colors">
              &larr; Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
