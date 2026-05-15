import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  type: z.enum(["text", "html", "json"]).optional(),
  page: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

// PUT /api/content/blocks/[id] - Actualizar
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateSchema.parse(body);

    const block = await prisma.contentBlock.update({
      where: { id },
      data: { ...validated, updatedAt: new Date() },
    });

    return NextResponse.json({ block });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    console.error("[CMS_PUT_ERROR]", err);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE /api/content/blocks/[id] - Eliminar
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.contentBlock.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[CMS_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
