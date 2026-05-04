import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-[#2D3436] text-white">
      {/* Newsletter */}
      <div className="bg-[#FF8B5C] py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-display mb-2">
            Únete a nuestra familia
          </h3>
          <p className="text-white/90 font-body mb-6 max-w-md mx-auto">
            Recibe ofertas exclusivas, novedades y un 10% de descuento en tu
            primer pedido.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Tu email"
              className="bg-white/20 border-white/30 placeholder:text-white/70 text-white focus:bg-white/30"
            />
            <Button className="bg-white text-[#FF8B5C] hover:bg-white/90 px-8 font-body whitespace-nowrap">
              Suscribirme
            </Button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h4 className="text-2xl font-display mb-4">Baby Star</h4>
            <p className="text-white/70 font-body text-sm leading-relaxed mb-6">
              Ropa y accesorios para bebés con amor. Materiales de calidad,
              diseños únicos y todo el cariño para los más pequeños.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF8B5C] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF8B5C] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-display text-lg mb-4">Tienda</h5>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  href="/tienda?category=ropa"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Ropa
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda?category=accesorios"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Accesorios
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda?category=alimentacion"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Alimentación
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda?category=juguetes"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Juguetes
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda?sale=true"
                  className="text-[#FFAB85] hover:text-white transition-colors"
                >
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h5 className="font-display text-lg mb-4">Información</h5>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  href="/nosotros"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Envíos y devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-display text-lg mb-4">Contacto</h5>
            <ul className="space-y-4 font-body text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FFAB85] flex-shrink-0 mt-0.5" />
                <span className="text-white/70">
                  Calle Gran Vía 123
                  <br />
                  28013 Madrid, España
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FFAB85]" />
                <a
                  href="tel:+34912345678"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  +34 912 345 678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FFAB85]" />
                <a
                  href="mailto:hola@petitemimi.es"
                  className="text-white/70 hover:text-[#FFAB85] transition-colors"
                >
                  hola@petitemimi.es
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm font-body">
            © 2026 Baby Star. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
              alt="Visa"
              className="h-6 opacity-70"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png"
              alt="Mastercard"
              className="h-6 opacity-70"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png"
              alt="PayPal"
              className="h-6 opacity-70"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
