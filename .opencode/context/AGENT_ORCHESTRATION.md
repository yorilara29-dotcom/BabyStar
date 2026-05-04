# Baby Star — Guía de Orquestación de Agentes (OpenCode Zen + MiniMax M2.5)
# ================================================================
# INSTRUCCIONES: Copia este archivo y los contextos a tu workspace,
# luego sigue las sesiones en orden. NO saltear pasos.
# ================================================================

## Preparación inicial (haz esto UNA VEZ)

### 1. Crear estructura de contexto en tu workspace
```bash
cd ~/Escritorio/Emprendimiento_proyecto
mkdir -p .opencode/context
mkdir -p .opencode/agents
```

### 2. Copiar los archivos de contexto
Copia estos archivos a `.opencode/context/`:
- `babystar-prisma.md`      → Base de datos, Docker, Seed
- `babystar-auth.md`        → Autenticación, seguridad, headers OWASP
- `babystar-design.md`      → Paleta, Tailwind, glassmorfismo, layout base
- `babystar-api.md`         → API routes, checkout atómico, data layer
- `babystar-frontend.md`    → Storefront, carrito, home, producto
- `babystar-admin.md`       → Dashboard, CMS, CRUD productos/pedidos/usuarios
- `babystar-debug.md`       → Troubleshooting, checklist, comandos

### 3. Crear proyecto Next.js (si no existe)
```bash
cd ~/Escritorio/Emprendimiento_proyecto
npx create-next-app@latest baby-star --typescript --tailwind --eslint --app --src-dir
cd baby-star
```

### 4. Instalar dependencias base
```bash
npm install @auth/prisma-adapter @prisma/client bcryptjs class-variance-authority clsx framer-motion lucide-react next-auth@5.0.0-beta.25 zod
npm install -D @types/bcryptjs @types/node @types/react @types/react-dom autoprefixer postcss prisma tailwindcss tsx typescript
```

---

## FLUJO DE SESIONES (Ejecutar en orden)

---

### 🔷 SESIÓN 1: Fundación de Datos
**Agente**: `backend-architect`
**Contexto**: `.opencode/context/babystar-prisma.md`
**Tokens estimados**: ~8,000

```
activate backend-architect

Lee el archivo /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-prisma.md

TAREA: Crea los siguientes archivos EXACTAMENTE como se especifica:
1. docker-compose.yml
2. prisma/schema.prisma
3. prisma/seed.ts
4. src/lib/prisma.ts
5. src/lib/utils.ts

REGLAS:
- NO modifiques la estructura de los modelos
- El seed debe ser idempotente (upsert)
- Admin seed: admin@babystar.com / admin123 con rol SUPER_ADMIN
- Usa los 6 productos de ejemplo con imágenes de Unsplash
- Valida datos con Zod antes de insertar
```

**Post-sesión (tú manualmente):**
```bash
docker-compose up -d
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npx prisma studio  # Verificar que todo se creó correctamente
```

---

### 🔷 SESIÓN 2: Autenticación y Seguridad
**Agente**: `security-specialist`
**Contexto**: `.opencode/context/babystar-auth.md`
**Tokens estimados**: ~6,000

```
activate security-specialist

Lee /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-auth.md

TAREA: Crea los archivos de autenticación:
1. src/types/next-auth.d.ts
2. src/auth.ts
3. src/middleware.ts
4. src/app/api/auth/[...nextauth]/route.ts
5. src/app/login/page.tsx
6. next.config.js (con headers OWASP)

REGLAS:
- Session strategy: JWT (obligatorio para Credentials provider)
- Middleware: proteger /admin/* y /api/admin/*
- Callback authorized: verificar login + rol ADMIN/SUPER_ADMIN
- CSP debe permitir 'unsafe-inline' para Tailwind y 'unsafe-eval' para Next.js
- Login con glassmorfismo, Server Actions, redirección condicional
```

**Post-sesión:**
```bash
npm run dev
# Probar: http://localhost:3000/login
# Credenciales: admin@babystar.com / admin123
# Debe redirigir a /admin
```

---

### 🔷 SESIÓN 3: API Routes y Lógica de Negocio
**Agente**: `backend-architect`
**Contexto**: `.opencode/context/babystar-api.md`
**Tokens estimados**: ~7,000

```
activate backend-architect

Lee /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-api.md

TAREA: Crea la capa API y datos SSR:
1. src/lib/data.ts (con React cache())
2. src/app/api/products/route.ts
3. src/app/api/checkout/route.ts

REGLAS CRÍTICAS:
- Checkout DEBE usar prisma.$transaction con isolationLevel: 'Serializable'
- Verificar stock ANTES de crear la orden
- Snapshot de precios en OrderItem (no referencia viva)
- Registrar InventoryMovement OUT por cada venta
- Zod validation en TODOS los endpoints
- API products: filtros por category, featured, search, paginación
```

**Post-sesión:**
```bash
# Probar API:
curl "http://localhost:3000/api/products?page=1&limit=4"

# Probar checkout (después de tener frontend):
# Usar el carrito y finalizar compra
```

---

### 🔷 SESIÓN 4: Diseño y Storefront Base
**Agente**: `frontend-developer` (o `ui-designer` si está disponible)
**Contexto**: `.opencode/context/babystar-design.md` + `.opencode/context/babystar-frontend.md`
**Tokens estimados**: ~12,000

```
activate frontend-developer

Lee estos dos archivos en orden:
1. /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-design.md
2. /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-frontend.md

TAREA: Crea el frontend público completo:
1. tailwind.config.ts (colores pastel extendidos)
2. src/app/globals.css (glassmorfismo, animaciones)
3. src/app/layout.tsx (Inter font, CartProvider, Header, Footer, CartSlideOver)
4. src/app/page.tsx (Home SSR con ISR)
5. src/components/HeroSection.tsx
6. src/components/CategorySection.tsx
7. src/components/ProductCard.tsx
8. src/components/Header.tsx
9. src/components/Footer.tsx
10. src/components/CartSlideOver.tsx
11. src/components/ContentBlock.tsx
12. src/context/CartContext.tsx

REGLAS DE DISEÑO:
- Glassmorfismo REAL: backdrop-filter blur + fondo semitransparente
- Paleta EXACTA: baby-white #FAFAF5, baby-rose #F4C2C2, baby-mint #B5EAD7, baby-sky #A2D2FF
- Framer Motion SOLO en Client Components ('use client')
- Server Components para data fetching (async)
- Logo: /logos/Logo Baby Star.png
- ISR: export const revalidate = 60 en páginas públicas
```

**Post-sesión:**
```bash
npm run dev
# Verificar: http://localhost:3000
# Debe mostrar Home con hero, categorías, productos destacados
# Carrito debe funcionar (abrir, agregar, quitar items)
```

---

### 🔷 SESIÓN 5: Panel Administrativo
**Agente**: `frontend-developer`
**Contexto**: `.opencode/context/babystar-admin.md`
**Tokens estimados**: ~10,000

```
activate frontend-developer

Lee /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-admin.md

TAREA: Crea el panel administrativo completo:
1. src/app/admin/layout.tsx (sidebar protegida, logout)
2. src/app/admin/page.tsx (Dashboard con métricas)
3. src/app/admin/cms/page.tsx (editor de contenido en vivo)
4. src/app/admin/productos/page.tsx (listado con tabla)
5. src/app/admin/productos/nuevo/page.tsx (formulario de alta)
6. src/app/admin/pedidos/page.tsx (listado de órdenes)
7. src/app/admin/usuarios/page.tsx (listado de usuarios)

REGLAS:
- TODAS las páginas admin verifican sesión al inicio
- Redirigir a /login si no es ADMIN/SUPER_ADMIN
- Server Actions protegidas con verificación de rol
- revalidatePath después de mutaciones
- Tablas con glass-card, badges de estado con colores consistentes
- Dashboard: stats cards, alertas de stock bajo, pedidos recientes
```

**Post-sesión:**
```bash
# Login en http://localhost:3000/login
# Ir a http://localhost:3000/admin
# Verificar: métricas, CMS, productos, pedidos, usuarios
```

---

### 🔷 SESIÓN 6: Páginas adicionales (Tienda, Producto, Checkout)
**Agente**: `frontend-developer`
**Contexto**: `.opencode/context/babystar-frontend.md` (secciones restantes)
**Tokens estimados**: ~8,000

```
activate frontend-developer

Lee /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-frontend.md

TAREA: Completa las páginas faltantes del storefront:
1. src/app/tienda/page.tsx (catálogo con filtros SSR)
2. src/app/producto/[id]/page.tsx (detalle de producto SSR)
3. src/app/carrito/page.tsx (página de carrito completa)
4. src/app/checkout/page.tsx (formulario de checkout)
5. src/components/ShopContent.tsx (filtros y grid de tienda)
6. src/components/ProductContent.tsx (detalle con variantes)

REGLAS:
- Tienda: filtros por categoría, búsqueda, destacados, paginación
- Producto: galería de imágenes, selector de variantes, stock en tiempo real
- Checkout: formulario validado, POST a /api/checkout, manejo de errores
- En éxito: mostrar orderId, limpiar carrito
- En error (stock): mostrar mensaje amigable
```

**Post-sesión:**
```bash
# Flujo completo de prueba:
# 1. Ir a /tienda
# 2. Agregar producto al carrito
# 3. Ir a /checkout
# 4. Completar formulario
# 5. Verificar orden creada en /admin/pedidos
# 6. Verificar stock descontado en DB
```

---

### 🔷 SESIÓN 7: Auditoría de Seguridad
**Agente**: `reality-checker`
**Contexto**: `.opencode/context/babystar-debug.md`
**Tokens estimados**: ~5,000

```
activate reality-checker

Lee /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-debug.md

TAREA: Audita TODO el proyecto Baby Star y reporta:

1. Verificar que NO haya datos hardcodeados en frontend
2. Verificar que TODOS los Server Components sean async donde fetchan datos
3. Verificar que TODOS los Client Components tengan 'use client'
4. Verificar que Framer Motion NO esté en Server Components
5. Verificar que Prisma client sea singleton
6. Verificar que checkout use transacción atómica
7. Verificar que auth tenga RBAC funcional
8. Verificar que .env NO esté commiteado (.gitignore)
9. Verificar que next.config.js tenga headers de seguridad
10. Verificar que NO haya console.log con datos sensibles
11. Verificar que las API routes manejen errores con try/catch
12. Verificar que los Server Actions validen sesión antes de ejecutar

REPORTA:
- Lista de vulnerabilidades encontradas (críticas, altas, medias, bajas)
- Recomendaciones específicas para cada problema
- Checklist OWASP completado: sí/no por ítem
```

**Post-sesión:**
```bash
# Aplicar fixes sugeridos por el agente
# Re-hacer build: npm run build
```

---

### 🔷 SESIÓN 8: Optimización de Performance
**Agente**: `performance-benchmarker`
**Contexto**: `.opencode/context/babystar-debug.md` (sección Performance)
**Tokens estimados**: ~4,000

```
activate performance-benchmarker

Lee /home/otic/Escritorio/Emprendimiento_proyecto/.opencode/context/babystar-debug.md

TAREA: Optimiza el proyecto para producción:

1. Agregar revalidate (ISR) a páginas públicas sin él
2. Verificar que React cache() esté en src/lib/data.ts
3. Optimizar imágenes: next/image con sizes correctos, priority en hero
4. Verificar que no haya hydration mismatches
5. Sugerir code splitting para componentes pesados
6. Revisar bundle size con @next/bundle-analyzer
7. Verificar Core Web Vitals esperados

REPORTA:
- Métricas actuales estimadas vs objetivos
- Lista de optimizaciones aplicadas
- Recomendaciones post-MVP
```

---

## 📊 Resumen de sesiones

| # | Agente | Contexto | Tokens | Archivos generados |
|---|--------|----------|--------|-------------------|
| 1 | backend-architect | babystar-prisma.md | ~8K | DB, Docker, Seed, Utils |
| 2 | security-specialist | babystar-auth.md | ~6K | Auth, Middleware, Login, Headers |
| 3 | backend-architect | babystar-api.md | ~7K | API routes, Data layer, Checkout |
| 4 | frontend-developer | design + frontend | ~12K | Storefront, Home, Carrito, Layout |
| 5 | frontend-developer | babystar-admin.md | ~10K | Dashboard, CMS, CRUD Admin |
| 6 | frontend-developer | babystar-frontend.md | ~8K | Tienda, Producto, Checkout page |
| 7 | reality-checker | babystar-debug.md | ~5K | Auditoría de seguridad |
| 8 | performance-benchmarker | babystar-debug.md | ~4K | Optimización de performance |
| **TOTAL** | | | **~60K** | **Proyecto completo** |

> Con 46K tokens disponibles por sesión en MiniMax M2.5 Free, divide las sesiones grandes (4 y 5) en 2 partes si es necesario.

---

## 🚨 Reglas de oro para cada sesión

1. **SIEMPRE** indica la ruta absoluta del archivo de contexto
2. **SIEMPRE** especifica "NO modifiques archivos ya creados" si no es la primera sesión
3. **SIEMPRE** verifica manualmente después de cada sesión (npm run dev, prueba en navegador)
4. **NUNCA** pidas más de 8-10 archivos nuevos en una sola sesión
5. **NUNCA** mezcles backend y frontend en la misma sesión (confunde al agente)
6. **SIEMPRE** guarda el estado entre sesiones con git commits:
   ```bash
   git add .
   git commit -m "Sesion N: [agente] - [descripcion]"
   ```

---

## 🔄 Si necesitas rehacer algo

Si un agente genera código incorrecto:
1. Aborta la sesión (Ctrl+C)
2. Revierte los archivos afectados: `git checkout -- src/app/admin/`
3. Ajusta el prompt con instrucciones más específicas
4. Re-activa el agente con el contexto corregido

---

## 📁 Estructura final esperada del proyecto

```
baby-star/
├── logos/
│   ├── Logo Baby Star.png
│   └── Logo Baby Star fondo blanco.jpeg
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── cms/page.tsx
│   │   │   ├── pedidos/page.tsx
│   │   │   ├── productos/page.tsx
│   │   │   ├── productos/nuevo/page.tsx
│   │   │   ├── usuarios/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── checkout/route.ts
│   │   │   └── products/route.ts
│   │   ├── carrito/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── login/page.tsx
│   │   ├── producto/[id]/page.tsx
│   │   ├── tienda/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── CartSlideOver.tsx
│   │   ├── CategorySection.tsx
│   │   ├── ContentBlock.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductContent.tsx
│   │   └── ShopContent.tsx
│   ├── context/
│   │   └── CartContext.tsx
│   ├── lib/
│   │   ├── data.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── next-auth.d.ts
│   ├── auth.ts
│   └── middleware.ts
├── .env
├── docker-compose.yml
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

# FIN DE LA GUÍA
# Baby Star v2.0 — Full Stack Ecommerce
# OpenCode Zen + MiniMax M2.5 Free
