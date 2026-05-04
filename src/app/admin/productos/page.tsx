import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-[var(--charcoal)]">Productos</h1>
        <Link 
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-[var(--peach-500)] hover:bg-[var(--peach-400)] text-white px-4 py-2 rounded-lg font-body transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-[var(--peach-50)] text-[var(--warm-gray)] text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Producto</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium">Stock (Variantes)</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--peach-100)]">
              {products.map((product) => {
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

                return (
                  <tr key={product.id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--peach-50)]">
                          {product.images[0] && (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--charcoal)]">{product.name}</div>
                          <div className="text-xs text-[var(--warm-gray)]">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--charcoal)]">
                      {product.category?.name || "Sin categoría"}
                    </td>
                    <td className="px-6 py-4 text-[var(--charcoal)]">
                      €{product.price.toString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        totalStock > 10 ? 'bg-green-100 text-green-800' : 
                        totalStock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {totalStock} unid.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/productos/${product.id}/editar`}
                          className="p-2 text-[var(--blue-500)] hover:bg-[var(--blue-50)] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--warm-gray)]">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
