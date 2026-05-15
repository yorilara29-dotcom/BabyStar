"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/login/actions";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all"
          placeholder="Tu email de administrador"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all"
          placeholder="••••••••"
        />
      </div>
      
      {errorMessage && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 text-center">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full glass-button py-3 disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar sesión"}
      </button>
    </form>
  );
}
