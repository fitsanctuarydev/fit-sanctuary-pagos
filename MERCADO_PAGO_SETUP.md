# 🔧 Guía Completa: Configuración de Mercado Pago

## 📋 Resumen de Cambios Realizados

Se han implementado las siguientes mejoras:

### ✅ Backend (server.js)
- ✓ Validación robusta de preferencias (título, precio, orderId)
- ✓ Endpoint `/webhooks/mercadopago` para confirmar pagos
- ✓ Manejo de errores mejorado con mensajes claros
- ✓ Soporte para `external_reference` (para rastreo de órdenes)

### ✅ Frontend (App.jsx)
- ✓ Generación automática de ID único por orden (`orderId`)
- ✓ Manejo mejorado del componente `Payment` de Brick
- ✓ Fallback a nueva ventana si el formulario no carga
- ✓ Estados de error y carga más robustos
- ✓ Integración con webhook para confirmación

### ✅ Dependencias
- ✓ @mercadopago/sdk-react: 1.0.6 → 1.6.0 (último estable)
- ✓ mercadopago (backend): 2.0.0 → 2.4.2
- ✓ Otras librerías actualizadas

---

## 🚀 Pasos para Configurar

### Paso 1: Obtener Credenciales de MP

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.mx/developers)
2. Inicia sesión con tu cuenta
3. En el dashboard, busca **"Tus integraciones"** → **"Credenciales"**
4. Verás dos conjuntos:
   - **TEST** (para desarrollo)
   - **LIVE** (para producción)

5. Copia estos valores:
   - `Access Token` (comienza con `APP_USR-`)
   - `Public Key` (comienza con `TEST-` o `APP_USR-`)

### Paso 2: Variables de Entorno en Desarrollo

Crea un archivo `.env` en la **raíz del proyecto** (no en client/):

```env
# Backend
NODE_ENV=development
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx
MP_PUBLIC_KEY=TEST-xxxxxxxxxxxx

# Frontend
VITE_MP_PUBLIC_KEY=TEST-xxxxxxxxxxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_PAYPAL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URLs (desarrollo local)
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# SMTP (opcional para dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-app
```

### Paso 3: Configurar Webhooks en MP

**⚠️ CRÍTICO: Sin esto, los pagos NO se confirmaran**

1. Ve a [MP Developers - Tus integraciones](https://www.mercadopago.com.mx/developers/panel/applications)
2. Selecciona tu aplicación
3. En el menú izquierdo, busca **"Webhooks"**
4. Haz clic en **"Crear nueva notificación"**
5. En el campo URL, pega: `https://tu-dominio.com/webhooks/mercadopago`
6. En "Eventos", selecciona: **payment**
7. Haz clic en **"Guardar"**

**Para desarrollo local** (si quieres testear webhooks):
- Usa un túnel como [ngrok](https://ngrok.com):
  ```bash
  ngrok http 3000
  ```
- Luego agrega el webhook: `https://xxxx-xxxx-xxxx.ngrok.io/webhooks/mercadopago`

### Paso 4: Actualizar Dependencias

En la **raíz del proyecto**:

```bash
npm install
```

En la carpeta **client/**:

```bash
cd client
npm install
npm run build
cd ..
```

### Paso 5: Testear en Desarrollo

Inicia el servidor:

```bash
npm start
```

El servidor correrá en `http://localhost:3000`

**Tarjetas de prueba de MP:**

| Tipo | Número | CVC | Vencimiento |
|------|--------|-----|-------------|
| Visa | 4111 1111 1111 1111 | Cualquiera | Cualquiera futuro |
| Mastercard | 5555 5555 5555 4444 | Cualquiera | Cualquiera futuro |
| Oxxo | - | - | El sistema te redirige a simular Oxxo |

> ℹ️ En **prueba (TEST)** usarás `pk_test_...` y `APP_USR-test_...`

---

## 📊 Flujo Completo de Pago

### 1️⃣ Usuario selecciona producto

```
Frontend → setSelectedPlan()
  ↓
GeneraOrderId: ORD-1702815000000-ABC123XY
```

### 2️⃣ Usuario elige Mercado Pago

```
Frontend → initPayment('mp', plan)
  ↓
POST /api/mp/create-preference
  {
    title: "Paquete 6 Meses",
    price: 2520,  // Con comisión
    orderId: "ORD-1702815000000-ABC123XY",
    userEmail: "usuario@ejemplo.com"
  }
```

### 3️⃣ Backend valida y crea preferencia

```
Backend (server.js)
  ↓
1. Valida inputs
2. Llama a MP API para crear preferencia
3. Almacena: external_reference = orderId
4. Devuelve: { id: "PREF_ID_MERCADOPAGO", init_point: "..." }
```

### 4️⃣ Frontend muestra formulario Brick

```
Frontend → <Payment preferenceId="PREF_ID_MERCADOPAGO" />
  ↓
Usuario completa formulario de pago en el portal
```

### 5️⃣ Usuario completa pago

- **Opción A**: Paga con tarjeta → MP procesa
- **Opción B**: Usa Oxxo → MP genera código
- **Opción C**: Usa SPEI → MP genera referencia

### 6️⃣ MP envía webhook al backend

```
MP → POST /webhooks/mercadopago
{
  id: "123456789",
  type: "payment",
  data: {
    id: "PAYMENT_ID",
    external_reference: "ORD-1702815000000-ABC123XY"
  }
}
```

### 7️⃣ Backend confirma pago

```
Backend
  ↓
1. Valida webhook (firma)
2. Actualiza BD: orden.status = 'paid'
3. Envía email de confirmación
4. Responde: { acknowledged: true }
```

### 8️⃣ Pantalla de éxito

```
Frontend → handleSuccess(orderId)
  ↓
Muestra: "¡Pago confirmado!"
Envía: Email de confirmación
```

---

## 🔍 Debugging & Testing

### Test 1: Verificar que el token es válido

```bash
curl -X GET "https://api.mercadopago.com/v1/me" \
  -H "Authorization: Bearer APP_USR-xxxx"
```

**Respuesta esperada:** Tu información de cuenta

### Test 2: Crear una preferencia manualmente

```bash
curl -X POST "https://api.mercadopago.com/checkout/preferences" \
  -H "Authorization: Bearer APP_USR-xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Test",
        "quantity": 1,
        "unit_price": 100
      }
    ]
  }'
```

**Respuesta esperada:** Objeto con `id` y `init_point`

### Test 3: Ver logs en consola

**Frontend** (navegador F12 → Console):
```
✓ Preferencia MP creada: PREF_ID_XXXX
✓ Mercado Pago listo (Orden: ORD-...)
📤 Pago iniciado en MP (Orden: ORD-...)
```

**Backend** (terminal):
```
✓ Preferencia MP creada: PREF_ID_XXXX (Orden: ORD-...)
📩 Webhook MP recibido: payment (ID: 123456789)
✓ Webhook de pago reconocido: PAYMENT_ID
```

---

## ⚠️ Problemas Comunes

### Problema: "Error creando preferencia"

**Causas:**
- ❌ Token expirado o inválido
- ❌ Credenciales no coinciden (TEST vs LIVE)
- ❌ Validación fallando (precio ≤ 0, title vacío)

**Solución:**
1. Verifica el token en MP Dashboard
2. Revisa los logs del backend
3. Asegúrate que `price > 0`

### Problema: "El formulario de MP no aparece"

**Causas:**
- ❌ Public Key inválida
- ❌ SDK no inicializado correctamente
- ❌ `preferenceId` no es válido

**Solución:**
1. Abre DevTools → Network → busca `/checkout/preferences`
2. Verifica que la respuesta tiene un `id`
3. Usa el fallback: "Pagar en nueva ventana"

### Problema: "El webhook no llega"

**Causas:**
- ❌ Webhook no configurado en MP
- ❌ URL del webhook es incorrecta
- ❌ Tu servidor no es accesible desde internet

**Solución:**
1. Ve a MP → Webhooks
2. Verifica que está activo
3. Para local, usa ngrok:
   ```bash
   ngrok http 3000
   # Webhook: https://xxxxx.ngrok.io/webhooks/mercadopago
   ```
4. Prueba: MP Dashboard → Simular webhook

### Problema: "¿Por qué Mercado Pago se ve en blanco?"

**Causas:**
- ❌ Version vieja del SDK React
- ❌ Navegador sin soporte para iframes

**Solución:**
- Actualizar: `npm install @mercadopago/sdk-react@latest`
- Usar fallback de nueva ventana

---

## 🔐 Seguridad

### Checklist:

- [ ] Token secreto NUNCA en frontend (solo en server.js)
- [ ] Public Key en variables de entorno frontend
- [ ] HTTPS en producción (Render proporciona SSL gratis)
- [ ] Validar `external_reference` en webhook
- [ ] Verificar firma del webhook (TODO: implementar)
- [ ] No loguear tokens completos en consola
- [ ] Rate limiting en `/api/mp/create-preference`

### Implementar Verificación de Firma (Próximo):

```javascript
// server.js
function verifyMPSignature(body, signature, secret) {
  const crypto = require('crypto');
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  return hmac === signature;
}
```

---

## 📞 Soporte

**Recursos Oficiales:**
- [Docs MP Brick](https://www.mercadopago.com.mx/developers/es/docs/checkout-bricks/landing)
- [API Reference](https://www.mercadopago.com.mx/developers/es/reference)
- [Forum MP](https://www.mercadopago.com.mx/developers/es/community)

**Este Proyecto:**
- Revisa: `server.js` (líneas 24-60)
- Revisa: `client/src/App.jsx` (líneas 140-180, 290-370)
- Revisa: `README.md` (Variables de Entorno)

---

## ✨ Cambios Clave Resumidos

| Elemento | Antes | Después |
|----------|-------|---------|
| Validación MP | ❌ Ninguna | ✓ Completa |
| Webhooks | ❌ No existe | ✓ `/webhooks/mercadopago` |
| OrderId | ❌ No existe | ✓ Generado automáticamente |
| Manejo de errores | ❌ Básico | ✓ Robusto |
| SDK MP | ❌ 1.0.6 | ✓ 1.6.0 |
| Confirmación de pago | ❌ Manual | ✓ Automática por webhook |

