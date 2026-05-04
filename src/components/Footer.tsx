import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gradient text-lg">Baby Star</h3>
            <p className="text-sm text-gray-500 mt-1">Todo lo mejor para tu pequeña estrella</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/tienda" className="hover:text-baby-rose-dark transition-colors">Tienda</Link>
            <Link href="/login" className="hover:text-baby-rose-dark transition-colors">Admin</Link>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-baby-rose fill-baby-rose" /> para los más pequeños
          </p>
        </div>
      </div>
    </footer>
  );
}