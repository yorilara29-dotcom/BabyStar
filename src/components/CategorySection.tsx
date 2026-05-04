'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shirt, Baby, Puzzle } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ropa: Shirt,
  accesorios: Baby,
  juguetes: Puzzle,
};

export function CategorySection({ categories }: { categories: { id: string; name: string; slug: string; description: string | null }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {categories.map((cat, i) => {
        const Icon = iconMap[cat.slug] || Baby;
        return (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={`/tienda?category=${cat.slug}`}>
              <div className="glass-card p-8 text-center group cursor-pointer">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-baby-rose to-baby-mint mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-gray-500 mt-2 text-sm">{cat.description}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}