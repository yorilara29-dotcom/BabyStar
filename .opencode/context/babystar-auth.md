# Baby Star — Contexto: Autenticación & Seguridad
# Agente recomendado: security-specialist
# ================================================================

## Objetivo
Implementar autenticación segura con NextAuth v5 (Auth.js), RBAC, protección de rutas y headers OWASP.

## Dependencias ya instaladas (asumidas)
- next-auth@5.0.0-beta.25
- @auth/prisma-adapter
- bcryptjs
- zod

## Archivos a crear

### src/types/next-auth.d.ts
```typescript
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  }
}
```

### src/auth.ts
```typescript
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(parsed.data.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isAdmin = auth?.user?.role === 'ADMIN' || auth?.user?.role === 'SUPER_ADMIN';

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (!isAdmin) return false;
      }
      return true;
    },
  },
});
```

### src/middleware.ts
```typescript
export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

### src/app/api/auth/[...nextauth]/route.ts
```typescript
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

### src/app/login/page.tsx
```typescript
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Baby } from 'lucide-react';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === 'USER' ? '/' : '/admin');
  }

  async function handleLogin(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/admin',
      });
    } catch (error) {
      redirect('/login?error=CredentialsSignin');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-baby-rose/20 via-baby-white to-baby-mint/20 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-baby-rose to-baby-mint mb-4">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Baby Star</h1>
            <p className="text-gray-500 mt-1">Inicia sesión en tu cuenta</p>
          </div>

          <form action={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all"
                placeholder="admin@babystar.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full glass-button py-3"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo: admin@babystar.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Reglas críticas
- Session strategy: JWT (necesario para Credentials provider)
- Callback `authorized` debe verificar tanto login como rol ADMIN/SUPER_ADMIN
- Middleware solo intercepta rutas que coincidan con matcher
- NUNCA exponer secrets en cliente
- CSP debe permitir 'unsafe-inline' para styles (Tailwind) y 'unsafe-eval' (Next.js)
- Login usa Server Actions (form action), NO fetch manual
