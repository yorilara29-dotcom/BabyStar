MIGRACIÓN NPM → PNPM - E-COMMERCE FULL-STACK NEXT.JS

## CONTEXTO DEL PROYECTO
Stack tecnológico actual:
Framework: Next.js 15.3.7 (App Router)
Lenguaje: TypeScript 5.8.3
UI: React 18.3.1 + Tailwind CSS 3.4.17 + shadcn/ui + Lucide React
Herramientas: Biome, ESLint
Estado: React Context (CartContext.tsx)
DB: PostgreSQL + Prisma ORM
Auth: Auth.js v5 + bcrypt + JWT + RBAC (SUPER_ADMIN, ADMIN)

text
Arquitectura: Full-Stack con Server Components (SSR), rutas públicas (/tienda, /producto/[id], /carrito, /checkout), Dashboard Admin + CMS.

## TAREA: Migrar npm → pnpm MANTENIENDO FUNCIONALIDAD 100%

**REALIZA ESTOS PASOS EXACTAMENTE EN ORDEN:**

### 1. ANÁLISIS PRE-MIGRACIÓN
Verifica package.json: lista todas las dependencias y scripts

Revisa package-lock.json: confirma versiones exactas instaladas

Chequea .gitignore: asegúrate que no ignore node_modules/pnpm-lock.yaml

Identifica scripts personalizados que usen npm (lint, build, dev, etc.)

text

### 2. INSTALACIÓN LIMPIA PNPM
EJECUTA en terminal (muestra comandos exactos):

rm -rf node_modules package-lock.json

npm cache clean --force

pnpm install

text

### 3. ACTUALIZACIÓN CONFIGURACIÓN
**package.json - Cambia TODOS los scripts:**
```json
{
  "scripts": {
    "dev": "pnpm dev",           // ← CAMBIAR npm → pnpm
    "build": "pnpm build",
    "start": "pnpm start",
    "lint": "pnpm lint",
    "db:push": "pnpm db:push"
  }
}
```

### 4. ARCHIVOS DE CONFIGURACIÓN PNPM
**Crea/actualiza estos archivos:**

**.npmrc**
shamefully-hoist=true
node-linker=hoisted
strict-peer-dependencies=false

text

**pnpm-workspace.yaml** (si es monorepo, sino omite)
```yaml
packages:
  - '.'
```

### 5. VERIFICACIÓN POST-MIGRACIÓN (CRÍTICO)
✅ Dependencias instaladas correctamente
✅ pnpm-lock.yaml generado sin errores
✅ next.config.js/tailwind.config.js/prisma/schema.prisma sin cambios
✅ Scripts ejecutan sin errores (dev, build, lint)
✅ Funcionalidad intacta:
- SSR en /tienda, /producto/[id]
- Carrito + Checkout transaccional
- Auth JWT + RBAC
- Dashboard Admin + CMS

text

### 6. ACTUALIZACIÓN DOCUMENTACIÓN
**README.md - Agrega sección:**
```markdown
## 🚀 Instalación con PNPM (Recomendado)
```bash
pnpm install
pnpm dev
```

## Scripts disponibles:
- `pnpm dev` - Desarrollo
- `pnpm build` - Build de producción
- `pnpm lint` - Linting
```

### 7. COMMITS SEPARADOS
Commit 1: "chore: remove npm lock + migrate to pnpm"
Commit 2: "chore: update scripts + pnpm config"
Commit 3: "docs: update installation instructions"

text

## REQUISITOS OBLIGATORIOS
❌ **NO MODIFIQUES:**
- package.json dependencies/devDependencies
- Configuraciones de Next.js/Prisma/Tailwind/Auth
- Lógica de negocio (carrito, checkout, RBAC)
- Server Components o API routes

✅ **VERIFICA ANTES DE FINALIZAR:**
pnpm dev → ✅ Funciona
pnpm build → ✅ Sin errores
pnpm lint → ✅ Pasa todos los tests
Navegación completa del sitio → ✅ Todo funcional

text

**EJECUTA la migración completa y muestra:**
1. Diferencias package.json antes/después
2. Terminal output de cada comando
3. Pruebas de funcionalidad ejecutadas
4. Archivos nuevos/creados (.npmrc, pnpm-lock.yaml)

¡Migra sin romper nada!
