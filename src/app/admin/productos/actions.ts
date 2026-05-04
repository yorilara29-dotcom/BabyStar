'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const sku = formData.get('sku') as string;
  const categoryId = formData.get('categoryId') as string;
  const stock = parseInt(formData.get('stock') as string);
  const image = formData.get('image') as string || '/placeholder.jpg';

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[\s\W_]+/g, '-'),
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

  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
  redirect('/admin/productos');
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) throw new Error('Unauthorized');

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}