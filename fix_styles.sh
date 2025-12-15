#!/bin/bash

echo "🎨 Reparando estilos y diseño..."

# Entrar a la carpeta del cliente
cd client

# 1. Crear configuración de PostCSS (Vital para que Tailwind funcione)
cat > postcss.config.js <<EOF
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 2. Asegurar que Tailwind está configurado correctamente
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

# 3. Asegurar que main.jsx importa el CSS (A veces se borra)
cat > src/main.jsx <<EOF
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

echo "✅ Reparación completada."
echo "👉 Ejecuta estos comandos para subir los cambios:"
echo "   git add ."
echo "   git commit -m 'Fix estilos visuales'"
echo "   git push origin main"