import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, RefreshCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const cmsBlocks = await prisma.contentBlock.findMany();

  const getCms = (id: string, fallback: string) => 
    cmsBlocks.find(b => b.identifier === id)?.content || fallback;
  
  const newProducts = products.slice(0, 4); // For now just grab first 4
  const saleProducts = products
    .filter((p) => p.isOnSale)
    .slice(0, 4);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--peach-50)] via-[var(--cream)] to-[var(--blue-50)] overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--peach-200)] rounded-full blur-3xl mix-blend-multiply animate-pulse duration-[3000ms]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--mint-200)] rounded-full blur-3xl mix-blend-multiply animate-pulse duration-[4000ms]" />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-[var(--blue-200)] rounded-full blur-3xl mix-blend-multiply animate-pulse duration-[3500ms]" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block bg-[#FF8B5C]/10 text-[#FF8B5C] px-4 py-2 rounded-full text-sm font-body mb-6">
                Nueva colección primavera
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#2D3436] leading-tight mb-6">
                {getCms('home-hero-title', 'Lo mejor para los más pequeños')}
              </h1>
              <p className="text-lg text-[#636E72] font-body max-w-lg mb-8">
                {getCms('home-hero-subtitle', 'Descubre nuestra selección de ropa, accesorios y juguetes diseñados con amor y materiales de la más alta calidad.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  className="bg-[#FF8B5C] hover:bg-[#FFAB85] text-white px-8 py-6 text-base rounded-full"
                >
                  <Link href="/tienda">
                    Explorar tienda
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#2D3436] text-[#2D3436] hover:bg-[#2D3436] hover:text-white px-8 py-6 text-base rounded-full"
                >
                  <Link href="/nosotros">Conocer más</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-[#FFDACB] rounded-full scale-90" />
                <Image
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"
                  alt="Bebé feliz"
                  fill
                  className="object-cover rounded-full p-4"
                  priority
                />
              </div>
              {/* Floating badges */}
              <div className="absolute top-10 -left-4 glass-card p-4 animate-bounce">
                <p className="text-2xl font-display text-[#2D3436]">-20%</p>
                <p className="text-xs text-[#636E72] font-body">
                  Primera compra
                </p>
              </div>
              <div className="absolute bottom-10 -right-4 glass-card p-4 slide-up">
                <p className="text-sm font-body text-[#636E72]">Envío gratis</p>
                <p className="text-lg font-display text-[#2D3436]">+60€</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-y border-[#F5F0E8]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Envío gratis +60€",
                desc: "En península",
              },
              {
                icon: RefreshCw,
                title: "Devolución fácil",
                desc: "30 días",
              },
              {
                icon: Shield,
                title: "Pago seguro",
                desc: "SSL certificado",
              },
              {
                icon: Heart,
                title: "Hecho con amor",
                desc: "Calidad premium",
              },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#FFEDE5] rounded-full flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-5 h-5 text-[#FF8B5C]" />
                </div>
                <h3 className="font-display text-[#2D3436] mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#636E72] font-body">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-[#FEFCF9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-[#2D3436] mb-4">
              Explora por categorías
            </h2>
            <p className="text-[#636E72] font-body max-w-md mx-auto">
              Encuentra todo lo que necesitas para tu bebé organizado por
              categorías
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tienda?category=${category.id}`}
                className="group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F5F0E8] img-zoom-container">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D3436]/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-display text-xl mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/80 font-body">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display text-[#2D3436] mb-2">
                Novedades
              </h2>
              <p className="text-[#636E72] font-body">
                Los últimos productos que hemos añadido
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden md:flex border-[#FFDACB] text-[#2D3436] hover:bg-[#FFEDE5]"
            >
              <Link href="/tienda?new=true">
                Ver todo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button
              asChild
              variant="outline"
              className="border-[#FFDACB] text-[#2D3436] hover:bg-[#FFEDE5]"
            >
              <Link href="/tienda?new=true">
                Ver todas las novedades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 bg-gradient-to-r from-[#5FE8C0] to-[#2DD3A5]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            ¿Primera compra?
          </h2>
          <p className="text-white/90 font-body text-lg mb-6 max-w-lg mx-auto">
            Usa el código <span className="font-semibold">BIENVENIDO20</span>{" "}
            para obtener un 20% de descuento en tu primer pedido
          </p>
          <Button
            asChild
            className="bg-white text-[#14B88C] hover:bg-white/90 px-8 py-6 text-base rounded-full"
          >
            <Link href="/tienda">Comprar ahora</Link>
          </Button>
        </div>
      </section>

      {/* Sale Products */}
      <section className="py-16 md:py-24 bg-[#FFF8F5]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-block bg-[#FF8B5C] text-white px-3 py-1 rounded-full text-sm font-body mb-2">
                Ofertas
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-[#2D3436]">
                Productos en oferta
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden md:flex border-[#FF8B5C] text-[#FF8B5C] hover:bg-[#FFEDE5]"
            >
              <Link href="/tienda?sale=true">
                Ver ofertas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button
              asChild
              variant="outline"
              className="border-[#FF8B5C] text-[#FF8B5C] hover:bg-[#FFEDE5]"
            >
              <Link href="/tienda?sale=true">
                Ver todas las ofertas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-[#2D3436] mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María García",
                text: "La calidad de la ropa es increíble. Mi bebé está muy cómodo y los diseños son preciosos.",
                rating: 5,
              },
              {
                name: "Carlos López",
                text: "Envío rapidísimo y el embalaje muy cuidado. Repetiré seguro.",
                rating: 5,
              },
              {
                name: "Ana Martínez",
                text: "Me encanta que todo sea de materiales naturales. Se nota la diferencia.",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="glass-card p-6 border border-white/40 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-[#FFAB85]">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[#636E72] font-body mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-display text-[#2D3436]">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 bg-[#FEFCF9]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display text-[#2D3436] mb-2">
            Síguenos en Instagram
          </h2>
          <p className="text-[#636E72] font-body mb-8">@babystar.es</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300",
              "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300",
              "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300",
              "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300",
              "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
            ].map((img, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <Image src={img} alt="Instagram" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#FF8B5C]/0 group-hover:bg-[#FF8B5C]/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    ♥
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
