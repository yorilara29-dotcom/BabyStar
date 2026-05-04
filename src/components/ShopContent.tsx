'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Search, Grid3X3, LayoutGrid, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function ShopContent({ products: initialProducts, categories: initialCategories, totalPages = 1, currentPage = 1 }: { products: any[], categories: any[], totalPages?: number, currentPage?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const featuredParam = searchParams.get('featured');

  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(initialCategories);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (featuredParam === 'true') {
      result = result.filter((p) => p.isFeatured);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, featuredParam, products]);

  const activeFiltersCount = (searchQuery ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0) + (featuredParam === 'true' ? 1 : 0);

  return (
    <div className="fade-in">
      <div className="bg-gradient-to-r from-baby-rose/20 to-baby-mint/20 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-gradient">
            {featuredParam === 'true' ? 'Destacados' : selectedCategory !== 'all' ? categories.find((c: any) => c.id === selectedCategory)?.name || 'Tienda' : 'Nuestra Tienda'}
          </h1>
          <p className="text-gray-500">{filteredProducts.length} productos encontrados</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-8 glass-card p-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 px-4 py-2 rounded-xl border border-gray-200 focus:border-baby-rose focus:ring-2 focus:ring-baby-rose/20 outline-none transition-all"
            />
          </div>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
            <option value="all">Todas las categorías</option>
            {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre</option>
          </select>

          <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setGridCols(3)} className={`p-2 rounded ${gridCols === 3 ? 'bg-white shadow-sm' : ''}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setGridCols(4)} className={`p-2 rounded ${gridCols === 4 ? 'bg-white shadow-sm' : ''}`}><Grid3X3 className="w-4 h-4" /></button>
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); router.push('/tienda'); }} className="flex items-center gap-1 text-baby-rose-dark hover:underline">
              <X className="w-4 h-4" />Limpiar
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <>
            <div className={`grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button disabled={currentPage <= 1} onClick={() => router.push(`/tienda?page=${currentPage - 1}`)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <span className="px-4 text-gray-600">Página {currentPage} de {totalPages}</span>
                <button disabled={currentPage >= totalPages} onClick={() => router.push(`/tienda?page=${currentPage + 1}`)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 glass-card">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos productos</h3>
            <p className="text-gray-500 mb-4">Intenta con otros filtros o términos de búsqueda</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); router.push('/tienda'); }} className="glass-button">Ver todos los productos</button>
          </div>
        )}
      </div>
    </div>
  );
}