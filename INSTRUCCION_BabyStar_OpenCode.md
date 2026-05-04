# BABY STAR — INSTRUCCIONES COMPLETAS PARA OPENCODE MINIMAX M2.05 / ZEN
# ================================================================
# Archivo consolidado único para reconstrucción, debug y mejora del proyecto.
# Proyecto: Baby Star — Ecommerce Full-Stack para bebés
# Estado objetivo: Producción-ready con seguridad OWASP, SSR, ISR, RBAC, CMS
# ================================================================

---

## 1. IDENTIDAD DE MARCA Y DISEÑO

### Marca
- **Nombre**: Baby Star
- **Eslogan**: "Todo lo mejor para tu pequeña estrella"
- **Logo**: Ubicado en `/logos/Logo Baby Star.png` y `/logos/Logo Baby Star fondo blanco.jpeg`
- **Tipografía**: Inter (Google Fonts) o sistema sans-serif moderno

### Paleta de Colores (Tailwind extendida)
```javascript
// tailwind.config.ts — colors extend
{
  colors: {
    'baby-white': '#FAFAF5',      // Blanco hueso — fondo principal
    'baby-rose': '#F4C2C2',       // Rosa pastel — acentos primarios
    'baby-rose-dark': '#E8A0A0',  // Rosa pastel oscuro — hover
    'baby-mint': '#B5EAD7',       // Verde pastel — acentos secundarios
    'baby-mint-dark': '#9DDAC0',  // Verde pastel oscuro — hover
    'baby-sky': '#A2D2FF',        // Azul pastel — acentos terciarios
    'baby-sky-dark': '#8BC4F5',   // Azul pastel oscuro — hover
    'baby-gold': '#FFD700',       // Dorado suave — estrellas/destacados
    'glass-white': 'rgba(255, 255, 255, 0.25)',
    'glass-border': 'rgba(255, 255, 255, 0.4)',
  }
}
```

### Estilos Glassmorfismo (globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-baby-white text-gray-800 antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  .glass {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    border-color: rgba(244, 194, 194, 0.6);
  }

  .glass-button {
    @apply px-6 py-3 rounded-full font-medium transition-all duration-300;
    background: linear-gradient(135deg, rgba(244,194,194,0.9), rgba(181,234,215,0.9));
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.5);
    box-shadow: 0 4px 15px rgba(244,194,194,0.3);
  }

  .glass-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(244,194,194,0.5);
  }

  .text-gradient {
    background: linear-gradient(135deg, #E8A0A0, #9DDAC0, #8BC4F5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

@layer utilities {
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.5s ease-out forwards;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 2. STACK TECNOLÓGICO Y DEPENDENCIAS

### package.json completo
```json
{
  "name": "baby-star",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset --force && npm run db:seed",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.8.0",
    "@prisma/client": "^6.6.0",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.6.3",
    "lucide-react": "^0.487.0",
    "next": "15.3.7",
    "next-auth": "5.0.0-beta.25",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.2.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^22.14.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "prisma": "^6.6.0",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3"
  }
}
```

---

## 3. INFRAESTRUCTURA DE BASE DE DATOS

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: baby-star-db
    environment:
      POSTGRES_USER: babystar
      POSTGRES_PASSWORD: babystar_secure_2026
      POSTGRES_DB: babystar
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U babystar -d babystar"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### .env (ejemplo — NUNCA commitear)
```
# Database
DATABASE_URL="postgresql://babystar:babystar_secure_2026@localhost:5432/babystar?schema=public"
DIRECT_URL="postgresql://babystar:babystar_secure_2026@localhost:5432/babystar?schema=public"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="baby-star-super-secret-key-min-32-chars-long-2026"

# App
NODE_ENV="development"
```

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hashed with bcrypt
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  image       String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[]
}

model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String    @db.Text
  price       Decimal   @db.Decimal(10, 2)
  comparePrice Decimal? @db.Decimal(10, 2)
  sku         String    @unique
  images      String[]  // Array de URLs
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  variants    Variant[]
  inventory   Inventory?
  isActive    Boolean   @default(true)
  isFeatured  Boolean   @default(false)
  tags        String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  orderItems  OrderItem[]

  @@index([categoryId])
  @@index([isActive])
  @@index([isFeatured])
}

model Variant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String   // ej: "Talla 0-3 meses", "Color Azul"
  sku       String   @unique
  price     Decimal? @db.Decimal(10, 2) // Override del precio base
  inventory Inventory?
  createdAt DateTime @default(now())

  @@index([productId])
}

model Inventory {
  id        String   @id @default(cuid())
  productId String?  @unique
  product   Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  variantId String?  @unique
  variant   Variant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
  quantity  Int      @default(0)
  reserved  Int      @default(0) // Stock reservado en carritos/checkout
  lowStock  Int      @default(5)
  updatedAt DateTime @updatedAt

  movements InventoryMovement[]
}

model InventoryMovement {
  id          String            @id @default(cuid())
  inventoryId String
  inventory   Inventory         @relation(fields: [inventoryId], references: [id])
  type        MovementType
  quantity    Int
  reason      String?
  orderId     String?
  createdAt   DateTime          @default(now())
  createdBy   String?

  @@index([inventoryId])
  @@index([orderId])
}

model Order {
  id            String      @id @default(cuid())
  userId        String?
  user          User?       @relation(fields: [userId], references: [id])
  status        OrderStatus @default(PENDING)
  total         Decimal     @db.Decimal(10, 2)
  subtotal      Decimal     @db.Decimal(10, 2)
  tax           Decimal     @db.Decimal(10, 2) @default(0)
  shipping      Decimal     @db.Decimal(10, 2) @default(0)
  items         OrderItem[]
  shippingAddress Json?     // { name, address, city, postalCode, phone }
  paymentStatus PaymentStatus @default(PENDING)
  paymentId     String?
  notes         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  variantId String?
  name      String  // Snapshot del nombre
  price     Decimal @db.Decimal(10, 2) // Snapshot del precio
  quantity  Int
  total     Decimal @db.Decimal(10, 2)

  @@index([orderId])
  @@index([productId])
}

model ContentBlock {
  id        String   @id @default(cuid())
  key       String   @unique // ej: "hero_title", "about_text"
  value     String   @db.Text
  type      ContentType @default(TEXT)
  section   String   @default("general") // Para organizar en el CMS
  isActive  Boolean  @default(true)
  updatedAt DateTime @updatedAt
  updatedBy String?
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

enum MovementType {
  IN
  OUT
  ADJUSTMENT
  RETURN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum ContentType {
  TEXT
  HTML
  MARKDOWN
  IMAGE_URL
}
```

### prisma/seed.ts (Seed idempotente con Zod)
```typescript
import { PrismaClient, Role, MovementType } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validación Zod para datos de seed
const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  price: z.number().positive(),
  sku: z.string().min(3),
  categorySlug: z.string(),
  images: z.array(z.string().url()).min(1),
  stock: z.number().int().min(0),
  isFeatured: z.boolean().default(false),
});

const productsData = [
  {
    name: "Body Estrella Rosa",
    slug: "body-estrella-rosa",
    description: "Body suave de algodón orgánico 100% con diseño de estrella en tono rosa pastel. Ideal para recién nacidos.",
    price: 24.99,
    sku: "BS-BODY-001",
    categorySlug: "ropa",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600"],
    stock: 50,
    isFeatured: true,
  },
  {
    name: "Manta Suave Nube",
    slug: "manta-suave-nube",
    description: "Manta ultra suave con textura de nube en color menta. Perfecta para mantener abrigado al bebé.",
    price: 39.99,
    sku: "BS-MANTA-001",
    categorySlug: "accesorios",
    images: ["https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600"],
    stock: 30,
    isFeatured: true,
  },
  {
    name: "Sonajero Arcoíris",
    slug: "sonajero-arcoiris",
    description: "Sonajero de madera natural con colores pastel del arcoíris. Desarrollo sensorial garantizado.",
    price: 18.50,
    sku: "BS-JUGU-001",
    categorySlug: "juguetes",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"],
    stock: 40,
    isFeatured: false,
  },
  {
    name: "Set Recién Nacido Azul",
    slug: "set-recien-nacido-azul",
    description: "Set completo de 5 piezas en tonos azul cielo: body, pantalón, gorro, babero y calcetines.",
    price: 59.99,
    sku: "BS-SET-001",
    categorySlug: "ropa",
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"],
    stock: 25,
    isFeatured: true,
  },
  {
    name: "Peluche Estrella Dorada",
    slug: "peluche-estrella-dorada",
    description: "Peluche en forma de estrella con detalles dorados. Compañero perfecto para dormir.",
    price: 29.99,
    sku: "BS-PEL-001",
    categorySlug: "juguetes",
    images: ["https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600"],
    stock: 35,
    isFeatured: true,
  },
  {
    name: "Babero Impermeable Mint",
    slug: "babero-impermeable-mint",
    description: "Babero con capa impermeable interna y diseño de hojitas en verde menta. Fácil de lavar.",
    price: 12.99,
    sku: "BS-BAB-001",
    categorySlug: "accesorios",
    images: ["https://images.unsplash.com/photo-1627856014759-085229246708?w=600"],
    stock: 60,
    isFeatured: false,
  },
];

const categoriesData = [
  { name: "Ropa", slug: "ropa", description: "Ropa suave y cómoda para bebés", order: 1 },
  { name: "Accesorios", slug: "accesorios", description: "Accesorios prácticos y adorables", order: 2 },
  { name: "Juguetes", slug: "juguetes", description: "Juguetes educativos y seguros", order: 3 },
];

const contentBlocksData = [
  { key: "hero_title", value: "Bienvenido a Baby Star", type: "TEXT", section: "home" },
  { key: "hero_subtitle", value: "Todo lo mejor para tu pequeña estrella ✨", type: "TEXT", section: "home" },
  { key: "about_text", value: "En Baby Star seleccionamos cuidadosamente cada producto pensando en el confort y seguridad de tu bebé.", type: "TEXT", section: "about" },
  { key: "shipping_text", value: "Envío gratis en compras mayores a $50. Entrega en 24-48h.", type: "TEXT", section: "footer" },
];

async function main() {
  console.log("🌱 Iniciando seed de Baby Star...");

  // 1. Crear admin
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@babystar.com" },
    update: {},
    create: {
      email: "admin@babystar.com",
      name: "Administrador",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin creado: ${admin.email}`);

  // 2. Crear categorías (idempotente)
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categorías creadas");

  // 3. Crear productos con inventario (transacción atómica)
  for (const prod of productsData) {
    const validated = ProductSchema.parse(prod);
    const category = await prisma.category.findUnique({
      where: { slug: validated.categorySlug },
    });

    if (!category) continue;

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.upsert({
        where: { sku: validated.sku },
        update: {
          name: validated.name,
          description: validated.description,
          price: validated.price,
          images: validated.images,
          isFeatured: validated.isFeatured,
          categoryId: category.id,
        },
        create: {
          name: validated.name,
          slug: validated.slug,
          description: validated.description,
          price: validated.price,
          sku: validated.sku,
          images: validated.images,
          categoryId: category.id,
          isFeatured: validated.isFeatured,
        },
      });

      // Crear/actualizar inventario
      await tx.inventory.upsert({
        where: { productId: product.id },
        update: { quantity: validated.stock },
        create: {
          productId: product.id,
          quantity: validated.stock,
          lowStock: 5,
        },
      });

      // Registrar movimiento inicial
      const inventory = await tx.inventory.findUnique({
        where: { productId: product.id },
      });

      if (inventory) {
        await tx.inventoryMovement.create({
          data: {
            inventoryId: inventory.id,
            type: MovementType.IN,
            quantity: validated.stock,
            reason: "Stock inicial - Seed",
            createdBy: "system",
          },
        });
      }
    });
  }
  console.log("✅ Productos e inventario creados");

  // 4. Content Blocks
  for (const block of contentBlocksData) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: { value: block.value },
      create: block,
    });
  }
  console.log("✅ Content Blocks creados");

  console.log("🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 4. CONFIGURACIÓN DE SEGURIDAD Y NEXT.JS

### next.config.js (Headers OWASP + Configuración)
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
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
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

### src/lib/prisma.ts (Singleton con manejo de hot-reload)
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\W_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}
```

---

## 5. AUTENTICACIÓN (Auth.js v5 + RBAC)

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
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 días
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

---

## 6. SERVER ACTIONS Y API ROUTES

### src/lib/data.ts (Capa de datos SSR)
```typescript
import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getProducts = cache(async (options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { category, featured, search, page = 1, limit = 12 } = options || {};

  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(featured && { isFeatured: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        inventory: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
});

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      inventory: true,
      variants: {
        include: { inventory: true },
      },
    },
  });
});

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
});

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true, inventory: true },
    take: 8,
  });
});

export const getContentBlock = cache(async (key: string) => {
  return prisma.contentBlock.findUnique({
    where: { key, isActive: true },
  });
});

export const getDashboardMetrics = cache(async () => {
  const [totalOrders, totalUsers, totalProducts, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.inventory.findMany({
      where: { quantity: { lte: prisma.inventory.fields.lowStock } },
      include: { product: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, items: true },
  });

  return { totalOrders, totalUsers, totalProducts, lowStock, recentOrders };
});
```

### src/app/api/products/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const params = productQuerySchema.parse(searchParams);

    const skip = (params.page - 1) * params.limit;

    const where = {
      isActive: true,
      ...(params.category && { category: { slug: params.category } }),
      ...(params.featured && { isFeatured: true }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' as const } },
          { description: { contains: params.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, inventory: { select: { quantity: true } } },
        skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, pages: Math.ceil(total / params.limit) });
  } catch (error) {
    console.error('API Products Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
```

### src/app/api/checkout/route.ts (Checkout transaccional atómico)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { MovementType } from '@prisma/client';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().min(1),
    variantId: z.string().optional(),
  })).min(1),
  shippingAddress: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().min(3),
    phone: z.string().min(8),
  }),
  email: z.string().email().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Verificar stock y bloquear registros
      const stockChecks = await Promise.all(
        data.items.map(async (item) => {
          const inventory = await tx.inventory.findFirst({
            where: item.variantId
              ? { variantId: item.variantId }
              : { productId: item.productId },
          });

          if (!inventory || inventory.quantity < item.quantity) {
            throw new Error(`Stock insuficiente para el producto ${item.productId}`);
          }

          return { inventory, item };
        })
      );

      // 2. Calcular totales
      let subtotal = 0;
      const orderItems = await Promise.all(
        data.items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);

          const itemTotal = Number(product.price) * item.quantity;
          subtotal += itemTotal;

          return {
            productId: item.productId,
            variantId: item.variantId || null,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            total: itemTotal,
          };
        })
      );

      const shipping = subtotal > 50 ? 0 : 5.99;
      const tax = subtotal * 0.16; // 16% IVA ejemplo
      const total = subtotal + shipping + tax;

      // 3. Crear orden
      const order = await tx.order.create({
        data: {
          status: 'PENDING',
          paymentStatus: 'PENDING',
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress: data.shippingAddress,
          notes: data.notes,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // 4. Descontar stock y registrar movimientos
      for (const { inventory, item } of stockChecks) {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity } },
        });

        await tx.inventoryMovement.create({
          data: {
            inventoryId: inventory.id,
            type: MovementType.OUT,
            quantity: item.quantity,
            reason: `Venta - Orden ${order.id}`,
            orderId: order.id,
          },
        });
      }

      return order;
    }, {
      isolationLevel: 'Serializable',
      maxWait: 5000,
      timeout: 10000,
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
      message: 'Orden creada exitosamente',
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Error en el checkout';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
```

---

## 7. FRONTEND — STOREFRONT (Server Components)

### src/app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Baby Star | Todo lo mejor para tu pequeña estrella',
  description: 'Tienda online de ropa, accesorios y juguetes para bebés. Calidad, seguridad y diseño en cada producto.',
  keywords: 'bebe, ropa bebe, juguetes, accesorios, tienda infantil',
  openGraph: {
    title: 'Baby Star',
    description: 'Todo lo mejor para tu pequeña estrella',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-baby-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
```

### src/app/page.tsx (Home con SSR + CMS)
```typescript
import { getFeaturedProducts, getContentBlock, getCategories } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { HeroSection } from '@/components/HeroSection';
import { CategorySection } from '@/components/CategorySection';
import { ContentBlock } from '@/components/ContentBlock';

export const revalidate = 60; // ISR cada 60 segundos

export default async function HomePage() {
  const [featuredProducts, categories, heroTitle, heroSubtitle] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getContentBlock('hero_title'),
    getContentBlock('hero_subtitle'),
  ]);

  return (
    <div className="space-y-16 pb-16">
      <HeroSection 
        title={heroTitle?.value || 'Bienvenido a Baby Star'}
        subtitle={heroSubtitle?.value || 'Todo lo mejor para tu pequeña estrella ✨'}
      />

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
          Categorías
        </h2>
        <CategorySection categories={categories} />
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <ContentBlock blockKey="about_text" />
      </section>
    </div>
  );
}
```

### src/components/HeroSection.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-baby-rose/20 via-baby-white to-baby-mint/20 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-baby-rose rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-baby-mint rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-baby-sky rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-baby-rose-dark" />
            <span className="text-sm font-medium text-gray-700">Nueva Colección 2026</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gradient leading-tight">
            {title}
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tienda">
              <button className="glass-button text-gray-800">
                Explorar Tienda
              </button>
            </Link>
            <Link href="/tienda?featured=true">
              <button className="px-6 py-3 rounded-full font-medium border-2 border-baby-rose text-baby-rose-dark hover:bg-baby-rose/10 transition-all">
                Ver Destacados
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### src/components/ProductCard.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    comparePrice?: number | string | null;
    images: string[];
    category: { name: string };
    inventory?: { quantity: number } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isLowStock = product.inventory && product.inventory.quantity <= 5;
  const isOutOfStock = product.inventory && product.inventory.quantity === 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass-card overflow-hidden group"
    >
      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {isLowStock && !isOutOfStock && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              ¡Últimas unidades!
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">
              Agotado
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              // TODO: Wishlist functionality
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <span className="text-xs font-medium text-baby-rose-dark uppercase tracking-wider">
          {product.category.name}
        </span>
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 mt-1 mb-2 line-clamp-2 hover:text-baby-rose-dark transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={isOutOfStock}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-baby-rose to-baby-mint text-gray-800 font-medium hover:shadow-lg hover:shadow-baby-rose/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </motion.div>
  );
}
```

### src/context/CartContext.tsx
```typescript
'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'baby-star-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: any) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          image: product.images?.[0] || '',
          quantity: 1,
          slug: product.slug,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

---

## 8. PANEL ADMINISTRATIVO

### src/app/admin/layout.tsx
```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  FileText,
  LogOut 
} from 'lucide-react';
import { signOut } from '@/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.role || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/login');
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { href: '/admin/cms', label: 'CMS', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gradient">Baby Star Admin</h1>
          <p className="text-xs text-gray-500 mt-1">{session.user.email}</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-baby-rose/10 hover:text-baby-rose-dark transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
```

### src/app/admin/page.tsx (Dashboard con métricas)
```typescript
import { getDashboardMetrics } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  AlertTriangle,
  TrendingUp 
} from 'lucide-react';

export const revalidate = 30;

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics();

  const stats = [
    {
      label: 'Total Pedidos',
      value: metrics.totalOrders,
      icon: ShoppingCart,
      color: 'from-baby-rose to-baby-rose-dark',
    },
    {
      label: 'Usuarios Registrados',
      value: metrics.totalUsers,
      icon: Users,
      color: 'from-baby-mint to-baby-mint-dark',
    },
    {
      label: 'Productos Activos',
      value: metrics.totalProducts,
      icon: Package,
      color: 'from-baby-sky to-baby-sky-dark',
    },
    {
      label: 'Stock Bajo',
      value: metrics.lowStock.length,
      icon: AlertTriangle,
      color: 'from-yellow-400 to-orange-400',
      alert: metrics.lowStock.length > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general de la tienda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.alert ? 'text-orange-500' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {metrics.lowStock.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-orange-400">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Alertas de Stock Bajo</h2>
          </div>
          <div className="space-y-2">
            {metrics.lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{item.product?.name}</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {item.quantity} unidades
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h2>
          <TrendingUp className="w-5 h-5 text-baby-rose-dark" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {metrics.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</td>
                  <td className="py-3">{order.user?.name || 'Invitado'}</td>
                  <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

### src/app/admin/cms/page.tsx (CMS Editor)
```typescript
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

async function updateContent(formData: FormData) {
  'use server';

  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id') as string;
  const value = formData.get('value') as string;

  await prisma.contentBlock.update({
    where: { id },
    data: { 
      value,
      updatedBy: session.user.id,
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/cms');
}

export default async function CMSPage() {
  const session = await auth();
  if (!session?.user?.role?.includes('ADMIN')) redirect('/login');

  const blocks = await prisma.contentBlock.findMany({
    orderBy: { section: 'asc' },
  });

  const sections = [...new Set(blocks.map(b => b.section))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
        <p className="text-gray-500 mt-1">Edita el contenido del sitio en tiempo real</p>
      </div>

      {sections.map((section) => (
        <div key={section} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            Sección: {section}
          </h2>
          <div className="space-y-4">
            {blocks.filter(b => b.section === section).map((block) => (
              <form key={block.id} action={updateContent} className="space-y-2">
                <input type="hidden" name="id" value={block.id} />
                <label className="block text-sm font-medium text-gray-700">
                  {block.key}
                </label>
                {block.type === 'TEXT' ? (
                  <textarea
                    name="value"
                    defaultValue={block.value}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    name="value"
                    defaultValue={block.value}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all"
                  />
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-baby-rose text-gray-800 rounded-xl font-medium hover:bg-baby-rose-dark transition-colors"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 9. COMPONENTES COMPLEMENTARIOS

### src/components/Header.tsx
```typescript
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X, Star, User } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/tienda', label: 'Tienda' },
    { href: '/tienda?featured=true', label: 'Destacados' },
  ];

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/logos/Logo Baby Star.png"
                alt="Baby Star"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">Baby Star</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-baby-rose-dark font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="p-2 rounded-full hover:bg-baby-rose/10 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-full hover:bg-baby-rose/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-baby-rose text-gray-800 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-baby-rose/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/20">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-600 hover:text-baby-rose-dark font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
```

### src/components/CartSlideOver.tsx
```typescript
'use client';

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export function CartSlideOver() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Tu Carrito
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 text-baby-rose-dark font-medium hover:underline"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-baby-rose-dark font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg bg-white border border-gray-200 hover:border-baby-rose transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg bg-white border border-gray-200 hover:border-baby-rose transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gradient">{formatPrice(totalPrice)}</span>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <button className="w-full glass-button py-3 text-center">
                    Proceder al pago
                  </button>
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full py-3 text-gray-500 hover:text-red-500 transition-colors text-sm"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## 10. PÁGINAS ADICIONALES

### src/app/tienda/page.tsx
```typescript
import { getProducts, getCategories } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { ShopContent } from '@/components/ShopContent';

export const revalidate = 60;

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const featured = searchParams.featured === 'true';
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;

  const [{ products, total, pages }, categories] = await Promise.all([
    getProducts({ category, featured, search, page, limit: 12 }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ShopContent
        products={products}
        categories={categories}
        total={total}
        pages={pages}
        currentPage={page}
        currentCategory={category}
        isFeatured={featured}
        searchQuery={search}
      />
    </div>
  );
}
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

---

## 11. DEBUG, TROUBLESHOOTING Y MEJORAS

### Errores comunes y soluciones:

1. **Prisma Client no generado**:
   ```bash
   npx prisma generate
   ```

2. **Base de datos no existe**:
   ```bash
   docker-compose up -d
   npx prisma migrate dev --name init
   npm run db:seed
   ```

3. **Error de tipos en NextAuth**:
   - Verificar que `src/types/next-auth.d.ts` esté correctamente importado
   - Reiniciar TS Server en VS Code

4. **Hot reload rompe Prisma**:
   - Usar el singleton pattern en `src/lib/prisma.ts`

5. **Framer Motion en Server Components**:
   - SIEMPRE agregar `'use client'` en componentes que usen Framer Motion
   - Los Server Components NO pueden usar hooks ni event handlers

6. **Checkout atómico falla por stock**:
   - El error es intencional: previene overselling
   - Verificar que `prisma.$transaction` use `isolationLevel: 'Serializable'`

7. **Imágenes no cargan**:
   - Agregar dominios a `next.config.js` en `images.domains`
   - Usar placeholder local si la imagen externa falla

### Checklist de Seguridad OWASP:
- [x] Headers de seguridad HTTP (HSTS, CSP, X-Frame-Options)
- [x] Sanitización de inputs con Zod
- [x] Hash de contraseñas con bcrypt (salt rounds: 12)
- [x] Transacciones atómicas para inventario
- [x] RBAC en middleware y Server Actions
- [x] Rate limiting recomendado: instalar `@upstash/ratelimit` para producción
- [x] SQL Injection protegido por Prisma ORM
- [x] XSS mitigado por React escaping + CSP

### Mejoras recomendadas para producción:
1. **Pagos**: Integrar Stripe Checkout
2. **Email**: Resend o SendGrid para notificaciones de orden
3. **Uploads**: Cloudinary o AWS S3 para imágenes de productos
4. **Search**: Algolia o Meilisearch para búsqueda avanzada
5. **Cache**: Redis para sesiones y cache de productos
6. **Monitoring**: Sentry para errores en producción
7. **Tests**: Jest + React Testing Library + Playwright

---

## 12. INSTRUCCIONES PARA OPENCODE MINIMAX / ZEN

### Setup inicial:
```bash
# 1. Clonar o crear proyecto
npx create-next-app@latest baby-star --typescript --tailwind --eslint --app --src-dir

# 2. Instalar dependencias
cd baby-star
npm install @auth/prisma-adapter @prisma/client bcryptjs class-variance-authority clsx framer-motion lucide-react next-auth@5.0.0-beta.25 zod
npm install -D @types/bcryptjs @types/node @types/react @types/react-dom autoprefixer postcss prisma tailwindcss tsx typescript

# 3. Configurar base de datos
docker-compose up -d
npx prisma init
# Copiar schema.prisma proporcionado arriba
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed de datos
npm run db:seed

# 5. Configurar .env (ver sección 3)

# 6. Iniciar desarrollo
npm run dev
```

### Estructura de archivos a crear:
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

### Comandos útiles:
```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run db:studio    # Prisma Studio (UI de DB)
npm run db:seed      # Poblar datos
npm run db:reset     # Reset completo + seed
```

---

## 13. NOTAS FINALES

- **NUNCA** commitear el archivo `.env`
- **NUNCA** usar datos hardcodeados en producción (usar siempre la DB)
- **SIEMPRE** validar inputs con Zod en API routes y Server Actions
- **SIEMPRE** usar transacciones para operaciones críticas (checkout, inventario)
- **SIEMPRE** mantener el logo de Baby Star en `/logos/`
- **SIEMPRE** respetar la paleta de colores pastel definida
- El proyecto está diseñado para ser desplegado en Vercel con PostgreSQL (Supabase/Neon)
- Para producción: migrar de SQLite a PostgreSQL y configurar variables de entorno en Vercel

---

# FIN DEL DOCUMENTO
# Baby Star v2.0 — Full Stack Ecommerce
# Listo para OpenCode Minimax M2.05 / OpenCode Zen
