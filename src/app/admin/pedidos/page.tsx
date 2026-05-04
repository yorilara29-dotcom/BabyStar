import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPedidosPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-[var(--charcoal)]">Pedidos</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-[var(--peach-50)] text-[var(--warm-gray)] text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">ID Pedido</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--peach-100)]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 text-[var(--charcoal)] font-medium">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-[var(--charcoal)]">
                    {order.createdAt.toLocaleDateString("es-ES", {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-[var(--charcoal)]">
                    {order.user?.name || order.user?.email || "Invitado"}
                  </td>
                  <td className="px-6 py-4 text-[var(--charcoal)] font-semibold">
                    €{Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[var(--warm-gray)]">
                    {order.items.length} producto(s)
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[var(--warm-gray)]">
                    Aún no se han registrado pedidos.
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
