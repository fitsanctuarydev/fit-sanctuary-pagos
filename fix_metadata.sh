#!/bin/bash

echo "🏷️ Actualizando Título y Favicon..."

# Sobrescribir el index.html con los datos correctos
cat > client/index.html <<EOF
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <!-- Icono personalizado -->
    <link rel="icon" type="image/png" href="/assets/icono.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f0f0f" />
    <meta name="description" content="Plataforma de pagos y preventa exclusiva de Fit Sanctuary Studio." />
    <!-- Título de la pestaña -->
    <title>Fit Sanctuary / Modulo Pagos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

echo "✅ Metadatos actualizados."
echo "👉 Ejecuta: git add . && git commit -m 'Update title and favicon' && git push origin main"