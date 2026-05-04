import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import productsData from "../src/data/products.json";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("Start seeding...");

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@babystar.es" },
    update: {},
    create: {
      email: "admin@babystar.es",
      name: "Super Admin",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin user seeded");

  // Content Blocks (CMS Base)
  await prisma.contentBlock.upsert({
    where: { identifier: 'home-hero-title' },
    update: {},
    create: {
      identifier: 'home-hero-title',
      type: 'text',
      content: 'Lo mejor para los más pequeños',
    }
  });

  await prisma.contentBlock.upsert({
    where: { identifier: 'home-hero-subtitle' },
    update: {},
    create: {
      identifier: 'home-hero-subtitle',
      type: 'text',
      content: 'Descubre nuestra selección de ropa, accesorios y juguetes diseñados con amor y materiales de la más alta calidad.',
    }
  });
  console.log("CMS Content Blocks seeded");

  // Insert categories
  for (const cat of productsData.categories) {
    await prisma.category.upsert({
      where: { name: cat.id }, // We'll use the id from JSON as the category name since it's unique
      update: {
        description: cat.description,
      },
      create: {
        name: cat.id,
        description: cat.description,
      },
    });
  }

  console.log("Categories seeded");

  // Insert products and their variants
  for (const prod of productsData.products) {
    const category = await prisma.category.findUnique({
      where: { name: prod.category },
    });

    if (!category) {
      console.error(`Category ${prod.category} not found for product ${prod.name}`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        categoryId: category.id,
        images: prod.images,
        isActive: true,
      },
    });

    // Create a base variant for stock
    if (prod.sizes && prod.sizes.length > 0) {
      for (const size of prod.sizes) {
        if (prod.colors && prod.colors.length > 0) {
          for (const color of prod.colors) {
            await prisma.productVariant.create({
              data: {
                productId: createdProduct.id,
                sku: `SKU-${createdProduct.id}-${size}-${color}`.replace(/\s+/g, "-").toUpperCase(),
                size: size,
                color: color,
                stock: Math.floor(prod.stock / (prod.sizes.length * prod.colors.length)) || 1,
              },
            });
          }
        } else {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              sku: `SKU-${createdProduct.id}-${size}`.replace(/\s+/g, "-").toUpperCase(),
              size: size,
              stock: Math.floor(prod.stock / prod.sizes.length) || 1,
            },
          });
        }
      }
    } else {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          sku: `SKU-${createdProduct.id}-BASE`,
          stock: prod.stock,
        },
      });
    }
  }

  console.log("Products and variants seeded");
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
