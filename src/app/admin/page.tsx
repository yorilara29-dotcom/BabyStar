import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const [ordersCount, totalSalesObj, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  const allVariants = await prisma.productVariant.findMany();
  const lowStockProducts = allVariants.filter(v => v.stock < 5).length;

  const totalSales = Number(totalSalesObj._sum.totalAmount || 0);

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-display text-[var(--charcoal)] mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border border-white/60 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--warm-gray)] font-body text-sm font-medium">Ventas Totales</h3>
            <div className="p-2 bg-green-50 text-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display text-[var(--charcoal)]">€{totalSales.toFixed(2)}</p>
        </div>
        
        <div className="glass-card p-6 border border-white/60 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--warm-gray)] font-body text-sm font-medium">Pedidos Recibidos</h3>
            <div className="p-2 bg-[var(--peach-50)] text-[var(--peach-500)] rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display text-[var(--charcoal)]">{ordersCount}</p>
        </div>
        
        <div className="glass-card p-6 border border-white/60 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--warm-gray)] font-body text-sm font-medium">Alertas de Stock (&lt; 5)</h3>
            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display text-red-500">{lowStockProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card border border-white/60 overflow-hidden">
          <div className="p-6 border-b border-[var(--peach-100)] flex items-center justify-between">
            <h2 className="text-xl font-display text-[var(--charcoal)]">Pedidos Recientes</h2>
            <Link href="/admin/pedidos" className="text-sm text-[var(--peach-500)] font-body hover:underline">Ver todos</Link>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-[var(--peach-100)]">
              {recentOrders.map(order => (
                <li key={order.id} className="p-6 hover:bg-white/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--charcoal)]">#{order.id.slice(0,8).toUpperCase()}</p>
                    <p className="text-sm text-[var(--warm-gray)]">{order.user?.email || "Invitado"} - {order.createdAt.toLocaleDateString("es-ES")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--charcoal)]">€{Number(order.totalAmount).toFixed(2)}</p>
                    <span className="text-xs text-[var(--warm-gray)] bg-[var(--peach-50)] px-2 py-1 rounded-full">{order.status}</span>
                  </div>
                </li>
              ))}
              {recentOrders.length === 0 && (
                <li className="p-8 text-center text-[var(--warm-gray)]">No hay actividad reciente.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
