import { prisma } from '@/lib/prisma';
import { cache } from 'react';

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

  return { products, total, pages: Math.ceil(total / limit) };
});

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      inventory: true,
      variants: { include: { inventory: true } },
    },
  });
});

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
});

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true, inventory: true },
    take: 8,
  });
});

export const getContentBlock = cache(async (key: string) => {
  return prisma.contentBlock.findUnique({
    where: { key, isActive: true },
  });
});

export const getDashboardMetrics = cache(async () => {
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

  return { totalOrders, totalUsers, totalProducts, lowStock: lowStockProducts, recentOrders };
});