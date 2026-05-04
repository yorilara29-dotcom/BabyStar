import { ProductContent } from "@/components/ProductContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/lib/data";

export default async function ProductPage({ params }: { params: { id: string } }) {
  // En Next.js 15, params es un objeto asíncrono, necesitamos awaited values en el futuro o podemos usarlo tal cual por compatibilidad con v14.
  const productId = parseInt(params.id);
  const products = await getProducts();
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display text-[var(--charcoal)] mb-4">
          Producto no encontrado
        </h1>
        <Button asChild className="bg-[var(--peach-500)] hover:bg-[var(--peach-400)] text-white">
          <Link href="/tienda">Volver a la tienda</Link>
        </Button>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return <ProductContent product={product} relatedProducts={relatedProducts} />;
}
