import { prisma } from "@/lib/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    where: { isActive: true },
  });

  return products.map(product => {
    return {
      id: product.id.length > 8
        ? parseInt(product.id.substring(0, 8), 16) || Math.floor(Math.random() * 100000)
        : parseInt(product.id) || Math.floor(Math.random() * 100000),
      dbId: product.id,
      name: product.name,
      price: Number(product.price),
      originalPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      image: product.images[0] || "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600",
      images: product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"],
      category: product.category?.name || "Sin categoría",
      categoryId: product.categoryId || "",
      isNew: false,
      isOnSale: !!product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price),
      rating: 5,
      description: product.description || "",
      sizes: Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) as string[],
      colors: Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[],
      stock: product.variants.reduce((acc, v) => acc + v.stock, 0)
    };
  });
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return categories.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description || "",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"
  }));
}
