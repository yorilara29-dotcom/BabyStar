"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateContentBlock(formData: FormData) {
  const id = formData.get("id") as string;
  const value = formData.get("value") as string;

  await prisma.contentBlock.update({
    where: { id },
    data: { value }
  });

  revalidatePath("/");
  revalidatePath("/admin/cms");
}
