# Baby Star — Contexto: Diseño, UI/UX & Estilos
# Agente recomendado: frontend-developer (fase UI) o ui-designer
# ================================================================

## Objetivo
Establecer la identidad visual completa: paleta pastel, glassmorfismo, tipografía, animaciones y componentes base.

## Marca
- **Nombre**: Baby Star
- **Eslogan**: "Todo lo mejor para tu pequeña estrella"
- **Logo**: `/logos/Logo Baby Star.png` y `/logos/Logo Baby Star fondo blanco.jpeg`
- **Tipografía**: Inter (Google Fonts)

## Archivos a crear

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'baby-white': '#FAFAF5',
        'baby-rose': '#F4C2C2',
        'baby-rose-dark': '#E8A0A0',
        'baby-mint': '#B5EAD7',
        'baby-mint-dark': '#9DDAC0',
        'baby-sky': '#A2D2FF',
        'baby-sky-dark': '#8BC4F5',
        'baby-gold': '#FFD700',
        'glass-white': 'rgba(255, 255, 255, 0.25)',
        'glass-border': 'rgba(255, 255, 255, 0.4)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### src/app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-baby-white text-gray-800 antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  .glass {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    border-color: rgba(244, 194, 194, 0.6);
  }

  .glass-button {
    @apply px-6 py-3 rounded-full font-medium transition-all duration-300;
    background: linear-gradient(135deg, rgba(244,194,194,0.9), rgba(181,234,215,0.9));
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.5);
    box-shadow: 0 4px 15px rgba(244,194,194,0.3);
  }

  .glass-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(244,194,194,0.5);
  }

  .text-gradient {
    background: linear-gradient(135deg, #E8A0A0, #9DDAC0, #8BC4F5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

@layer utilities {
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .animate-slide-up {
    animation: slideUp 0.5s ease-out forwards;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### src/app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartSlideOver } from '@/components/CartSlideOver';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Baby Star | Todo lo mejor para tu pequeña estrella',
  description: 'Tienda online de ropa, accesorios y juguetes para bebés.',
  keywords: 'bebe, ropa bebe, juguetes, accesorios, tienda infantil',
  openGraph: {
    title: 'Baby Star',
    description: 'Todo lo mejor para tu pequeña estrella',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-baby-white flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSlideOver />
        </CartProvider>
      </body>
    </html>
  );
}
```

## Reglas de diseño obligatorias
1. **Glassmorfismo real**: `backdrop-filter: blur()` + fondo semitransparente + borde claro
2. **Paleta pastel única**: NO usar colores genéricos de Tailwind (rose-500, etc.) — usar los custom definidos
3. **Gradientes suaves**: Degradados entre rosa, menta y azul pastel
4. **Bordes redondeados**: `rounded-xl` (1rem) o `rounded-2xl` (1.5rem) predominantes
5. **Sombras sutiles**: `rgba(0,0,0,0.04)` a `rgba(0,0,0,0.08)` — nunca sombras duras
6. **Transiciones**: `cubic-bezier(0.4, 0, 0.2, 1)` o `spring` de Framer Motion
7. **Espaciado generoso**: Padding de 1.5rem a 2rem en cards, gap de 1.5rem en grids
8. **Tipografía limpia**: Inter, pesos 400 (body), 500 (labels), 600/700 (headings)
9. **Responsive mobile-first**: sm: 640px, md: 768px, lg: 1024px, xl: 1280px
10. **Iconografía**: Lucide React únicamente, tamaños consistentes (w-5 h-5 para nav, w-6 h-6 para cards)

## Animaciones permitidas
- `animate-float`: Orbes decorativos flotantes
- `animate-fade-in`: Aparecer suavemente
- `animate-slide-up`: Entrada desde abajo
- Framer Motion: `whileHover`, `whileTap`, `AnimatePresence`, `layout`
- NUNCA usar animaciones que causen motion sickness (evitar rotaciones rápidas)
