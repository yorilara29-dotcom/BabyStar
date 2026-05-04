'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-baby-rose/20 via-baby-white to-baby-mint/20 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-baby-rose rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-baby-mint rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-baby-sky rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-baby-rose-dark" />
            <span className="text-sm font-medium text-gray-700">Nueva Colección 2026</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gradient leading-tight">{title}</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tienda"><button className="glass-button text-gray-800">Explorar Tienda</button></Link>
            <Link href="/tienda?featured=true"><button className="px-6 py-3 rounded-full font-medium border-2 border-baby-rose text-baby-rose-dark hover:bg-baby-rose/10 transition-all">Ver Destacados</button></Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}