<div align="center">

<img src="client/public/assets/icono.png" alt="Fit Sanctuary Logo" width="120" />

🏋️ Fit Sanctuary Studio

Plataforma de Pagos & Preventa Exclusiva

<p>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Status-En%2520Producci%C3%B3n-success%3Fstyle%3Dfor-the-badge" alt="Status" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Stack-MERN-blue%3Fstyle%3Dfor-the-badge" alt="Stack" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Pagos-Stripe%2520|%20MercadoPago%20|%20PayPal-009ee3?style=for-the-badge" alt="Pagos" />
</p>

<p>
Una experiencia de comercio electrónico premium, diseñada para la venta de membresías y paquetes de preventa con una arquitectura <b>segura</b>, <b>rápida</b> y <b>elegante</b>.
</p>

</div>

<br />

🌟 Características Principales

Esta plataforma no es solo un formulario de pago; es una extensión de la identidad "Industrial Gold" de Fit Sanctuary.

🎨 Diseño Premium UI/UX: Interfaz oscura con acentos dorados, animaciones suaves y adaptabilidad móvil total (Tailwind CSS v3).

💳 Pasarela Multi-Pago Unificada:

Stripe: Pagos directos con tarjeta de crédito/débito dentro del sitio.

Mercado Pago: Integración nativa (Brick) para tarjetas, efectivo (Oxxo) y transferencias SPEI.

PayPal: Soporte internacional con botones inteligentes.

Transferencia Directa: Flujo manual guiado con subida de comprobantes y enlace directo a WhatsApp.

🛡️ Seguridad BFF (Backend-for-Frontend): Arquitectura que oculta las llaves secretas en el servidor, exponiendo solo lo necesario al cliente.

📧 Sistema de Notificaciones: Envío automático de recibos HTML elegantes vía SMTP (Nodemailer) tras cada compra exitosa.

🛠️ Stack Tecnológico

Componente

Tecnología

Frontend



Backend



Integraciones



Despliegue



📂 Estructura del Proyecto (Monorepo)

El proyecto contiene tanto el servidor como el cliente en un mismo repositorio para facilitar el despliegue en servicios PaaS como Render.

/
├── server.js           # 🧠 Servidor Node.js (API de Pagos + Archivos Estáticos)
├── package.json        # 📦 Dependencias del Backend y Scripts de Build maestros
├── client/             # 🎨 Aplicación React (Frontend)
│   ├── src/            # Código fuente de la interfaz
│   ├── public/         # Assets públicos (iconos, imágenes)
│   ├── vite.config.js  # Configuración de Vite (Proxy hacia el backend)
│   └── .env            # Variables de entorno locales (Solo desarrollo)
└── ...


⚙️ Variables de Entorno

Para que el sistema funcione, es obligatorio configurar las siguientes variables.

1️⃣ En Desarrollo (Local)

Crea un archivo .env dentro de la carpeta client/ para las claves públicas:

VITE_STRIPE_PUBLIC_KEY=pk_test_tu_clave_aqui
VITE_MP_PUBLIC_KEY=TEST-tu_clave_aqui
VITE_PAYPAL_CLIENT_ID=tu_cliente_id_aqui


2️⃣ En Producción (Render.com)

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

Ver nota abajo

VITE_STRIPE_PUBLIC_KEY

Clave pública Stripe

pk_live_...

VITE_MP_PUBLIC_KEY

Clave pública MP

APP_USR-...

VITE_PAYPAL_CLIENT_ID

ID Cliente PayPal

Mismo que arriba

⚠️ Nota sobre Gmail SMTP: Si usas Gmail, debes generar una "Contraseña de Aplicación" en Google Account > Seguridad. No uses tu contraseña normal.

🚀 Guía de Despliegue (Render)

Este proyecto está pre-configurado para desplegarse automáticamente.

Crea un nuevo Web Service en Render.

Conecta tu repositorio de GitHub.

Usa la siguiente configuración de Build:

Runtime: Node

Build Command: npm run build

Start Command: npm start

Agrega las variables de entorno mencionadas arriba.

🧠 ¿Cómo funciona el Build?

El comando npm run build en la raíz ejecuta un script en cadena que:

Instala las dependencias del servidor (npm install).

Entra a la carpeta client.

Instala las dependencias de React (npm install --include=dev).

Construye la aplicación React estática en client/dist.

El servidor (server.js) luego sirve estos archivos estáticos en la ruta / y la API en /api/*.

🐛 Solución de Problemas Comunes

<details>
<summary>❌ Error 400/404 en Mercado Pago</summary>
Verifica que NO estés enviando el campo amount desde el frontend si ya creaste una preferencia (preferenceId) en el backend. El SDK de MP requiere uno u otro, no ambos al mismo tiempo.
</details>

<details>
<summary>❌ Error "vite: not found" en Render</summary>
Asegúrate de que el comando de build incluya --include=dev al instalar las dependencias del cliente, ya que Vite es una dependencia de desarrollo y Render las omite por defecto en producción.
</details>

<details>
<summary>❌ Estilos rotos o gigantes</summary>
Asegúrate de estar usando tailwindcss versión 3.x. La versión 4 puede causar conflictos con la configuración actual de PostCSS en entornos Node estándar.
</details>

<br />

<div align="center">
<p>© 2024 Fit Sanctuary Studio. Todos los derechos reservados.</p>
<p><i>Forging Strength. Sculpting Character.</i></p>
</div>