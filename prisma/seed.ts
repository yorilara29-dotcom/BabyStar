import { PrismaClient, Role, MovementType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const categoriesData = [
  { name: "Canastillas", slug: "canastillas", description: "Canastillas de bienvenida personalizadas para bebés", order: 1 },
  { name: "Tartas de Pañales", slug: "tartas-panales", description: "Originales tartas de pañales para regalar", order: 2 },
  { name: "Peluches", slug: "peluches", description: "Peluches personalizados bordados con nombre", order: 3 },
  { name: "Mordedores", slug: "mordedores", description: "Portachupetes y mordedores seguros", order: 4 },
  { name: "Sets", slug: "sets", description: "Sets de higiene y alimentación", order: 5 },
  { name: "Chupetes", slug: "chupetes", description: "Pack de chupetes ergonómicos", order: 6 },
  { name: "Mantas", slug: "mantas", description: "Mantas arrullo suaves y cálidas", order: 7 },
];

const productsData = [
  {
    name: "Canastilla Bienvenida Rosa",
    slug: "canastilla-bienvenida-rosa",
    description: "Canastilla de bienvenida en tonos rosa pastel, personalizada con nombre bordado. Incluye body, arrullo, peluche y gorrito. Perfecta para dar la bienvenida a tu bebé.",
    price: 89.90,
    comparePrice: 109.90,
    sku: "BS-CAN-001",
    categorySlug: "canastillas",
    images: ["https://placehold.co/600x400/FFB6C1/FFFFFF?text=Canastilla+Rosa", "https://placehold.co/600x400/FFC0CB/FFFFFF?text=Detalle+Bordado"],
    stock: 5,
    isFeatured: true,
    isActive: true,
    tags: ["bordado", "personalizable", "rosa"],
    lowStock: 5,
  },
  {
    name: "Canastilla Bienvenida Azul",
    slug: "canastilla-bienvenida-azul",
    description: "Canastilla de bienvenida en tonos azul cielo pastel, personalizada con nombre bordado. Incluye body, arrullo, peluche y gorrito. Ideal parababy niño.",
    price: 89.90,
    comparePrice: 109.90,
    sku: "BS-CAN-002",
    categorySlug: "canastillas",
    images: ["https://placehold.co/600x400/87CEEB/FFFFFF?text=Canastilla+Azul", "https://placehold.co/600x400/B0E0E6/FFFFFF?text=Detalle+Bordado"],
    stock: 3,
    isFeatured: true,
    isActive: true,
    tags: ["bordado", "personalizable", "azul"],
    lowStock: 5,
  },
  {
    name: "Tarta de Pañales Unicornio",
    slug: "tarta-panales-unicornio",
    description: "Tarta de pañales en forma de unicornio con colores pastel rosa y lila. Incluye 40 pañales, manta suave y mordedor. Diseño único parababy niña.",
    price: 69.90,
    sku: "BS-TAR-001",
    categorySlug: "tartas-panales",
    images: ["https://placehold.co/600x400/E6E6FA/FFFFFF?text=Tarta+Unicornio", "https://placehold.co/600x400/FFB6C1/FFFFFF?text=Vista+Lateral"],
    stock: 12,
    isFeatured: true,
    isActive: true,
    tags: ["unicornio", "rosa", "regalo"],
    lowStock: 5,
  },
  {
    name: "Tarta de Pañales Arcoíris",
    slug: "tarta-panales-arcoiris",
    description: "Tarta de pañales arcoíris multicolor pastel. Incluye 45 pañales, arrullo y sonajero. Versión neutral perfecta para cualquier bebé.",
    price: 74.90,
    sku: "BS-TAR-002",
    categorySlug: "tartas-panales",
    images: ["https://placehold.co/600x400/FFE4E1/FFFFFF?text=Tarta+Arcoiris", "https://placehold.co/600x400/FFEFD5/FFFFFF?text=Detalle"],
    stock: 8,
    isFeatured: false,
    isActive: true,
    tags: ["arcoiris", "multicolor", "regalo"],
    lowStock: 5,
  },
  {
    name: "Peluche Oso Personalizado",
    slug: "peluche-oso-personalizado",
    description: "Peluche oso defelpa ultra suave bordado con el nombre del bebé. Disponible en rosa, azul y amarillo pastel. Incluye regalo caja.",
    price: 34.90,
    sku: "BS-PEL-001",
    categorySlug: "peluches",
    images: ["https://placehold.co/600x400/DEB887/FFFFFF?text=Oso+Personalizado", "https://placehold.co/600x400/F5DEB3/FFFFFF?text=Bordado+Nombre"],
    stock: 15,
    isFeatured: true,
    isActive: true,
    tags: [" oso", "personalizable", "bordado"],
    lowStock: 5,
  },
  {
    name: "Peluche Conejo Bordado",
    slug: "peluche-conejo-bordado",
    description: "Adorable peluche conejo en tonos pastel mint y rosa. Bordado con nombre del bebé. Tamaño perfecto para abrazar.",
    price: 32.90,
    sku: "BS-PEL-002",
    categorySlug: "peluches",
    images: ["https://placehold.co/600x400/98FB98/FFFFFF?text=Conejo+Bordado", "https://placehold.co/600x400/FFB6C1/FFFFFF?text=Detalle+Felpa"],
    stock: 7,
    isFeatured: false,
    isActive: true,
    tags: ["conejo", "personalizable", "felpa"],
    lowStock: 5,
  },
  {
    name: "Portachupetes Arcoíris",
    slug: "portachupetes-arcoiris",
    description: "Portachupetes/elástico con diseño de arcoíris en tonos pastel. Ajustable, lavable y seguro. Incluye 2 cadenitas.",
    price: 14.90,
    sku: "BS-MOR-001",
    categorySlug: "mordedores",
    images: ["https://placehold.co/600x400/FFDAB9/FFFFFF?text=Portachupetes", "https://placehold.co/600x400/FFE4B5/FFFFFF?text=Detalle"],
    stock: 25,
    isFeatured: false,
    isActive: true,
    tags: ["arcoiris", "silicona", "seguro"],
    lowStock: 5,
  },
  {
    name: "Mordedor Jellynomicon",
    slug: "mordedor-jelly",
    description: "Mordedor Jellynomicon en forma de estrella y corazón. Tonos pastel fresa y melocotón. 100% seguro, sin BPA.",
    price: 12.90,
    sku: "BS-MOR-002",
    categorySlug: "mordedores",
    images: ["https://placehold.co/600x400/FFB6C1/FFFFFF?text=Mordedor+Estrella", "https://placehold.co/600x400/FFDAB9/FFFFFF?text=Pack+Detalle"],
    stock: 30,
    isFeatured: false,
    isActive: true,
    tags: ["jelly", "silicona", "seguro"],
    lowStock: 5,
  },
  {
    name: "Set Higiene Completo",
    slug: "set-higiene-completo",
    description: "Set de higiene en tonos pastel mint con 8 piezas: espejo, peine, cepillo, Tijeras de punta redonda, termómetro, aspirador nasal, bolsa de conservación. Todo en elegante caja.",
    price: 44.90,
    sku: "BS-SET-001",
    categorySlug: "sets",
    images: ["https://placehold.co/600x400/98FB98/FFFFFF?text=Set+Higiene", "https://placehold.co/600x400/E0FFFF/FFFFFF?text=Caja+Completa"],
    stock: 18,
    isFeatured: true,
    isActive: true,
    tags: ["higiene", "complemento", "regalo"],
    lowStock: 5,
  },
  {
    name: "Set Alimentación Mamá-Bebé",
    slug: "set-alimentacion-bebe",
    description: "Set de alimentación en tonos pastel coral y amarillo. Incluye platos, vasos, cubiertos y babero. Diseñado para primeras papillas.",
    price: 39.90,
    sku: "BS-SET-002",
    categorySlug: "sets",
    images: ["https://placehold.co/600x400/FFDAB9/FFFFFF?text=Set+Alimentacion", "https://placehold.co/600x400/FFFACD/FFFFFF?text=Detalle+Piezas"],
    stock: 6,
    isFeatured: false,
    isActive: true,
    tags: ["alimentacion", "初次", "completo"],
    lowStock: 5,
  },
  {
    name: "Pack Chupetes Silicona x3",
    slug: "pack-chupetes-silicona",
    description: "Pack de 3 chupetes ergonómicos de silicona médica. Tonos pastel rosa, azul y amarillo. Tetina ortodóncica, sin BPA.",
    price: 24.90,
    sku: "BS-CHU-001",
    categorySlug: "chupetes",
    images: ["https://placehold.co/600x400/E6E6FA/FFFFFF?text=Pack+Chupetes", "https://placehold.co/600x400/FFE4E1/FFFFFF?text=Colores"],
    stock: 22,
    isFeatured: false,
    isActive: false,
    tags: ["chupetes", "silicona", "pack"],
    lowStock: 5,
  },
  {
    name: "Manta Arrullo Estrellas",
    slug: "manta-arrullo-estrellas",
    description: "Manta arrullo ultra suave con print de estrellas en tonos lavanda y rosa pastel. Medida 75x75cm, ideal para capota de paseo o cuna.",
    price: 38.90,
    sku: "BS-MAN-001",
    categorySlug: "mantas",
    images: ["https://placehold.co/600x400/E6E6FA/FFFFFF?text=Manta+Estrellas", "https://placehold.co/600x400/FFB6C1/FFFFFF?text=Textura+Suave"],
    stock: 14,
    isFeatured: true,
    isActive: true,
    tags: ["arrullo", "estrellas", "suave"],
    lowStock: 5,
  },
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
  console.log(`✅ Admin: ${admin.email}`);

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categoriesData.length} categorías creadas`);

  let productsCreated = 0;
  let lowStockProducts: string[] = [];

  for (const prod of productsData) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    });
    if (!category) {
      console.log(`⚠️ Categoría no encontrada: ${prod.categorySlug}`);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.upsert({
        where: { sku: prod.sku },
        update: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          comparePrice: prod.comparePrice ?? null,
          images: prod.images,
          isFeatured: prod.isFeatured,
          isActive: prod.isActive,
          tags: prod.tags,
          categoryId: category.id,
        },
        create: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          comparePrice: prod.comparePrice ?? null,
          sku: prod.sku,
          images: prod.images,
          isFeatured: prod.isFeatured,
          isActive: prod.isActive,
          tags: prod.tags,
          categoryId: category.id,
        },
      });

      await tx.inventory.upsert({
        where: { productId: product.id },
        update: { quantity: prod.stock, lowStock: prod.lowStock },
        create: {
          productId: product.id,
          quantity: prod.stock,
          lowStock: prod.lowStock,
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
            quantity: prod.stock,
            reason: "Stock inicial - Seed Baby Star",
            createdBy: "system",
          },
        });
      }

      if (prod.stock <= 8) {
        lowStockProducts.push(product.name);
      }
      productsCreated++;
    });
  }
  console.log(`✅ ${productsCreated} productos creados`);

  if (lowStockProducts.length > 0) {
    console.log(`⚠️ Productos con stock bajo (≤8):`);
    lowStockProducts.forEach((name) => console.log(`   - ${name}`));
  }

  const inactiveProducts = productsData.filter((p) => !p.isActive);
  if (inactiveProducts.length > 0) {
    console.log(`❌ Productos inactivos:`);
    inactiveProducts.forEach((p) => console.log(`   - ${p.name}`));
  }

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