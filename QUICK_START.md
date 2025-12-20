# ⚡ Quick Start - Mercado Pago Setup en 5 Minutos

## 1️⃣ Obtén tus Credenciales (1 min)

1. Ve a: https://www.mercadopago.com.mx/developers/panel/applications
2. Selecciona tu aplicación (o crea una)
3. Copia estos valores:
   - **Access Token**: `APP_USR-xxxx`
   - **Public Key**: `TEST-xxxx`

## 2️⃣ Configura Variables Locales (1 min)

Crea archivo `.env` en la **raíz del proyecto**:

```env
MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
VITE_MP_PUBLIC_KEY=TU_PUBLIC_KEY_AQUI
NODE_ENV=development
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## 3️⃣ Instala Dependencias (2 min)

```bash
npm install
cd client && npm install && cd ..
```

## 4️⃣ Inicia el Servidor (30 seg)

```bash
npm start
```

Abre: http://localhost:3000

## 5️⃣ Testea con Tarjeta de Prueba (30 seg)

1. Selecciona un producto
2. Elige "Mercado Pago"
3. Ingresa tu email
4. Usa esta tarjeta:
   - **Número**: 4111 1111 1111 1111
   - **CVC**: Cualquiera
   - **Vencimiento**: Cualquiera futuro

---

## 🚀 Para Producción en Render

### Paso 1: Actualiza tu repo en GitHub

```bash
git add .
git commit -m "Fix: Mercado Pago integration with webhooks"
git push origin main
```

### Paso 2: Agrega Variables en Render Dashboard

Ve a tu Web Service → Environment:

```
STRIPE_SECRET_KEY=sk_live_...
MP_ACCESS_TOKEN=APP_USR-...
VITE_MP_PUBLIC_KEY=APP_USR-...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
BACKEND_URL=https://tu-proyecto-api.onrender.com
FRONTEND_URL=https://tu-proyecto.onrender.com
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_app
```

### Paso 3: Configura Webhooks en MP

1. Ve a: https://www.mercadopago.com.mx/developers/panel/applications
2. Selecciona tu aplicación
3. Busca "Webhooks" en el menú izquierdo
4. Clic en "Crear nueva notificación"
5. URL: `https://tu-proyecto-api.onrender.com/webhooks/mercadopago`
6. Evento: `payment`
7. Guardar

**⚠️ CRÍTICO: Sin este paso, los pagos no se confirmarán**

### Paso 4: Deploy

Render se desplegará automáticamente cuando hagas push a main. O manualmente: Dashboard → Manual Deploy.

---

## ✅ Verifica que Todo Funciona

### En Consola del Navegador (DevTools F12)

Deberías ver:
```
✓ Preferencia MP creada: PREF_ID_XXXX
✓ Mercado Pago listo (Orden: ORD-...)
📤 Pago iniciado en MP (Orden: ORD-...)
```

### En Terminal del Servidor

Deberías ver:
```
✓ Preferencia MP creada: PREF_ID_XXXX (Orden: ORD-...)
📩 Webhook MP: payment (ID: 123456789)
✓ Webhook de pago reconocido: PAYMENT_ID
```

---

## 🆘 Problemas Comunes

### "Error creando preferencia"
- ✓ Verifica que copiaste el Access Token completo (sin espacios)
- ✓ Verifica que es TEST en desarrollo

### "No veo el formulario de MP"
- ✓ Abre DevTools → Console
- ✓ Busca errores rojos
- ✓ Usa fallback: "Pagar en nueva ventana"

### "El pago se procesa pero no me llega confirmación"
- ✓ Verifica que configuraste webhooks (Paso 3 arriba)
- ✓ Verifica que BACKEND_URL es correcto

---

## 📚 Documentación Completa

- **MERCADO_PAGO_SETUP.md**: Guía detallada (300+ líneas)
- **CAMBIOS_REALIZADOS.md**: Resumen técnico de cambios
- **.env.example**: Plantilla de variables

---

## 🎯 Lo que Cambió

✅ Validación robusta de preferencias
✅ Webhooks para confirmar pagos automáticamente
✅ ID de orden único por transacción
✅ Manejo de errores mejorado
✅ SDK de MP actualizado (1.0.6 → 1.6.0)
✅ Todo en el portal (sin Checkout Pro)

---

## 🔐 Seguridad

- ✓ Token secreto SOLO en backend (server.js)
- ✓ Public Key en variables de entorno
- ✓ HTTPS automático en Render
- ✓ Validación de entrada en servidor

---

**¿Preguntas?** Lee MERCADO_PAGO_SETUP.md para una guía completa.

