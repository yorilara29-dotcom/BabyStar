import { prisma } from '@/lib/prisma';
import { cache } from 'react';

// Helper: convierte Decimal de Prisma a número plano (serializable)
function serializeDecimal(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  // Prisma Decimal object
  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return (value as any).toNumber();
  }
  return 0;
}

// Helper: convierte producto con Decimal a producto serializable
function serializeProduct(product: any) {
  if (!product) return null;
  return {
    ...product,
    price: serializeDecimal(product.price),
    comparePrice: product.comparePrice ? serializeDecimal(product.comparePrice) : null,
    // Inventory también puede tener números
    inventory: product.inventory ? {
      ...product.inventory,
      quantity: product.inventory.quantity ?? 0,
      reserved: product.inventory.reserved ?? 0,
      lowStock: product.inventory.lowStock ?? 5,
    } : null,
    // Category serializable
    category: product.category ? {
      ...product.category,
    } : null,
  };
}

export const getProducts = cache(async (options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { category, featured, search, page = 1, limit = 12 } = options || {};
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(featured && { isFeatured: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, inventory: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    // Serializar Decimal → number antes de retornar
    const serializedProducts = products.map(serializeProduct).filter(Boolean);

    return { 
      products: serializedProducts, 
      total: total ?? 0, 
      pages: Math.ceil((total ?? 0) / limit) 
    };
  } catch (error) {
    console.error('[getProducts] Error:', error);
    return { products: [], total: 0, pages: 0 };
  }
});

export const getProductBySlug = cache(async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        inventory: true,
        variants: { include: { inventory: true } },
      },
    });
    return serializeProduct(product);
  } catch (error) {
    console.error('[getProductBySlug] Error:', error);
    return null;
  }
});

export const getCategories = cache(async () => {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('[getCategories] Error:', error);
    return [];
  }
});

export const getFeaturedProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true, inventory: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
    return products.map(serializeProduct).filter(Boolean);
  } catch (error) {
    console.error('[getFeaturedProducts] Error:', error);
    return [];
  }
});

export const getContentBlock = cache(async (key: string) => {
  try {
    return await prisma.contentBlock.findUnique({
      where: { key, isActive: true },
    });
  } catch (error) {
    console.error('[getContentBlock] Error:', error);
    return null;
  }
});

export const getDashboardMetrics = cache(async () => {
  try {
    const [totalOrders, totalUsers, totalProducts, lowStockProducts] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.inventory.findMany({
        where: { quantity: { lte: 5 } },
        include: { product: true },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true, items: true },
    });

    return {
      totalOrders,
      totalUsers,
      totalProducts,
      lowStock: lowStockProducts,
      recentOrders,
    };
  } catch (error) {
    console.error('[getDashboardMetrics] Error:', error);
    return {
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      lowStock: [],
      recentOrders: [],
    };
  }
});
