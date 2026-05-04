# Baby Star — Contexto: API Routes & Backend Logic
# Agente recomendado: backend-architect
# ================================================================

## Objetivo
Crear la capa API REST y la capa de datos SSR (Server Components) con caching, validación Zod y transacciones atómicas.

## Dependencias
- Prisma Client (ya configurado en src/lib/prisma.ts)
- Zod (validación)
- React cache() (deduplicación de requests)

## Archivos a crear

### src/lib/data.ts (Capa de datos SSR con React cache)
```typescript
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
  const [totalOrders, totalUsers, totalProducts, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.inventory.findMany({
      where: { quantity: { lte: prisma.inventory.fields.lowStock } },
      include: { product: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, items: true },
  });

  return { totalOrders, totalUsers, totalProducts, lowStock, recentOrders };
});
```

### src/app/api/products/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const params = productQuerySchema.parse(searchParams);
    const skip = (params.page - 1) * params.limit;

    const where = {
      isActive: true,
      ...(params.category && { category: { slug: params.category } }),
      ...(params.featured && { isFeatured: true }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' as const } },
          { description: { contains: params.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, inventory: { select: { quantity: true } } },
        skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, pages: Math.ceil(total / params.limit) });
  } catch (error) {
    console.error('API Products Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
```

### src/app/api/checkout/route.ts (CHECKOUT ATÓMICO — CRÍTICO)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { MovementType } from '@prisma/client';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().min(1),
    variantId: z.string().optional(),
  })).min(1),
  shippingAddress: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().min(3),
    phone: z.string().min(8),
  }),
  email: z.string().email().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Verificar stock disponible
      const stockChecks = await Promise.all(
        data.items.map(async (item) => {
          const inventory = await tx.inventory.findFirst({
            where: item.variantId
              ? { variantId: item.variantId }
              : { productId: item.productId },
          });

          if (!inventory || inventory.quantity < item.quantity) {
            throw new Error(`Stock insuficiente para el producto ${item.productId}`);
          }
          return { inventory, item };
        })
      );

      // 2. Calcular totales con snapshots
      let subtotal = 0;
      const orderItems = await Promise.all(
        data.items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);

          const itemTotal = Number(product.price) * item.quantity;
          subtotal += itemTotal;

          return {
            productId: item.productId,
            variantId: item.variantId || null,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            total: itemTotal,
          };
        })
      );

      const shipping = subtotal > 50 ? 0 : 5.99;
      const tax = subtotal * 0.16;
      const total = subtotal + shipping + tax;

      // 3. Crear la orden
      const order = await tx.order.create({
        data: {
          status: 'PENDING',
          paymentStatus: 'PENDING',
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress: data.shippingAddress,
          notes: data.notes,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      // 4. Descontar stock y registrar movimiento
      for (const { inventory, item } of stockChecks) {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity } },
        });

        await tx.inventoryMovement.create({
          data: {
            inventoryId: inventory.id,
            type: MovementType.OUT,
            quantity: item.quantity,
            reason: `Venta - Orden ${order.id}`,
            orderId: order.id,
          },
        });
      }

      return order;
    }, {
      isolationLevel: 'Serializable',
      maxWait: 5000,
      timeout: 10000,
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
      message: 'Orden creada exitosamente',
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Error en el checkout';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

## Reglas críticas
1. **Checkout ATÓMICO**: Todo dentro de `prisma.$transaction` con `isolationLevel: 'Serializable'`
2. **Snapshot de precios**: Guardar `price` en OrderItem, NO referencia al producto
3. **Verificación de stock ANTES de crear la orden**: Si falla, toda la transacción se revierte
4. **InventoryMovement OUT**: Cada venta genera un movimiento de salida trazable
5. **Zod en TODAS las API routes**: Validar query params y body antes de tocar la DB
6. **React cache()**: Usar en `src/lib/data.ts` para deduplicar requests en Server Components
7. **NO usar Prisma en Client Components**: Solo en Server Components, API routes y Server Actions
