import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, RefreshCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, getCategories, getContentBlock } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [productsResult, safeCategories, heroTitle, heroSubtitle] = await Promise.all([
    getProducts({ limit: 100 }).catch((err) => {
      console.error('[HomePage] Error fetching products:', err);
      return { products: [], total: 0, pages: 0 };
    }),
    getCategories().catch((err) => {
      console.error('[HomePage] Error fetching categories:', err);
      return [];
    }),
    getContentBlock('hero_title').catch(() => null),
    getContentBlock('hero_subtitle').catch(() => null),
  ]);

  const safeProducts = Array.isArray(productsResult.products) ? productsResult.products : [];
  const newProducts = safeProducts.slice(0, 4);
  const saleProducts = safeProducts
    .filter((p) => p.comparePrice && Number(p.comparePrice) > Number(p.price))
    .slice(0, 4);

  return (
    <div className="fade-in">
      <section className="relative bg-gradient-to-br from-baby-rose/20 via-baby-white to-baby-mint/20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-baby-rose rounded-full blur-3xl mix-blend-multiply animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-baby-mint rounded-full blur-3xl mix-blend-multiply animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-baby-sky rounded-full blur-3xl mix-blend-multiply animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block bg-baby-rose/20 text-baby-rose-dark px-4 py-2 rounded-full text-sm font-medium mb-6">
                Nueva colección 2026
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 text-gradient">
                {heroTitle?.value || 'Bienvenido a Baby Star'}
              </h1>
              <p className="text-lg text-gray-600 max-w-lg mb-8">
                {heroSubtitle?.value || 'Todo lo mejor para tu pequeña estrella'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild className="glass-button px-8 py-6 text-base">
                  <Link href="/tienda">
                    Explorar tienda
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="px-8 py-6 text-base rounded-full border-2 border-baby-rose text-baby-rose-dark hover:bg-baby-rose/10">
                  <Link href="/tienda?featured=true">Ver destacados</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-baby-rose/30 rounded-full scale-90" />
                <Image
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"
                  alt="Bebé feliz"
                  fill
                  className="object-cover rounded-full p-4"
                  priority
                />
              </div>
              <div className="absolute top-10 -left-4 glass-card p-4 animate-float">
                <p className="text-2xl font-bold text-gray-900">-20%</p>
                <p className="text-xs text-gray-500">Primera compra</p>
              </div>
              <div className="absolute bottom-10 -right-4 glass-card p-4 animate-slide-up">
                <p className="text-sm text-gray-500">Envío gratis</p>
                <p className="text-lg font-bold text-gray-900">+$50</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Envío gratis +$50", desc: "En todos los pedidos" },
              { icon: RefreshCw, title: "Devolución fácil", desc: "30 días" },
              { icon: Shield, title: "Pago seguro", desc: "SSL certificado" },
              { icon: Heart, title: "Hecho con amor", desc: "Calidad premium" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-baby-rose/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-5 h-5 text-baby-rose-dark" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-baby-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-gradient">
              Explora por categorías
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Encuentra todo lo que necesitas para tu bebé organizado por categorías
            </p>
          </div>

          {safeCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay categorías disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {safeCategories.map((category) => (
                <Link key={category.id} href={`/tienda?category=${category.slug}`} className="group">
                  <div className="glass-card p-8 text-center group cursor-pointer">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-gradient">
                Novedades
              </h2>
              <p className="text-gray-500">Los últimos productos que hemos añadido</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex border-baby-rose text-gray-800 hover:bg-baby-rose/10">
              <Link href="/tienda">Ver todo <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {newProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-baby-mint to-baby-mint-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Primera compra?
          </h2>
          <p className="text-gray-700 text-lg mb-6 max-w-lg mx-auto">
            Obtén un <span className="font-bold">20% de descuento</span> en tu primer pedido
          </p>
          <Button asChild className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base rounded-full font-semibold">
            <Link href="/tienda">Comprar ahora</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-baby-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-block bg-baby-rose text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                Ofertas
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-gradient">
                Productos en oferta
              </h2>
            </div>
            <Button asChild variant="outline" className="hidden md:flex border-baby-rose text-baby-rose-dark hover:bg-baby-rose/10">
              <Link href="/tienda">Ver ofertas <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {saleProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay ofertas disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}