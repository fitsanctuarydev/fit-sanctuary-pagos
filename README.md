🏋️ Fit Sanctuary - Plataforma de Pagos (Preventa)

Plataforma de comercio electrónico diseñada para la venta de membresías y paquetes de preventa de Fit Sanctuary Studio. Integra múltiples pasarelas de pago (Stripe, Mercado Pago, PayPal) y notificaciones automáticas por correo electrónico en una arquitectura segura y escalable.

🚀 Características

Diseño Premium: Interfaz oscura/dorada con Tailwind CSS, alineada a la identidad de marca.

Multi-Pasarela:

💳 Stripe: Pagos directos con tarjeta de crédito/débito.

🤝 Mercado Pago: Integración nativa (Brick) para tarjetas, efectivo (Oxxo) y transferencias.

🌍 PayPal: Soporte para pagos internacionales seguros.

💸 Transferencia Directa: Flujo manual con instrucciones y enlace a WhatsApp para comprobantes.

Seguridad: Arquitectura Backend-for-Frontend (BFF) para ocultar claves secretas.

Notificaciones: Envío automático de recibos vía SMTP (Nodemailer).

Responsive: Totalmente optimizado para móviles y escritorio.

🛠️ Stack Tecnológico

Frontend: React (Vite), Tailwind CSS, Lucide React.

Backend: Node.js, Express.

Integraciones: SDKs oficiales de Stripe, Mercado Pago y PayPal.

Infraestructura: Configurado para despliegue automático en Render.com.

📂 Estructura del Proyecto

El proyecto sigue una estructura de Monorepo para facilitar el despliegue en servicios como Render:

/
├── server.js           # Servidor Node.js (API + Archivos Estáticos)
├── package.json        # Dependencias del Backend y Scripts de Build
└── client/             # Aplicación React (Frontend)
    ├── src/            # Código fuente de React
    ├── public/         # Assets (iconos, imágenes)
    ├── vite.config.js  # Configuración de Vite (Proxy al backend)
    └── ...


⚙️ Variables de Entorno (Environment Variables)

Para que el sistema funcione, es obligatorio configurar las siguientes variables.

1. En Desarrollo (Local - client/.env)

Crea un archivo .env dentro de la carpeta client/ para las claves públicas:

VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_MP_PUBLIC_KEY=TEST-...
VITE_PAYPAL_CLIENT_ID=...


2. En Producción (Render.com)

Agrega estas variables en el panel de "Environment" de tu servicio web:

Variable

Descripción

Ejemplo / Notas

NODE_ENV

Entorno de ejecución

production

STRIPE_SECRET_KEY

Clave secreta de Stripe

sk_live_...

MP_ACCESS_TOKEN

Token de acceso de MP

APP_USR-...

PAYPAL_CLIENT_ID

ID de Cliente PayPal

Copiar de Developer Dashboard

PAYPAL_CLIENT_SECRET

Secreto de PayPal

Copiar de Developer Dashboard

SMTP_HOST

Servidor de correo

smtp.gmail.com

SMTP_PORT

Puerto SMTP

465 (SSL) o 587 (TLS)

SMTP_USER

Correo remitente

tucorreo@gmail.com

SMTP_PASS

Contraseña de aplicación

Ver nota abajo*

VITE_STRIPE_PUBLIC_KEY

Clave pública Stripe

pk_live_...

VITE_MP_PUBLIC_KEY

Clave pública MP

APP_USR-... (Public Key)

VITE_PAYPAL_CLIENT_ID

ID Cliente PayPal (Frontend)

Mismo que arriba

Nota sobre Gmail SMTP: Si usas Gmail, debes generar una "Contraseña de Aplicación" en Google Account > Seguridad. No uses tu contraseña normal.

🚀 Despliegue en Render

Este proyecto está pre-configurado para desplegarse en Render.com.

Crea un nuevo Web Service.

Conecta tu repositorio de GitHub.

Usa la siguiente configuración:

Runtime: Node

Build Command: npm run build

Start Command: npm start

Agrega las variables de entorno mencionadas arriba.

¿Cómo funciona el Build?

El comando npm run build en la raíz ejecuta un script inteligente que:

Instala las dependencias del servidor.

Entra a la carpeta client.

Instala las dependencias de React (incluyendo devDependencies necesarias para Vite).

Construye la aplicación React estática en client/dist.

El servidor (server.js) luego sirve estos archivos estáticos en la ruta / y la API en /api/*.

🐛 Solución de Problemas Comunes

Error 404 en Mercado Pago: Verifica que el amount NO se esté enviando desde el frontend si ya creaste una preferencia en el backend. El sistema actual usa inicialización directa en el frontend para mayor estabilidad.

Error de CORS: El archivo server.js tiene CORS habilitado, y vite.config.js tiene un proxy configurado para desarrollo local.

Estilos rotos: Asegúrate de que Tailwind v3 esté instalado. La versión 4 puede causar conflictos con la configuración actual de PostCSS en Render.

© 2024 Fit Sanctuary Studio. Todos los derechos reservados.