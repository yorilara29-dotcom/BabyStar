# BabyStar E-Commerce

E-commerce full-stack construido con Next.js 16, TypeScript, Prisma ORM, Auth.js v5 y Tailwind CSS.

## 🚀 Instalación con PNPM (Recomendado)

```bash
pnpm install
pnpm dev
```

## Scripts disponibles:

- `pnpm dev` - Desarrollo (Automatizado: levanta Docker DB + Turbopack)
- `pnpm build` - Build de producción
- `pnpm start` - Iniciar en producción
- `pnpm lint` - TypeScript check + ESLint
- `pnpm format` - Formatear con Biome

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router + Server Components)
- **Lenguaje**: TypeScript 5
- **UI**: React 18 + Tailwind CSS 3 + shadcn/ui + Lucide React
- **DB**: PostgreSQL + Prisma ORM
- **Auth**: Auth.js v5 + bcrypt + JWT + RBAC (SUPER_ADMIN, ADMIN)
- **Animaciones**: Framer Motion
- **Herramientas**: Biome, ESLint

## Base de datos

```bash
pnpm prisma db push   # Sincronizar schema
pnpm prisma db seed   # Poblar datos iniciales
pnpm prisma studio    # Interfaz visual
```
