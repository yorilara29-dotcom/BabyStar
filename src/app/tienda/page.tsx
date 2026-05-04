import { Suspense } from "react";
import { ShopContent } from "@/components/ShopContent";
import { getProducts, getCategories } from "@/lib/data";

export default async function TiendaPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Cargando...</div>}>
      <ShopContent products={products} categories={categories} />
    </Suspense>
  );
}
