import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const blockSchema = z.object({
  key: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  content: z.string(),
  type: z.enum(["text", "html", "json"]).default("text"),
  page: z.string().min(1).max(100).default("home"),
  isActive: z.boolean().default(true),
});

// GET /api/content/blocks - Listar bloques (público para lectura, admin para gestión)
export async function GET() {
  try {
    const blocks = await prisma.contentBlock.findMany({
      orderBy: [{ page: "asc" }, { key: "asc" }],
    });
    return NextResponse.json({ blocks });
  } catch (err) {
    console.error("[CMS_GET_ERROR]", err);
    return NextResponse.json(
      { error: "Error al cargar bloques de contenido" },
      { status: 500 }
    );
  }
}

// POST /api/content/blocks - Crear bloque (solo admin)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const validated = blockSchema.parse(body);

    const block = await prisma.contentBlock.create({
      data: validated,
    });

    return NextResponse.json({ block }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: err.errors }, { status: 400 });
    }
    console.error("[CMS_POST_ERROR]", err);
    return NextResponse.json({ error: "Error al crear bloque" }, { status: 500 });
  }
}
