import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Imágenes de productos reales desde Unsplash (bebés, ropa infantil, juguetes)
const productImages = {
  manta: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=600&fit=crop",
  set_alimentacion: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop",
  set_higiene: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=600&fit=crop",
  mordedor: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=600&h=600&fit=crop",
  canastilla_azul: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop",
  canastilla_rosa: "https://images.unsplash.com/photo-1519689680058-324335c55eba?w=600&h=600&fit=crop",
  body: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop",
  pijama: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=600&fit=crop",
  sonajero: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=600&h=600&fit=crop",
  babero: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop",
  gorrito: "https://images.unsplash.com/photo-1519689680058-324335c55eba?w=600&h=600&fit=crop",
  calcetines: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=600&fit=crop",
};

async function main() {
  console.log("🌱 Iniciando seed de Baby Star...");

  // Limpiar datos existentes (opcional - descomentar si quieres reset)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.inventoryMovement.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.contentBlock.deleteMany();
  // await prisma.user.deleteMany();

  // 1. Crear usuario admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@babystar.com" },
    update: {},
    create: {
      email: "admin@babystar.com",
      name: "Administrador Baby Star",
      password: adminPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("👤 Admin creado:", admin.email);

  // 2. Crear categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "mantas" },
      update: {},
      create: { name: "Mantas", slug: "mantas", description: "Mantas suaves para bebé" },
    }),
    prisma.category.upsert({
      where: { slug: "sets" },
      update: {},
      create: { name: "Sets", slug: "sets", description: "Sets completos" },
    }),
    prisma.category.upsert({
      where: { slug: "mordedores" },
      update: {},
      create: { name: "Mordedores", slug: "mordedores", description: "Mordedores seguros" },
    }),
    prisma.category.upsert({
      where: { slug: "canastillas" },
      update: {},
      create: { name: "Canastillas", slug: "canastillas", description: "Canastillas de bienvenida" },
    }),
    prisma.category.upsert({
      where: { slug: "ropa" },
      update: {},
      create: { name: "Ropa", slug: "ropa", description: "Ropa para bebé" },
    }),
    prisma.category.upsert({
      where: { slug: "accesorios" },
      update: {},
      create: { name: "Accesorios", slug: "accesorios", description: "Accesorios varios" },
    }),
  ]);
  console.log(`📂 ${categories.length} categorías creadas`);

  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

  // 3. Crear productos con imágenes reales
  const products = [
    {
      name: "Manta Arrullo Estrellas",
      slug: "manta-arrullo-estrellas",
      description: "Manta de arrullo ultra suave con diseño de estrellas. 100% algodón orgánico.",
      price: 36.90,
      compareAtPrice: null,
      stock: 15,
      image: productImages.manta,
      categoryId: catMap.mantas,
      isActive: true,
    },
    {
      name: "Set Alimentación Mamá-Bebé",
      slug: "set-alimentacion-mama-bebe",
      description: "Set completo de alimentación incluyendo biberones, extractor y accesorios.",
      price: 39.90,
      compareAtPrice: null,
      stock: 8,
      image: productImages.set_alimentacion,
      categoryId: catMap.sets,
      isActive: true,
    },
    {
      name: "Set Higiene Completo",
      slug: "set-higiene-completo",
      description: "Set de higiene con termómetro, cortauñas, cepillo y más.",
      price: 44.90,
      compareAtPrice: null,
      stock: 12,
      image: productImages.set_higiene,
      categoryId: catMap.sets,
      isActive: true,
    },
    {
      name: "Mordedor Jellynomicon",
      slug: "mordedor-jellynomicon",
      description: "Mordedor de silicona médica libre de BPA. Texturas variadas.",
      price: 12.90,
      compareAtPrice: null,
      stock: 25,
      image: productImages.mordedor,
      categoryId: catMap.mordedores,
      isActive: true,
    },
    {
      name: "Canastilla Bienvenida Azul",
      slug: "canastilla-bienvenida-azul",
      description: "Canastilla de bienvenida para bebé en tonos azules. Incluye 8 artículos.",
      price: 89.90,
      compareAtPrice: 109.90,
      stock: 3,
      image: productImages.canastilla_azul,
      categoryId: catMap.canastillas,
      isActive: true,
    },
    {
      name: "Canastilla Bienvenida Rosa",
      slug: "canastilla-bienvenida-rosa",
      description: "Canastilla de bienvenida para bebé en tonos rosas. Incluye 8 artículos.",
      price: 89.90,
      compareAtPrice: 109.90,
      stock: 5,
      image: productImages.canastilla_rosa,
      categoryId: catMap.canastillas,
      isActive: true,
    },
    {
      name: "Body Algodón Orgánico Pack 3",
      slug: "body-algodon-organico-pack-3",
      description: "Pack de 3 bodies de algodón orgánico 100%. Suaves y transpirables.",
      price: 24.90,
      compareAtPrice: null,
      stock: 20,
      image: productImages.body,
      categoryId: catMap.ropa,
      isActive: true,
    },
    {
      name: "Pijama Mameluco Invierno",
      slug: "pijama-mameluco-invierno",
      description: "Mameluco de invierno con interior de fleece. Mantiene al bebé calentito.",
      price: 32.90,
      compareAtPrice: null,
      stock: 10,
      image: productImages.pijama,
      categoryId: catMap.ropa,
      isActive: true,
    },
    {
      name: "Sonajero Madera Natural",
      slug: "sonajero-madera-natural",
      description: "Sonajero artesanal de madera natural con acabado seguro para bebés.",
      price: 18.90,
      compareAtPrice: null,
      stock: 7,
      image: productImages.sonajero,
      categoryId: catMap.accesorios,
      isActive: true,
    },
    {
      name: "Babero Impermeable Pack 5",
      slug: "babero-impermeable-pack-5",
      description: "Pack de 5 baberos impermeables con cierre ajustable.",
      price: 16.90,
      compareAtPrice: null,
      stock: 18,
      image: productImages.babero,
      categoryId: catMap.accesorios,
      isActive: true,
    },
    {
      name: "Gorrito Recién Nacido",
      slug: "gorrito-recien-nacido",
      description: "Gorrito suave para recién nacido. Protege la fontanela.",
      price: 9.90,
      compareAtPrice: null,
      stock: 30,
      image: productImages.gorrito,
      categoryId: catMap.ropa,
      isActive: true,
    },
    {
      name: "Calcetines Antideslizantes Pack 6",
      slug: "calcetines-antideslizantes-pack-6",
      description: "Pack de 6 pares de calcetines con suela antideslizante.",
      price: 14.90,
      compareAtPrice: null,
      stock: 22,
      image: productImages.calcetines,
      categoryId: catMap.accesorios,
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        image: product.image, // Asegurar que la imagen se actualice
      },
      create: product,
    });
  }
  console.log(`🛍️ ${products.length} productos creados/actualizados con imágenes`);

  // 4. Crear ContentBlocks para el CMS
  const contentBlocks = [
    {
      key: "hero_title",
      title: "Título Principal Hero",
      content: "Todo lo mejor para tu bebé",
      type: "text" as const,
      page: "home",
      isActive: true,
    },
    {
      key: "hero_subtitle",
      title: "Subtítulo Hero",
      content: "Ropa, accesorios y juguetes seleccionados con amor para los más pequeños",
      type: "text" as const,
      page: "home",
      isActive: true,
    },
    {
      key: "hero_cta",
      title: "Texto Botón Hero",
      content: "Descubrir productos",
      type: "text" as const,
      page: "home",
      isActive: true,
    },
    {
      key: "about_title",
      title: "Título Sección Nosotros",
      content: "Nuestra Historia",
      type: "text" as const,
      page: "home",
      isActive: true,
    },
    {
      key: "about_text",
      title: "Texto Sección Nosotros",
      content: "Baby Star nació con la misión de ofrecer productos de la más alta calidad para tu bebé. Seleccionamos cada artículo con amor y dedicación.",
      type: "html" as const,
      page: "home",
      isActive: true,
    },
    {
      key: "newsletter_title",
      title: "Título Newsletter",
      content: "Únete a la familia Baby Star",
      type: "text" as const,
      page: "home",
      isActive: true,
    },
    {
      key: "newsletter_text",
      title: "Texto Newsletter",
      content: "Recibe ofertas exclusivas y novedades directamente en tu correo.",
      type: "text" as const,
      page: "home",
      isActive: true,
    },
    {
      key: "footer_address",
      title: "Dirección Footer",
      content: "Calle Estrella 123, 28001 Madrid, España",
      type: "text" as const,
      page: "global",
      isActive: true,
    },
    {
      key: "footer_phone",
      title: "Teléfono Footer",
      content: "+34 912 345 678",
      type: "text" as const,
      page: "global",
      isActive: true,
    },
  ];

  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: {},
      create: block,
    });
  }
  console.log(`📝 ${contentBlocks.length} bloques de contenido creados`);

  console.log("\n✅ Seed completado exitosamente!");
  console.log("📧 Login admin: admin@babystar.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
