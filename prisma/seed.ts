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