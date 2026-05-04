import { notFound } from 'next/navigation';
import { ProductContent } from '@/components/ProductContent';
import { getProductBySlug, getProducts } from '@/lib/data';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return <ProductContent product={product} relatedProducts={relatedProducts} />;
}