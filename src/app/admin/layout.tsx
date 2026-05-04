import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogOut, Package, Users, LayoutDashboard, ShoppingCart, FileText } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--peach-100)] flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-[var(--peach-100)]">
          <span className="text-2xl font-display text-[var(--charcoal)]">
            Baby Star <span className="text-[var(--peach-500)] text-sm ml-1 font-body">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--peach-50)] text-[var(--peach-500)] font-body">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/pedidos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--warm-gray)] hover:bg-[var(--peach-50)] hover:text-[var(--peach-500)] transition-colors font-body">
            <ShoppingCart className="w-5 h-5" />
            Pedidos
          </Link>
          <Link href="/admin/productos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--warm-gray)] hover:bg-[var(--peach-50)] hover:text-[var(--peach-500)] transition-colors font-body">
            <Package className="w-5 h-5" />
            Productos
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--warm-gray)] hover:bg-[var(--peach-50)] hover:text-[var(--peach-500)] transition-colors font-body">
            <Users className="w-5 h-5" />
            Usuarios
          </Link>
          <Link href="/admin/cms" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--warm-gray)] hover:bg-[var(--peach-50)] hover:text-[var(--peach-500)] transition-colors font-body">
            <FileText className="w-5 h-5" />
            CMS / Contenido
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--peach-100)]">
          <div className="mb-4 px-4">
            <p className="text-sm font-body text-[var(--charcoal)] truncate">{session.user.email}</p>
            <p className="text-xs font-body text-[var(--warm-gray)]">{session.user.role}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex w-full items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-body text-sm">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto fade-in">
        {children}
      </main>
    </div>
  );
}
