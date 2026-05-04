import { Suspense } from "react";
import { ShopContent } from "@/components/ShopContent";
import { getProducts, getCategories } from "@/lib/data";

export default async function TiendaPage({ searchParams }: { searchParams: { category?: string; search?: string; featured?: string; page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const products = await getProducts({ 
    category: searchParams.category, 
    search: searchParams.search,
    featured: searchParams.featured === 'true',
    page,
    limit: 12
  });
  const categories = await getCategories();

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Cargando...</div>}>
      <ShopContent products={products.products} categories={categories} totalPages={products.pages} currentPage={page} />
    </Suspense>
  );
}