# Baby Star — Contexto: Base de Datos & Infraestructura
# Agente recomendado: backend-architect
# ================================================================

## Objetivo
Crear la capa de datos completa: PostgreSQL con Docker, Prisma ORM, seed idempotente y utilidades base.

## Stack
- PostgreSQL 16 (Docker)
- Prisma ORM 6.6.0
- tsx (para seed ESM)
- Zod (validación de seed)
- bcryptjs (hash de contraseñas en seed)

## Archivos a crear

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

### .env (NO commitear)
```
DATABASE_URL="postgresql://babystar:babystar_secure_2026@localhost:5432/babystar?schema=public"
DIRECT_URL="postgresql://babystar:babystar_secure_2026@localhost:5432/babystar?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="baby-star-super-secret-key-min-32-chars-long-2026"
NODE_ENV="development"
```

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
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
  password      String?
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
  id           String    @id @default(cuid())
  name         String
  slug         String    @unique
  description  String    @db.Text
  price        Decimal   @db.Decimal(10, 2)
  comparePrice Decimal?  @db.Decimal(10, 2)
  sku          String    @unique
  images       String[]
  categoryId   String
  category     Category  @relation(fields: [categoryId], references: [id])
  variants     Variant[]
  inventory    Inventory?
  isActive     Boolean   @default(true)
  isFeatured   Boolean   @default(false)
  tags         String[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  orderItems   OrderItem[]

  @@index([categoryId])
  @@index([isActive])
  @@index([isFeatured])
}

model Variant {
  id        String    @id @default(cuid())
  productId String
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String
  sku       String    @unique
  price     Decimal?  @db.Decimal(10, 2)
  inventory Inventory?
  createdAt DateTime  @default(now())

  @@index([productId])
}

model Inventory {
  id        String    @id @default(cuid())
  productId String?   @unique
  product   Product?  @relation(fields: [productId], references: [id], onDelete: Cascade)
  variantId String?   @unique
  variant   Variant?  @relation(fields: [variantId], references: [id], onDelete: Cascade)
  quantity  Int       @default(0)
  reserved  Int       @default(0)
  lowStock  Int       @default(5)
  updatedAt DateTime  @updatedAt

  movements InventoryMovement[]
}

model InventoryMovement {
  id          String       @id @default(cuid())
  inventoryId String
  inventory   Inventory    @relation(fields: [inventoryId], references: [id])
  type        MovementType
  quantity    Int
  reason      String?
  orderId     String?
  createdAt   DateTime     @default(now())
  createdBy   String?

  @@index([inventoryId])
  @@index([orderId])
}

model Order {
  id              String        @id @default(cuid())
  userId          String?
  user            User?         @relation(fields: [userId], references: [id])
  status          OrderStatus   @default(PENDING)
  total           Decimal       @db.Decimal(10, 2)
  subtotal        Decimal       @db.Decimal(10, 2)
  tax             Decimal       @db.Decimal(10, 2) @default(0)
  shipping        Decimal       @db.Decimal(10, 2) @default(0)
  items           OrderItem[]
  shippingAddress Json?
  paymentStatus   PaymentStatus @default(PENDING)
  paymentId       String?
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

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
  name      String
  price     Decimal @db.Decimal(10, 2)
  quantity  Int
  total     Decimal @db.Decimal(10, 2)

  @@index([orderId])
  @@index([productId])
}

model ContentBlock {
  id        String      @id @default(cuid())
  key       String      @unique
  value     String      @db.Text
  type      ContentType @default(TEXT)
  section   String      @default("general")
  isActive  Boolean     @default(true)
  updatedAt DateTime    @updatedAt
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

### prisma/seed.ts
```typescript
import { PrismaClient, Role, MovementType } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

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

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categorías creadas");

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

      await tx.inventory.upsert({
        where: { productId: product.id },
        update: { quantity: validated.stock },
        create: {
          productId: product.id,
          quantity: validated.stock,
          lowStock: 5,
        },
      });

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

  for (const block of contentBlocksData) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: { value: block.value },
      create: block,
    });
  }
  console.log("✅ Content Blocks creados");
  console.log("🎉 Seed completado!");
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

### src/lib/prisma.ts
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

## Comandos post-creación
```bash
docker-compose up -d
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

## Reglas críticas
- NUNCA crear múltiples instancias de PrismaClient (usar singleton)
- NUNCA commitear .env
- SIEMPRE usar upsert en seed para idempotencia
- SIEMPRE validar datos de seed con Zod antes de tocar DB
- SIEMPRE usar transacciones atómicas para operaciones relacionadas
