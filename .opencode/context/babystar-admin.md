# Baby Star — Contexto: Panel Administrativo & CMS
# Agente recomendado: frontend-developer
# ================================================================

## Objetivo
Crear el dashboard administrativo completo con métricas, gestión de productos/pedidos/usuarios y CMS en vivo.

## Dependencias
- Prisma Client
- next-auth (session)
- lucide-react (iconos)
- Tailwind custom colors (baby-rose, baby-mint, baby-sky)

## Archivos a crear

### src/app/admin/layout.tsx
```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, FileText, LogOut } from 'lucide-react';
import { signOut } from '@/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.role || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/login');
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { href: '/admin/cms', label: 'CMS', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gradient">Baby Star Admin</h1>
          <p className="text-xs text-gray-500 mt-1">{session.user.email}</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-baby-rose/10 hover:text-baby-rose-dark transition-colors">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
```

### src/app/admin/page.tsx (Dashboard)
```typescript
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
    { label: 'Stock Bajo', value: metrics.lowStock.length, icon: AlertTriangle, color: 'from-yellow-400 to-orange-400', alert: metrics.lowStock.length > 0 },
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

      {metrics.lowStock.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-orange-400">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Alertas de Stock Bajo</h2>
          </div>
          <div className="space-y-2">
            {metrics.lowStock.map((item) => (
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
              {metrics.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</td>
                  <td className="py-3">{order.user?.name || 'Invitado'}</td>
                  <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
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
```

### src/app/admin/cms/page.tsx (CMS Editor)
```typescript
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

async function updateContent(formData: FormData) {
  'use server';
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  const value = formData.get('value') as string;

  await prisma.contentBlock.update({
    where: { id },
    data: { value, updatedBy: session.user.id },
  });

  revalidatePath('/');
  revalidatePath('/admin/cms');
}

export default async function CMSPage() {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) redirect('/login');

  const blocks = await prisma.contentBlock.findMany({ orderBy: { section: 'asc' } });
  const sections = [...new Set(blocks.map(b => b.section))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
        <p className="text-gray-500 mt-1">Edita el contenido del sitio en tiempo real</p>
      </div>
      {sections.map((section) => (
        <div key={section} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">Sección: {section}</h2>
          <div className="space-y-4">
            {blocks.filter(b => b.section === section).map((block) => (
              <form key={block.id} action={updateContent} className="space-y-2">
                <input type="hidden" name="id" value={block.id} />
                <label className="block text-sm font-medium text-gray-700">{block.key}</label>
                {block.type === 'TEXT' ? (
                  <textarea name="value" defaultValue={block.value} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all resize-none" />
                ) : (
                  <input type="text" name="value" defaultValue={block.value} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all" />
                )}
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-baby-rose text-gray-800 rounded-xl font-medium hover:bg-baby-rose-dark transition-colors">Guardar cambios</button>
                </div>
              </form>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### src/app/admin/productos/page.tsx (Listado de productos)
```typescript
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default async function ProductosPage() {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) redirect('/login');

  const products = await prisma.product.findMany({
    include: { category: true, inventory: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 mt-1">Gestiona tu catálogo</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <button className="flex items-center gap-2 px-4 py-2 bg-baby-rose text-gray-800 rounded-xl font-medium hover:bg-baby-rose-dark transition-colors">
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Producto</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                        {product.images[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category.name}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (product.inventory?.quantity || 0) <= 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>{product.inventory?.quantity || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-baby-rose/10 text-gray-600 hover:text-baby-rose-dark transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

### src/app/admin/productos/nuevo/page.tsx (Alta de producto)
```typescript
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { generateSlug } from '@/lib/utils';

async function createProduct(formData: FormData) {
  'use server';
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const sku = formData.get('sku') as string;
  const categoryId = formData.get('categoryId') as string;
  const stock = parseInt(formData.get('stock') as string);
  const images = [(formData.get('image') as string) || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600'];

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name,
        slug: generateSlug(name),
        description,
        price,
        sku,
        images,
        categoryId,
      },
    });
    await tx.inventory.create({
      data: { productId: product.id, quantity: stock, lowStock: 5 },
    });
  });

  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
  redirect('/admin/productos');
}

export default async function NuevoProductoPage() {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) redirect('/login');

  const categories = await prisma.category.findMany({ where: { isActive: true } });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="text-gray-500 mt-1">Agrega un producto al catálogo</p>
      </div>
      <form action={createProduct} className="glass-card p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" rows={4} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input name="price" type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input name="sku" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select name="categoryId" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all bg-white">
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock inicial</label>
            <input name="stock" type="number" defaultValue={10} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
          <input name="image" type="url" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all" />
        </div>
        <div className="flex justify-end gap-4">
          <a href="/admin/productos" className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</a>
          <button type="submit" className="px-6 py-3 bg-baby-rose text-gray-800 rounded-xl font-medium hover:bg-baby-rose-dark transition-colors">Crear producto</button>
        </div>
      </form>
    </div>
  );
}
```

### src/app/admin/pedidos/page.tsx
```typescript
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';

export default async function PedidosPage() {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) redirect('/login');

  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-500 mt-1">Gestiona las órdenes de los clientes</p>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Pago</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">{order.user?.name || order.user?.email || 'Invitado'}</td>
                  <td className="px-6 py-4">{order.items.length} items</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{order.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

### src/app/admin/usuarios/page.tsx
```typescript
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Users, Shield, User } from 'lucide-react';

export default async function UsuariosPage() {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) redirect('/login');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 mt-1">Gestiona los usuarios registrados</p>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Usuario</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Rol</th>
                <th className="px-6 py-4 font-medium">Registro</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-baby-rose to-baby-mint flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{user.name || 'Sin nombre'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'SUPER_ADMIN' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

## Reglas críticas
1. **TODAS las páginas admin verifican sesión**: `const session = await auth();` al inicio
2. **Redirección si no es admin**: `redirect('/login')` inmediatamente
3. **Server Actions protegidas**: Cada action verifica `session.user.role` antes de ejecutar
4. **revalidatePath** después de mutaciones: Para refrescar SSR en páginas públicas
5. **Transacciones para creación**: Producto + Inventario en una sola transacción
6. **NO exponer passwords**: En queries de usuario, usar `select` explícito
7. **Badge de estado**: Colores consistentes — verde (éxito), amarillo (pendiente), rojo (error/cancelado)
