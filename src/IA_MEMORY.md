# 🤖 AI Memory — Baby Star E-Commerce

> **Archivo de contexto persistente para asistentes de IA.**  
> Incluye estado técnico, decisiones arquitectónicas, problemas resueltos y convenciones del proyecto.  
> **Última actualización:** 2026-04-28  
> **Fase activa:** Post-Fase 6 (Seguridad, observabilidad y calidad) — Estabilización y mantenimiento.

---

## 1. Identidad del Proyecto

| Campo                 | Valor                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Nombre**            | Baby Star                                                                                                       |
| **Tipo**              | Tienda en línea (e-commerce)                                                                                    |
| **Nicho**             | Ropa, accesorios y juguetes para bebés                                                                          |
| **Identidad Visual**  | Paleta pastel (blanco hueso, rosa, verde, azul), glassmorfismo (`.glass`, `.glass-card`), animaciones dinámicas |
| **Repositorio local** | `~/Escritorio/Emprendimiento_proyecto`                                                                          |

---

## 2. Stack Tecnológico

| Capa                 | Tecnología                     | Versión |
| -------------------- | ------------------------------ | ------- |
| Framework            | Next.js (App Router)           | 15.3.7  |
| Lenguaje             | TypeScript                     | 5.8.3   |
| UI                   | React                          | 18.3.1  |
| Estilos              | Tailwind CSS                   | 3.4.17  |
| Componentes UI       | shadcn/ui (style: new-york)    | —       |
| Iconos               | Lucide React                   | —       |
| Gestor de paquetes   | **Bun**                        | 1.3.13  |
| ORM                  | Prisma                         | 7.8.0   |
| Base de datos        | PostgreSQL (Docker local)      | —       |
| Auth                 | Auth.js (NextAuth v5) + bcrypt | —       |
| Session Strategy     | JWT                            | —       |
| Validación / Calidad | Biome, ESLint                  | —       |

> **Nota crítica:** El proyecto fue migrado de `npm` a `Bun` el 2026-04-27 para resolver conflictos con el CLI de shadcn/ui. No usar `npm install` ni mantener `package-lock.json`.

---

## 3. Arquitectura y Decisiones Clave

### 3.1. Estructura de Alias (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
3.2. Configuración shadcn/ui (components.json)
Ruta de componentes: src/components/ui
Ruta de utilidades: src/lib/utils
Base color: zinc
CSS variables: activadas
Icon library: lucide
3.3. Separación Auth / Middleware (Patrón crítico)
Para evitar que PrismaClient se ejecute en el Edge Runtime del middleware, se implementó el patrón de separación de configuración:
Table
Archivo	Runtime	Usa Prisma	Responsabilidad
src/auth.config.ts	Edge + Node	❌ No	Config base de sesión, JWT, callbacks jwt/session, páginas
src/auth.ts	Solo Node	✅ Sí	Providers (Credentials), authorize(), bcrypt, Prisma queries
src/middleware.ts	Edge	❌ No	Importa authConfig desde auth.config.ts, redirecciones por rol
NUNCA importar prisma ni bcrypt en middleware.ts ni en auth.config.ts.
3.4. Prisma Client (src/lib/prisma.ts)
TypeScript
Copy
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
No pasar datasourceUrl ni datasources al constructor. Prisma lee DATABASE_URL automáticamente desde .env.
3.5. RBAC (Role-Based Access Control)
Roles definidos en el schema de Prisma:
USER (cliente)
ADMIN
SUPER_ADMIN
El middleware verifica req.auth.user.role para proteger /admin/*.
3.6. Base de Datos
Docker: docker-compose.yml levanta PostgreSQL local.
Seed: prisma/seed.ts + src/data/products.json (datos simulados temporales).
Variables de entorno: DATABASE_URL en .env.
4. Estado de Módulos
Table
Módulo	Estado	Notas
Storefront Público (Home, Tienda, Producto)	✅ Completado	SSR con Server Components, consulta a BD
Carrito de Compras	✅ Completado	React Context + localStorage (transición)
Checkout Transaccional	✅ Completado	/api/checkout con validación y descuento de stock atómico
Autenticación (Login/Logout)	✅ Completado	NextAuth v5 + Server Actions
Middleware de Roles	✅ Completado	Protege /admin, redirecciones según rol
Dashboard Admin Base	✅ Completado	Métricas, listados de usuarios/pedidos
CRUD Productos (Admin)	✅ Completado	Crear, editar, eliminar productos
CMS (ContentBlock)	✅ Completado	Edición en vivo de contenido del storefront
Seguridad OWASP (Headers)	✅ Completado	next.config.js con security headers
Pagos Reales	⏳ Pendiente	Stripe o PayPal — próxima fase prioritaria
5. Log de Problemas Resueltos
2026-04-27 — Error: Module not found: Can't resolve '@/components/ui/button'
Causa: Faltaban todos los componentes shadcn/ui en src/components/ui/.
Causa raíz secundaria: El CLI de shadcn detectaba bun.lock pero no existía el binario bun en el sistema (spawn bun ENOENT).
Solución:
Instalar Bun globalmente: npm install -g bun
Eliminar package-lock.json
Reinstalar dependencias: bun install
Instalar componentes: npx shadcn add button input select sheet
Reiniciar servidor con bun dev
2026-04-27 — Error: PrismaClientConstructorValidationError: Unknown property datasourceUrl
Causa: Prisma estaba en versión antigua (pre-v5) donde datasourceUrl no existía en el constructor.
Solución:
Actualizar Prisma: bun add @prisma/client@latest prisma@latest (quedó en v7.8.0)
Simplificar src/lib/prisma.ts eliminando datasourceUrl del constructor
Regenerar cliente: bunx prisma generate
2026-04-27 — Error: Prisma en Edge Runtime (Middleware)
Causa: middleware.ts importaba auth desde auth.ts, que a su vez importaba prisma. Next.js ejecuta el middleware en Edge Runtime, donde Prisma no está disponible.
Solución: Separar configuración en auth.config.ts (sin Prisma) y hacer que middleware.ts importe solo authConfig. auth.ts mantiene el provider Credentials + Prisma + bcrypt.
6. Convenciones de Desarrollo
6.1. Comandos estándar (usar SIEMPRE con Bun)
bash
Copy
# Instalar dependencias
bun install

# Servidor de desarrollo
bun dev

# Instalar componente shadcn
npx shadcn add <componente>

# Prisma
bunx prisma generate
bunx prisma db seed
bunx prisma migrate dev
6.2. Reglas de código
Componentes en src/components
Utilidades en src/lib
Contextos en src/context
Tipos extendidos en src/types
Server Actions en actions.ts dentro de cada ruta admin
Prohibido usar JSON estático (products.json) en fases avanzadas (ya se consulta BD)
Prohibido asumir backend existente sin verificar
6.3. Nomenclatura
Todo el proyecto se firma como Baby Star
Variables de color Tailwind personalizadas deben respetar la paleta pastel institucional
7. Contexto de la Última Sesión (2026-04-27)
Se completó la estabilización del entorno de desarrollo tras la migración a Bun. Se resolvieron errores en cascada relacionados con:
Componentes shadcn/ui faltantes.
Incompatibilidad de versión de Prisma.
Ejecución de Prisma en Edge Runtime.
El proyecto compila y el servidor inicia correctamente con bun dev. La arquitectura de autenticación quedó robustecida con la separación auth.config.ts / auth.ts.
8. Próximos Pasos Sugeridos
Verificar que bun dev levante sin errores y que la navegación básica funcione (/, /tienda, /login, /admin).
Integración de Pagos: Evaluar Stripe vs PayPal para el checkout transaccional existente.
Observabilidad: Considerar logging estructurado (Winston, Pino) para el backend.
Testing: Agregar tests unitarios para el authorize() de Credentials y el descuento de stock en checkout.
Optimización de imágenes: Revisar configuración de next/image para productos.
9. Notas para la IA
Cuando se me proporcione este archivo como contexto inicial, debo:
Asumir que el gestor de paquetes es Bun, no npm.
Respetar la separación de auth.config.ts vs auth.ts — nunca sugerir importar Prisma en el middleware.
Mantener la identidad visual de Baby Star (paleta pastel, glassmorfismo).
Verificar la existencia de archivos antes de asumir que el backend está implementado.
Actualizar este archivo (AI_MEMORY.md) si se completan nuevas fases o se toman decisiones arquitectónicas importantes.
No exponer IDs de memoria interna ni referencias a herramientas del sistema.
```
