import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateContentBlock } from "./actions";
import { Button } from "@/components/ui/button";

export default async function AdminCMSPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const blocks = await prisma.contentBlock.findMany({
    orderBy: { identifier: 'asc' }
  });

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-[var(--charcoal)]">CMS / Contenido</h1>
        <p className="text-[var(--warm-gray)] font-body text-sm">Gestiona los textos de la página principal.</p>
      </div>

      <div className="space-y-6">
        {blocks.map((block) => (
          <form 
            key={block.id} 
            action={updateContentBlock}
            className="glass-card p-6 border border-white/60 flex flex-col gap-4"
          >
            <input type="hidden" name="id" value={block.id} />
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-[var(--charcoal)] font-semibold">{block.identifier}</h3>
              <span className="text-xs bg-[var(--peach-50)] text-[var(--peach-500)] px-2 py-1 rounded-md uppercase">{block.type}</span>
            </div>
            
            {block.type === 'text' ? (
              <textarea 
                name="content"
                defaultValue={block.content}
                rows={3}
                className="w-full rounded-md border border-white/40 bg-white/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--peach-400)]"
              />
            ) : (
              <input 
                name="content"
                defaultValue={block.content}
                className="w-full rounded-md border border-white/40 bg-white/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--peach-400)]"
              />
            )}

            <div className="flex justify-end mt-2">
              <Button type="submit" className="bg-[var(--peach-500)] hover:bg-[var(--peach-400)] text-white">
                Guardar Cambios
              </Button>
            </div>
          </form>
        ))}
        {blocks.length === 0 && (
          <div className="text-center p-8 glass-card border border-white/60">
            <p className="text-[var(--warm-gray)] font-body">No hay bloques de contenido. Ejecuta el seed para crearlos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
