import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/content/public - Endpoint público para contenido del sitio
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const page = searchParams.get("page") || "home";

    if (key) {
      // Buscar bloque específico
      const block = await prisma.contentBlock.findFirst({
        where: { 
          key, 
          page,
          isActive: true 
        },
      });

      if (!block) {
        // Fallback: buscar en página global
        const globalBlock = await prisma.contentBlock.findFirst({
          where: { key, page: "global", isActive: true },
        });
        return NextResponse.json({ block: globalBlock || null });
      }

      return NextResponse.json({ block });
    }

    // Listar todos los bloques de una página
    const blocks = await prisma.contentBlock.findMany({
      where: { 
        OR: [
          { page, isActive: true },
          { page: "global", isActive: true }
        ]
      },
      orderBy: { key: "asc" },
    });

    return NextResponse.json({ blocks });
  } catch (err) {
    console.error("[PUBLIC_CONTENT_ERROR]", err);
    return NextResponse.json(
      { error: "Error al cargar contenido" },
      { status: 500 }
    );
  }
}
