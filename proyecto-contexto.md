# Contexto del Proyecto: Baby Star

## Descripción General
Baby Star es una tienda en línea especializada en ropa, accesorios y juguetes para bebés. El objetivo del proyecto es evolucionar desde un prototipo estático de frontend hacia una plataforma ecommerce moderna, segura, escalable y full-stack.

## Stack Tecnológico Actual
- **Framework**: Next.js 16.2.4 (App Router + Turbopack)
- **Lenguaje**: TypeScript 5.8.3
- **UI Framework**: React 19.2.5
- **Estilos**: Tailwind CSS 3.4.17 + shadcn/ui
- **Iconos**: Lucide React
- **Herramientas**: Biome, ESLint, pnpm
- **Manejo de Estado**: React Context (`CartContext.tsx`)
- **Base de Datos**: PostgreSQL vía Prisma ORM (esquemas definidos). Datos simulados temporales (`products.json`) listos para ser ingresados mediante el script de seed.
- **Autenticación**: Auth.js (NextAuth v5) + bcrypt. JWT Session Strategy con RBAC integrado.
- **Animaciones**: Framer Motion

## Arquitectura Actual
Actualmente, la arquitectura está transicionando a **Aplicación Full-Stack**.
- Existen rutas públicas frontend (`/`, `/tienda`, `/producto/[id]`, `/carrito`, `/checkout`).
- Se comenzó a implementar la capa de backend en `src/app/api/...`.
- Esquema de base de datos implementado con Prisma (modelos: User, Product, Category, InventoryMovement, Order, etc.).
- Las variables y estados de compras aún viven temporalmente en `localStorage`.

## Módulos Existentes
- **Frontend Público (Storefront)**: Home, Tienda, Producto Individual refactorizados como Server Components (SSR) consultando BD. Incluye `HeroSection` y `CategorySection`.
- **Carrito y Checkout**: Checkout Server-Side Transaccional `/api/checkout` (con validación de Stock).
- **Autenticación**: Página de Login (`/login`) con `LoginForm.tsx`, logout en `/api/auth/logout`, Middleware de validación de JWT por Roles (`SUPER_ADMIN`, `ADMIN`).
- **Dashboard Admin Base**: Panel de control interactivo con métricas, listados de Usuarios, Pedidos, y CRUD de Productos y CMS.
- **CMS (Content Management)**: Control en vivo del contenido del Storefront desde la BD (`ContentBlock`).
- **Componentes UI**: shadcn/ui (`Button`, `Input`, `Select`, `Sheet`).

## Módulos Faltantes (Arquitectura Objetivo)
- Pagos Reales (Integración con Stripe o PayPal).

## Decisiones Tomadas
- **Fase 1 completada**: Se refactorizó la estructura, se integró la marca **Baby Star** y se pulió la identidad visual aplicando paleta en pasteles (blanco hueso, rosa, verde y azul), glassmorfismo (`.glass`, `.glass-card`) y animaciones dinámicas sin romper la navegación.
- **Fase 2 completada**: Se incluyó Prisma ORM, se definió un esquema relacional para e-commerce (Productos, Usuarios, Roles, Pedidos, Movimientos de Inventario) y se crearon archivos de Docker para levantar la BDD Postgres local. También se configuró el Seed para el poblamiento.
- **Fase 3 completada**: Se integró NextAuth v5 con Middleware en Next.js. Se protegió la ruta `/admin`, se implementó RBAC y se desarrolló la vista de inicio de sesión con Server Actions, aplicando estilos de Glassmorfismo.
- **Fase 4 completada**: Se refactorizó el storefront (Catálogo dinámico SSR) conectándolo a la DB, se creó CRUD base para Productos en Panel Admin y se generó una ruta para checkout atómico que descuenta stock transaccionalmente.
- **Fase 5 completada**: Se implementaron listados administrativos (Usuarios y Pedidos), métricas en vivo en el Dashboard y un sistema CMS (`ContentBlock`) que permite modificar dinámicamente el texto de la tienda.
- **Fase 6 completada**: Se añadieron capas de seguridad (OWASP Security Headers) en `next.config.js` y consolidación final.
- **Fase 7 (Estabilización y Refinamiento UX)**: Se implementó un sistema de fallback "Premium" para imágenes en `ProductCard.tsx`, se centralizó la lógica de logout para evitar errores de redirección JSON, y se automatizó el inicio de la base de datos PostgreSQL mediante un script `predev` en Docker.
- La identidad visual principal tomará como referencia los recursos ubicados en `/logos`.
- El proyecto se dividió en 7 fases de ejecución controlada bajo mentalidad OWASP.

## Convenciones del Proyecto
- Componentes en `src/components`, utilidades en `src/lib`.
- Toda la aplicación se nombra y firma como **Baby Star**.
- Prohibido hacer "cat" o usar JSON estático en fases avanzadas.

## Estado de Fases
- **Fase 1 (Base técnica y estabilización)**: Completada.
- **Fase 2 (Datos y backend base)**: Completada.
- **Fase 3 (Autenticación y roles)**: Completada.
- **Fase 4 (Catálogo, inventario y checkout)**: Completada.
- **Fase 5 (Panel administrativo y CMS)**: Completada.
- **Fase 6 (Seguridad, observabilidad y calidad)**: Completada.
- **Fase 7 (Estabilización y Refinamiento UX)**: Completada.

## Reglas de desarrollo para futuras tareas
- **Nunca asumir backend existente**.
- En cada nueva fase, iniciar analizando dependencias y requerimientos de OWASP.
- Todo progreso debe actualizar `proceso.md` y `proyecto-contexto.md`.
- No alterar la marca Baby Star y aprovechar los recursos de diseño ya armados.

## Estructura de Directorios
A continuación se presenta el árbol de directorios real y actualizado del proyecto, excluyendo las carpetas `node_modules`, `.git`, `.next` y `react-doctor`:

```text
├── logos
│   ├── Logo Baby Star fondo blanco.jpeg
│   └── Logo Baby Star.png
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── public
│   └── ...
├── src
│   ├── app
│   │   ├── admin
│   │   │   ├── cms
│   │   │   │   ├── actions.ts
│   │   │   │   └── page.tsx
│   │   │   ├── pedidos
│   │   │   │   └── page.tsx
│   │   │   ├── productos
│   │   │   │   ├── nuevo
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actions.ts
│   │   │   │   └── page.tsx
│   │   │   ├── usuarios
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── [...nextauth]
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout
│   │   │   │       └── route.ts
│   │   │   ├── checkout
│   │   │   │   └── route.ts
│   │   │   └── products
│   │   │       └── route.ts
│   │   ├── carrito
│   │   │   └── page.tsx
│   │   ├── checkout
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   ├── actions.ts
│   │   │   └── page.tsx
│   │   ├── producto
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── tienda
│   │   │   └── page.tsx
│   │   ├── ClientBody.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── CartSlideOver.tsx
│   │   ├── ContentBlock.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CategorySection.tsx
│   │   ├── LoginForm.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductContent.tsx
│   │   └── ShopContent.tsx
│   ├── components/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── sheet.tsx
│   ├── context
│   │   └── CartContext.tsx
│   ├── data
│   │   └── products.json
│   ├── lib
│   │   ├── data.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── types
│   │   └── next-auth.d.ts
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── middleware.ts
│   └── IA_MEMORY.md
├── .env
├── .gitignore
├── .npmrc
├── biome.json
├── components.json
├── docker-compose.yml
├── eslint.config.mjs
├── INSTRUCCION_BabyStar_OpenCode.md
├── netlify.toml
├── next-env.d.ts
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── prisma.config.ts
├── proyecto-contexto.md
├── tailwind.config.ts
└── tsconfig.json
```

## Notas Adicionales
- El proyecto utiliza **pnpm** como gestor de paquetes (migración completada desde npm).
- Existe un subproyecto `react-doctor/` en el workspace (monorepo).
- Se ha agregado memoria de IA en `src/IA_MEMORY.md` para referencia del contexto del proyecto.