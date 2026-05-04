# Proceso del proyecto Baby Star

## Objetivo general
Evolucionar el proyecto "Baby Star" desde un prototipo estático de frontend hacia una plataforma ecommerce moderna, segura, escalable y administrable.

## Estado general
El proyecto se encuentra en transición de un MVP visual (Next.js, Tailwind, JSON local) a una arquitectura full-stack preparada para backend, base de datos, CMS, autenticación (RBAC) e inventario transaccional.

## Fases

### Fase 1 - Base técnica y estabilización
- **Estado**: completada
- **Objetivo**: Corregir la base de código, renombrar estructura, ajustar identidad de marca a "Baby Star" y establecer documentación base.
- **Entregables**:
  - `proceso.md` creado como bitácora de avance.
  - Errores de tipografía y estructura corregidos (ej. `componets` -> `components`, `CardContext` -> `CartContext`).
  - Referencias a la marca anterior ("Petite Mimí") reemplazadas por "Baby Star".
  - `proyecto-contexto.md` reescrito con el estado real de la arquitectura.
- **Riesgos**: Ninguno crítico. La aplicación es puramente visual hasta ahora.
- **Observaciones**: Ya se puede proceder a la fase de diseño de la base de datos y elección de ORM.

### Fase 2 - Datos y backend base
- **Estado**: completada
- **Objetivo**: Definir esquema de base de datos, crear ORM y migraciones, y preparar capa API.
- **Entregables**:
  - Instalación de Prisma ORM.
  - Creación del archivo `schema.prisma` definiendo Users, Categories, Products, Variants, Inventory y Orders.
  - Archivo `docker-compose.yml` creado para desplegar PostgreSQL localmente.
  - Creación del seed (`prisma/seed.ts`) que mapea el `products.json` al modelo relacional.
  - Creación de primera ruta API para productos en `src/app/api/products/route.ts`.
- **Riesgos**: Para visualizar en frontend es necesario levantar el docker-compose y correr migraciones (`npx prisma db push` o `npx prisma migrate dev`).
- **Observaciones**: La base de datos y esquema están listos. Se aplicó una revisión de UI (glassmorfismo, animaciones y paleta de colores completa: blanco hueso, rosa pastel, verde pastel y azul pastel).

### Fase 3 - Autenticación y roles
- **Estado**: completada
- **Objetivo**: Implementar autenticación segura, RBAC y protección de rutas.
- **Entregables**:
  - Instalación de NextAuth (Auth.js v5) y bcryptjs.
  - Creación de middleware (`src/middleware.ts`) que intercepta y protege rutas bajo `/admin`.
  - Archivos base de autenticación (`src/auth.ts` y tipos extendidos).
  - Página de Login implementando Server Actions y el diseño visual actual (glassmorfismo).
  - Creación del layout base administrativo (`src/app/admin/layout.tsx`) con cierre de sesión.
- **Observaciones**: Ya está asegurado el RBAC con un usuario Admin poblado desde el seed. Próximo objetivo: crear el panel de catálogo y productos reales.

### Fase 4 - Catálogo, inventario y checkout
- **Estado**: completada
- **Objetivo**: Implementar catálogo dinámico, CRUD de productos, inventario transaccional y checkout server-side.
- **Entregables**:
  - Refactorización de `Tienda`, `HomePage` y `Producto` para utilizar Server Components y consultar Prisma (`src/lib/data.ts`).
  - Ruta de checkout (`/api/checkout/route.ts`) implementada usando transacciones (`prisma.$transaction`) para asegurar el inventario.
  - Generación de `InventoryMovement` (OUT) automático durante cada pedido.
  - CRUD base de Productos en Panel Administrador (Listado y Alta) protegiendo SSR con sesión actual.

### Fase 5 - Panel administrativo y CMS
- **Estado**: completada
- **Objetivo**: Proveer un dashboard central para gestión de pedidos, clientes, stock y edición de contenido.
- **Entregables**:
  - Implementación del Dashboard principal (`/admin`) con métricas calculadas en tiempo real desde la BD.
  - Creación de vistas de listado de Pedidos y Usuarios.
  - Generación del sistema CMS básico (`/admin/cms`) modificando en tiempo real los textos del frontend.
  - Frontend conectado para inyectar dinámicamente contenido (`ContentBlock`) en las secciones.

### Fase 6 - Seguridad, observabilidad y calidad
- **Estado**: completada
- **Objetivo**: Prácticas OWASP, rate limiting, logs, tests automatizados y CI/CD.
- **Entregables**:
  - Implementación de Headers de Seguridad HTTP estrictos (HSTS, X-Frame-Options, X-Content-Type-Options) en Next.js.
  - Mitigación de XSS mediante escape de Prisma y validaciones nativas.
