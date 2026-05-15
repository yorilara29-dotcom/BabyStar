```markdown
# CORRECCIÓN BUGS + MEJORAS AUTH ADMIN - E-COMMERCE NEXT.JS

## CONTEXTO DEL PROYECTO
```
Stack: Next.js 15.3.7 (App Router) + TypeScript + Prisma + Auth.js v5 + JWT + RBAC
Roles: SUPER_ADMIN, ADMIN
Panel Admin: Dashboard con métricas, CRUD Productos/Usuarios/Pedidos + CMS
Autenticación: /login con JWT Session Strategy + bcrypt
Problema: FALTA BOTÓN LOGOUT + Issues en login Admin
```

## TAREA PRINCIPAL: Corregir Issues + Mejorar Auth Admin

**USAR AGENCY AGENTS DEL PROYECTO para ahorrar tokens**

### 1. DIAGNÓSTICO AUTOMÁTICO (Agency Agent: Auditor)
```
AGENTE AUDITOR → Ejecuta:
- `pnpm lint --fix` 
- `pnpm build` → lista TODOS los errores/warnings
- Revisa consola browser → errores JS/TS
- Chequea Network tab → 401/500 en API calls
- Analiza /login → flujo completo de autenticación
- Verifica middleware JWT → roles SUPER_ADMIN/ADMIN
```

### 2. CORRECCIÓN LOGIN ADMIN (Agency Agent: AuthFixer)
```
🔧 PROBLEMAS COMUNES A CORREGIR:

**src/app/login/page.tsx:**
```tsx
// AGREGAR validación role ADMIN
const handleLogin = async (formData: FormData) => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      email: formData.get('email'),
      password: formData.get('password')
    })
  })
  
  const user = await res.json()
  
  // ← NUEVO: Redirect por role
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    router.push('/admin/dashboard')
  } else {
    router.push('/tienda')
  }
}
```

**Middleware auth:**
```ts
// src/middleware.ts → Verificar:
export function middleware(request: NextRequest) {
  const token = request.cookies.get('authjs.session-token')?.value
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login?redirect=/admin/dashboard', req.url))
  }
}
```
```

### 3. IMPLEMENTAR LOGOUT COMPLETO (Agency Agent: LogoutMaster)
```
**NUEVA RUTA API: src/app/api/auth/logout/route.ts**
```ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  
  if (session) {
    // Clear JWT cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('authjs.session-token')
    response.cookies.delete('__Secure-authjs.session-token')
    
    return response
  }
  
  return NextResponse.json({ error: 'No session' }, { status: 401 })
}
```

**BOTÓN LOGOUT en Dashboard Admin:**
```tsx
// src/app/admin/dashboard/page.tsx → AGREGAR:
import { useSession, signOut } from 'next-auth/react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  
  return (
    <div className="flex justify-between items-center mb-8">
      <h1>Dashboard Admin</h1>
      
      {/* ← NUEVO BOTÓN LOGOUT */}
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}
```
```

### 4. MEJORAS UX/UI LOGIN ADMIN (Agency Agent: UIEnhancer)
```
**src/app/login/page.tsx → Rediseñar:**

1. **Formulario mejorado con validación:**
```tsx
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

const handleSubmit = async (e: FormEvent) => {
  setLoading(true)
  setError('')
  
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!res.ok) {
      setError('Credenciales inválidas')
      return
    }
    
    router.push('/admin/dashboard')
  } catch {
    setError('Error de conexión')
  } finally {
    setLoading(false)
  }
}
```

2. **Roles selector** (opcional):
```tsx
<select name="role" className="mb-4 p-2 border rounded">
  <option value="ADMIN">Administrador</option>
  <option value="SUPER_ADMIN">Super Admin</option>
</select>
```

3. **Loading states + mejores mensajes de error**
```

### 5. VERIFICACIÓN COMPLETA (Agency Agent: Tester)
```
**TEST SUITE OBLIGATORIA:**

✅ **Login Admin funciona:**
- Email/password válido → redirect /admin/dashboard
- Role check correcto en middleware

✅ **Logout funciona 100%:**
- Borra cookies JWT completamente
- Redirect a /login
- No acceso a /admin sin login

✅ **Build pasa sin errores:**
```
pnpm build → 0 errors, 0 warnings
```

✅ **Funcionalidad intacta:**
- Frontend público (/tienda, /producto/[id])
- Carrito + Checkout
- CRUD Admin (Productos, Usuarios, Pedidos)
- CMS ContentBlock
```

### 6. COMMITS ESTRUCTURADOS
```
Commit 1: "fix: auth middleware + login admin redirect"
Commit 2: "feat: logout completo con cookie cleanup"  
Commit 3: "enhance: UX login form + error handling"
Commit 4: "test: verify full admin flow + build"
```

## FLUJO EJECUCIÓN AGENTS:
```
1. AGENTE AUDITOR → Diagnóstico issues
2. AGENTE AUTHFIXER → Corrige login/middleware  
3. AGENTE LOGOUTMASTER → Implementa logout
4. AGENTE UIENHANCER → Mejora UX login
5. AGENTE TESTER → Verifica todo funciona

MUESTRA:
- Errores encontrados (antes)
- Código corregido (diffs)
- Terminal: pnpm build/dev
- Screenshots: login → dashboard → logout
```

**¡Corrige TODO y deja el Admin Panel PERFECTO!**
```

**