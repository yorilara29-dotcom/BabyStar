import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield, User } from "lucide-react";

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-[var(--charcoal)]">Gestión de Usuarios</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-[var(--peach-50)] text-[var(--warm-gray)] text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Nombre</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Rol</th>
                <th className="px-6 py-4 font-medium">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--peach-100)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--peach-100)] text-[var(--peach-500)] flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-[var(--charcoal)] font-medium">
                        {user.name || "Sin nombre"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--warm-gray)]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
                      user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      user.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : null}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--warm-gray)]">
                    {user.createdAt.toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
