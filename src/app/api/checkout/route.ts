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