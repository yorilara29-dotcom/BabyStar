import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: {
            OR: [
              { id: item.dbId || "" },
              { name: item.name || "" },
            ]
          },
          include: { variants: true }
        });

        if (!product || product.variants.length === 0) {
          throw new Error(`Producto "${item.name}" no encontrado o sin variantes`);
        }

        const variant = product.variants[0];
        totalAmount += Number(product.price) * item.quantity;

        if (variant.stock < item.quantity) {
          throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${variant.stock}`);
        }

        orderItemsData.push({
          variantId: variant.id,
          quantity: item.quantity,
          price: product.price,
        });

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        });

        await tx.inventoryMovement.create({
          data: {
            variantId: variant.id,
            movementType: "OUT",
            quantity: item.quantity,
            reason: "Venta online",
          }
        });
      }

      const newOrder = await tx.order.create({
        data: {
          totalAmount,
          status: "PENDING",
          items: {
            create: orderItemsData
          }
        }
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Error procesando el pedido" },
      { status: 500 }
    );
  }
}
