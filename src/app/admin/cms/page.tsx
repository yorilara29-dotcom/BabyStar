import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function updateContent(formData: FormData) {
  'use server';
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  const value = formData.get('value') as string;

  await prisma.contentBlock.update({
    where: { id },
    data: { value, updatedBy: session.user.id },
  });

  revalidatePath('/');
  revalidatePath('/admin/cms');
}

export default async function CMSPage() {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) redirect('/login');

  const blocks = await prisma.contentBlock.findMany({ orderBy: { section: 'asc' } });
  const sections = [...new Set(blocks.map(b => b.section))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
        <p className="text-gray-500 mt-1">Edita el contenido del sitio en tiempo real</p>
      </div>
      {sections.map((section) => (
        <div key={section} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">Sección: {section}</h2>
          <div className="space-y-4">
            {blocks.filter(b => b.section === section).map((block) => (
              <form key={block.id} action={updateContent} className="space-y-2">
                <input type="hidden" name="id" value={block.id} />
                <label className="block text-sm font-medium text-gray-700">{block.key}</label>
                {block.type === 'TEXT' ? (
                  <textarea name="value" defaultValue={block.value} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all resize-none" />
                ) : (
                  <input type="text" name="value" defaultValue={block.value} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all" />
                )}
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-baby-rose text-gray-800 rounded-xl font-medium hover:bg-baby-rose-dark transition-colors">Guardar cambios</button>
                </div>
              </form>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}