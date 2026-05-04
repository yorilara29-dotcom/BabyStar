import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
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
  const image = (formData.get('image') as string) || '/placeholder.jpg';

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name,
        slug: generateSlug(name),
        description,
        price,
        sku,
        images: [image],
        categoryId,
      },
    });
    await tx.inventory.create({
      data: { productId: product.id, quantity: stock, lowStock: 5 },
    });
  });

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