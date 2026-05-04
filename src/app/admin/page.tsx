import { getDashboardMetrics } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Users, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export const revalidate = 30;

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics();

  const stats = [
    { label: 'Total Pedidos', value: metrics.totalOrders, icon: ShoppingCart, color: 'from-baby-rose to-baby-rose-dark' },
    { label: 'Usuarios Registrados', value: metrics.totalUsers, icon: Users, color: 'from-baby-mint to-baby-mint-dark' },
    { label: 'Productos Activos', value: metrics.totalProducts, icon: Package, color: 'from-baby-sky to-baby-sky-dark' },
    { label: 'Stock Bajo', value: metrics.lowStock?.length || 0, icon: AlertTriangle, color: 'from-yellow-400 to-orange-400', alert: (metrics.lowStock?.length || 0) > 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general de la tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.alert ? 'text-orange-500' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {metrics.lowStock && metrics.lowStock.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-orange-400">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Alertas de Stock Bajo</h2>
          </div>
          <div className="space-y-2">
            {metrics.lowStock.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{item.product?.name}</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">{item.quantity} unidades</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h2>
          <TrendingUp className="w-5 h-5 text-baby-rose-dark" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {metrics.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</td>
                  <td className="py-3">{order.user?.name || order.user?.email || 'Invitado'}</td>
                  <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{order.status}</span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}