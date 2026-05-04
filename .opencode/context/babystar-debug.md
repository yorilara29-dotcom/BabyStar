# Baby Star — Contexto: Debug, Seguridad & Optimización
# Agentes recomendados: reality-checker, performance-benchmarker
# ================================================================

## Objetivo
Auditoría de seguridad, detección de errores comunes, optimización de performance y checklist de calidad.

## Errores comunes y soluciones

### 1. Prisma Client no generado
```bash
npx prisma generate
```

### 2. Base de datos no existe o no responde
```bash
docker-compose up -d
npx prisma migrate dev --name init
npm run db:seed
```

### 3. Error "Cannot find module '@prisma/client'"
```bash
npm install
npx prisma generate
```

### 4. Hot reload rompe Prisma (múltiples instancias)
**Causa**: Next.js hot reload crea nuevas instancias de PrismaClient
**Solución**: Usar singleton pattern en `src/lib/prisma.ts` (ya incluido en babystar-prisma.md)

### 5. Framer Motion en Server Component
**Error**: `useRef only works in Client Components`
**Solución**: Agregar `'use client'` al inicio del archivo
**Regla**: Cualquier componente con hooks, eventos, o Framer Motion DEBE ser Client Component

### 6. Checkout atómico falla por "Stock insuficiente"
**Comportamiento**: CORRECTO. Previene overselling.
**Solución**: Verificar stock antes de enviar al checkout. Mostrar mensaje amigable al usuario.

### 7. Auth session no persiste / middleware bloquea todo
**Causa**: `session.strategy` no es 'jwt' o falta `NEXTAUTH_SECRET`
**Solución**: 
- Asegurar `session: { strategy: 'jwt' }` en auth.ts
- Asegurar `NEXTAUTH_SECRET` en .env (mínimo 32 caracteres)
- Reiniciar servidor de desarrollo después de cambiar .env

### 8. Imágenes no cargan (404)
**Causa**: Dominio no está en `next.config.js`
**Solución**: Agregar dominios a `images.domains`:
```javascript
images: {
  domains: ['images.unsplash.com', 'localhost', 'tu-cdn.com'],
}
```

### 9. CSS no aplica colores custom
**Causa**: Tailwind config no está cargando las extensiones
**Solución**: Verificar que `tailwind.config.ts` tenga las colors en `theme.extend.colors`

### 10. "window is not defined" en build
**Causa**: Uso de `window` o `localStorage` en Server Component
**Solución**: Mover a Client Component o usar `useEffect`

---

## Checklist de Seguridad OWASP (OBLIGATORIO)

- [ ] **Headers HTTP**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [ ] **Validación de inputs**: Zod en TODAS las API routes y Server Actions
- [ ] **Hash de passwords**: bcrypt con salt rounds ≥ 12
- [ ] **Transacciones atómicas**: Checkout e inventario en `prisma.$transaction`
- [ ] **RBAC**: Middleware protege /admin, callbacks verifican roles
- [ ] **SQL Injection**: Protegido por Prisma ORM (nunca concatenar strings en queries)
- [ ] **XSS**: React escapa automáticamente, CSP restringe scripts inline
- [ ] **CSRF**: NextAuth maneja tokens CSRF automáticamente
- [ ] **Secrets**: .env NUNCA en git, NEXTAUTH_SECRET ≥ 32 chars
- [ ] **Rate Limiting**: Recomendado `@upstash/ratelimit` para producción
- [ ] **Sanitización**: `sanitizeInput()` para campos de texto libre
- [ ] **File Uploads**: Validar tipos MIME, tamaño máximo, escanear malware

---

## Métricas de Performance Objetivo

| Métrica | Objetivo | Cómo lograrlo |
|---------|----------|---------------|
| First Contentful Paint (FCP) | < 1.8s | SSR + next/image optimizado |
| Largest Contentful Paint (LCP) | < 2.5s | Hero image con `priority`, preload fonts |
| Time to Interactive (TTI) | < 3.8s | Code splitting, lazy load below-fold |
| Cumulative Layout Shift (CLS) | < 0.1 | Dimensiones explícitas en imágenes |
| Total Blocking Time (TBT) | < 200ms | Minimizar JS en cliente, usar Server Components |

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Base de datos
npm run db:studio      # UI visual de Prisma
npm run db:seed        # Poblar datos iniciales
npm run db:reset       # Reset completo + seed
npx prisma migrate dev --name nombre_migration
npx prisma db push     # Para prototipado rápido (sin migraciones)

# Lint y formato
npm run lint
npx biome check --write src/

# Producción local
npm run build && npm start

# Docker
 docker-compose up -d          # Levantar DB
docker-compose down -v        # Destruir DB y volúmenes
docker logs baby-star-db -f   # Ver logs de PostgreSQL
```

---

## Estructura de archivos final esperada

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

## Mejoras para producción (post-MVP)

1. **Pagos**: Integrar Stripe Checkout o MercadoPago
2. **Email**: Resend / SendGrid para confirmaciones de orden
3. **Uploads**: Cloudinary o AWS S3 para imágenes de productos
4. **Búsqueda**: Algolia o Meilisearch para búsqueda full-text
5. **Cache**: Redis para sesiones y cache de productos
6. **Monitoring**: Sentry para errores en producción
7. **Tests**: Jest + React Testing Library + Playwright E2E
8. **CI/CD**: GitHub Actions para lint, test, build y deploy
9. **Analytics**: Vercel Analytics o Plausible
10. **SEO**: Sitemap.xml, robots.txt, structured data JSON-LD
