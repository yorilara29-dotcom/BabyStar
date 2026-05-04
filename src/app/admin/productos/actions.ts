"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const price = parseFloat(formData.get("price") as string);
  const sku = formData.get("sku") as string;
  const image = formData.get("image") as string;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      sku,
      images: [image],
      isActive: true,
      variants: {
        create: {
          sku: `${sku}-DEFAULT`,
          price,
          stock: 10,
        }
      }
    }
  });

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  revalidatePath("/");
  
  return product;
}

export async function deleteProduct(productId: string) {
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false }
  });

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  revalidatePath("/");
}
