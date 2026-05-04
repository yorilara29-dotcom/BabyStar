"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid3X3, LayoutGrid, X } from "lucide-react";

export function ShopContent({ products, categories }: { products: any[], categories: any[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const saleParam = searchParams.get("sale");
  const newParam = searchParams.get("new");

  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by sale
    if (saleParam === "true") {
      result = result.filter((p) => p.isOnSale);
    }

    // Filter by new
    if (newParam === "true") {
      result = result.filter((p) => p.isNew);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Featured: new and on sale first
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.isOnSale && !b.isOnSale) return -1;
          if (!a.isOnSale && b.isOnSale) return 1;
          return 0;
        });
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, saleParam, newParam, products]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
    window.history.pushState({}, "", "/tienda");
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (saleParam === "true" ? 1 : 0) +
    (newParam === "true" ? 1 : 0);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--peach-50)] to-[var(--mint-50)] py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-[var(--charcoal)] mb-4">
            {saleParam === "true"
              ? "Ofertas"
              : newParam === "true"
              ? "Novedades"
              : selectedCategory !== "all"
              ? categories.find((c) => c.id === selectedCategory)
                  ?.name || "Tienda"
              : "Nuestra Tienda"}
          </h1>
          <p className="text-[var(--warm-gray)] font-body max-w-md mx-auto">
            {filteredProducts.length} productos encontrados
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 glass-card p-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--warm-gray)]" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 border-white/40 focus:border-[var(--peach-400)]"
            />
          </div>

          {/* Category filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white/50 border-white/40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-white/50 border-white/40">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="rating">Valoración</SelectItem>
            </SelectContent>
          </Select>

          {/* Grid toggle */}
          <div className="hidden md:flex items-center gap-1 bg-white/40 rounded-lg p-1 border border-white/30">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${gridCols === 3 ? "bg-white shadow-sm" : ""}`}
              onClick={() => setGridCols(3)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${gridCols === 4 ? "bg-white shadow-sm" : ""}`}
              onClick={() => setGridCols(4)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Clear filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-[var(--peach-500)] hover:text-[var(--peach-400)] hover:bg-[var(--peach-50)]"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Active filters badges */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[var(--peach-100)] text-[var(--charcoal)] px-3 py-1 rounded-full text-sm font-body">
                Búsqueda: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-[var(--peach-500)]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 bg-[var(--peach-100)] text-[var(--charcoal)] px-3 py-1 rounded-full text-sm font-body">
                {categories.find((c) => c.id === selectedCategory)
                  ?.name}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-[var(--peach-500)]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {saleParam === "true" && (
              <span className="inline-flex items-center gap-1 bg-[var(--peach-500)] text-white px-3 py-1 rounded-full text-sm font-body">
                En oferta
              </span>
            )}
            {newParam === "true" && (
              <span className="inline-flex items-center gap-1 bg-[var(--mint-300)] text-[var(--charcoal)] px-3 py-1 rounded-full text-sm font-body">
                Novedades
              </span>
            )}
          </div>
        )}

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div
            className={`grid gap-6 ${
              gridCols === 3
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card border border-white/60">
            <div className="w-24 h-24 bg-[var(--peach-50)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[var(--peach-300)]" />
            </div>
            <h3 className="text-xl font-display text-[var(--charcoal)] mb-2">
              No encontramos productos
            </h3>
            <p className="text-[var(--warm-gray)] font-body mb-4">
              Intenta con otros filtros o términos de búsqueda
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[var(--peach-500)] hover:bg-[var(--peach-400)] text-white"
            >
              Ver todos los productos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
