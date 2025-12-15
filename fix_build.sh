#!/bin/bash

echo "🛠️ Arreglando versión de Tailwind para Render..."

# Entrar a la carpeta del cliente
cd client

# 1. Forzar instalación de Tailwind v3 (La versión estable que funciona con este config)
# Esto elimina la v4 que causa el conflicto en Render.
npm install -D tailwindcss@3.4.17 postcss autoprefixer

# 2. Asegurar configuración de PostCSS (Vital)
cat > postcss.config.js <<EOF
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 3. Asegurar configuración de Tailwind
cat > tailwind.config.js <<EOF
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
EOF

echo "✅ Arreglo completado."
echo "👉 Ejecuta estos comandos para subir la corrección:"
echo "   git add ."
echo "   git commit -m 'Downgrade tailwind to v3'"
echo "   git push origin main"