"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct } from "../actions";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createProduct(formData);
      router.push("/admin/productos");
    } catch (error) {
      console.error(error);
      alert("Error creando producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <h1 className="text-3xl font-display text-[var(--charcoal)] mb-8">Nuevo Producto</h1>
      
      <form onSubmit={handleSubmit} className="glass-card p-8 border border-white/60 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-body text-[var(--charcoal)]">Nombre del Producto</label>
          <Input name="name" required className="bg-white/50 border-white/40" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-body text-[var(--charcoal)]">Descripción</label>
          <textarea 
            name="description" 
            rows={4}
            className="w-full rounded-md border border-white/40 bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-body text-[var(--charcoal)]">Precio (€)</label>
            <Input name="price" type="number" step="0.01" required className="bg-white/50 border-white/40" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-body text-[var(--charcoal)]">SKU</label>
            <Input name="sku" required className="bg-white/50 border-white/40" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-body text-[var(--charcoal)]">URL de la Imagen Principal</label>
          <Input name="image" required className="bg-white/50 border-white/40" placeholder="https://..." />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-[var(--peach-100)]">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            className="border-[var(--peach-200)] text-[var(--charcoal)]"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[var(--peach-500)] hover:bg-[var(--peach-400)] text-white"
          >
            {loading ? "Guardando..." : "Guardar Producto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
