import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  FileText,
  LogOut,
  Star,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/cms", label: "CMS", icon: FileText },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // RBAC: Solo admin y super_admin
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2">
            <Star className="w-6 h-6 text-rose-400 fill-rose-400" />
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">Baby Star</h1>
              <p className="text-xs text-slate-400">Panel Administrativo</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 mx-4 mt-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Sesión activa</p>
          <p className="text-sm font-medium text-slate-700 mt-1 truncate">{session.user.email}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-700 mt-2">
            {session.user.role}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-500 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" />
              {item.label}
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-slate-300 transition-all" />
            </Link>
          ))}
        </nav>

        {/* Logout - SIEMPRE VISIBLE */}
        <div className="p-4 border-t border-slate-100">
          <div className="space-y-2">
            <LogoutButton 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            />
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Star className="w-4 h-4" />
              Ver tienda
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="text-rose-400 font-medium">Baby Star</span>
              <ChevronRight className="w-4 h-4" />
              <span>Administración</span>
            </div>

            {/* Logout móvil/compacto */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 hidden sm:inline">
                {session.user.name || session.user.email}
              </span>
              <LogoutButton 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-3"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
