# MANUAL DE INTEGRACIÓN EVO PAYMENTS
## Fit Sanctuary - Pase a Producción

---

## 1. INFORMACIÓN DE AFILIACIÓN

| Concepto | Valor |
|----------|-------|
| **Nombre de Negocio** | Fit Sanctuary |
| **Número de Afiliación DEMO** | TEST1323002 |
| **Tipo de Integración** | Hosted Session + Embedded Checkout |
| **Número de Versión API** | 100 |
| **URL de Integración** | https://pagos.fitsanctuary.mx |
| **Fecha de Implementación** | 6 de Febrero, 2026 |

---

## 2. TIPO DE INTEGRACIÓN UTILIZADO

**Hosted Session con Embedded Checkout**

- **Descripción**: Implementación segura mediante sesión de pago embebida inline dentro de la página
- **API Version**: 100 (última versión)
- **Operación**: INITIATE_CHECKOUT
- **Ventajas**: 
  - PCI-DSS compliant
  - No almacenamos datos de tarjeta
  - Experiencia de usuario fluida sin ventanas emergentes
  - Seguridad Mastercard Gateway
  - Iframe embebido directamente en la página
  - Soporte completo para 3D Secure (3DS) con callbacks

---

## 3. FLUJO DE PAGO EXITOSO - MASTERCARD

### **Paso 1: Selección de Producto**

**Pantalla**: Página Principal / Catálogo de Membresías
- Usuario visualiza lista de membresías disponibles
- Ejemplo seleccionado: "Pack Pilates 2x - $840 MXN"

**Captura requerida**: Screenshot de la página con productos listados

---

### **Paso 2: Confirmación del Producto y Monto**

**Pantalla**: Carrito / Resumen de Compra
- Visualización del producto seleccionado
- Monto total: $840.00 MXN
- Datos del cliente (nombre, email, apellido)
- Opción para cambiar producto o proceder

**Captura requerida**: Screenshot mostrando producto + monto + campos de cliente

---

### **Paso 3: Selección del Método de Pago**

**Pantalla**: Checkout - Métodos de Pago
- Se muestran disponibles:
  - ✅ EVO Payments (Mastercard)
  - Stripe
  - Mercado Pago
  - PayPal
- Usuario selecciona botón "EVO Payments - Mastercard Seguro"

**Captura requerida**: Screenshot con botones de métodos de pago, EVO destacado/seleccionado

---

### **Paso 4: Confirmación del Monto y Botón Pagar**

**Pantalla**: Formulario EVO Payments en sitio
- Título: "Pagar con EVO Payments"
- Resumen: "Pack Pilates 2x • $840.00 MXN"
- Botón: "Pagar Ahora" (amarillo/dorado)

**Captura requerida**: Screenshot del formulario con botón "Pagar Ahora"

---

### **Paso 5: Formulario de Pago Embebido**

**Pantalla**: EVO Payments - Embedded Checkout
- El formulario se carga directamente en la página (no modal)
- Iframe embebido de 640px de altura
- Diseño integrado con el sitio
- Mensaje: "Formulario de pago cargado. Completa tu pago en el formulario embebido."

**Captura requerida**: Screenshot mostrando el iframe embebido en la página

---

### **Paso 6: Ingreso de Datos de Tarjeta**

**Pantalla**: EVO Payments - Formulario de Tarjeta (dentro del iframe)
- Campo: Número de Tarjeta
- Campo: Nombre en la Tarjeta
- Campo: Email del Titular
- Campo: Fecha de Vencimiento (MM/AA)
- Campo: CVV/CVC
- Información de seguridad Mastercard visible
- Botón "Pagar" o "Submit"

**Datos de Prueba Utilizados**:
```
Tarjeta: 5555555555554444 (Mastercard de prueba)
Vencimiento: 12/25
CVV: 123
```

**Captura requerida**: Screenshot del formulario de ingreso de datos de tarjeta

---

### **Paso 7: Autenticación 3D Secure (3DS)**

**Pantalla**: Banco Emisor - Verificación 3DS
- Redirección automática al banco emisor
- Callbacks JavaScript manejan la redirección:
  - `evoBeforeRedirect`: Guarda estado del formulario
  - `evoAfterRedirect`: Restaura estado del formulario
- Solicitud de verificación adicional (OTP, PIN, biométrico)
- Para pruebas se usa ACS Test Server

**Nota**: Los callbacks beforeRedirect/afterRedirect evitan errores CSP durante la autenticación 3DS

**Captura requerida**: Screenshot del proceso 3DS del banco (si aplica)

---

### **Paso 8: Procesamiento de Pago**

**Pantalla**: EVO Payments - Procesando
- Mensaje: "Procesando pago..."
- Spinner animado en el iframe
- Estado: En espera de respuesta del motor de pagos
- La página permanece en el mismo lugar (no hay popup)

**Captura requerida**: Screenshot del estado "Procesando"

---

### **Paso 9: Respuesta Exitosa**

**Pantalla**: Confirmación de Éxito (diseño consistente con Stripe)
- Fondo oscuro (#0f0f0f) - diseño del sitio
- Icono: CheckCircle verde (de lucide-react)
- Título: "¡Pago Exitoso!" (texto 3xl)
- Mensaje: "Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación."
- Tarjeta con información:
  - Plan: "Pack Pilates 2x"
  - Total Pagado: $840 (en amarillo)
  - Orden ID: RENEW-1770257142908

**Captura requerida**: Screenshot de la pantalla de confirmación exitosa

---

### **Paso 10: Email de Confirmación**

**Pantalla**: Email de Confirmación
- Recepción de email en la dirección proporcionada
- Contenido:
  - Resumen del pago
  - ID de transacción
  - Monto pagado
  - Fecha y hora

**Captura requerida**: Screenshot del email de confirmación recibido

---

### **Paso 11: Registro en Sistema**

**Pantalla**: Panel de Usuario / Historial de Pagos
- El pago aparece registrado en el sistema
- Estado: Completado
- Método: EVO Payments
- Monto: $840.00 MXN
- Membresía: Actualizada/Renovada

**Captura requerida**: Screenshot del historial de pagos actualizado

---

## 4. CARACTERÍSTICAS ADICIONALES

### Reembolsos (Refunds)
- **Estado**: Funcionalidad implementada
- **Ubicación**: Endpoint `/api/evo/process-refund`
- **Captura requerida**: Screenshot del reportería de EVO mostrando reembolso realizado

### Anulaciones (Void)
- **Estado**: Funcionalidad implementada
- **Ubicación**: Endpoint `/api/evo/void-transaction`
- **Captura requerida**: Screenshot del reportería de EVO mostrando transacción anulada

### MSI (Meses Sin Intereses)
- **Estado**: No utilizado en esta integración inicial
- **Nota**: Disponible para futuras implementaciones

---

## 5. DETALLES TÉCNICOS DE INTEGRACIÓN

### Endpoints Implementados

**1. Crear Sesión de Pago (API v100)**
```
POST /api/evo/create-session
Parámetros:
- amount: número (en unidades MXN, no centavos)
- email: string
- nombre: string
- apellido: string
- productId: string
- productName: string
- orderId: string

Respuesta:
- sessionId: string
- orderId: string
- successIndicator: string
- hostedCheckoutUrl: string
- baseUrl: string
- apiVersion: "100"
```

**Operación EVO**: INITIATE_CHECKOUT
- Crea sesión con interaction.operation = "PURCHASE"
- Incluye interaction.returnUrl para validación post-pago
- No incluye datos del cliente (customerEmail, displayControl) por limitaciones de API v100

**2. Callbacks JavaScript (Frontend)**
```javascript
window.evoCompleteCallback(resultIndicator)
- Se ejecuta cuando el pago se completa exitosamente
- Valida resultIndicator contra successIndicator guardado
- Envía datos al CRM: /api/crm/create-client
- Envía email de confirmación: /api/send-email

window.evoCancelCallback()
- Se ejecuta cuando el usuario cancela el pago

window.evoErrorCallback(error)
- Se ejecuta cuando hay un error en el pago

window.evoBeforeRedirect()
- Se ejecuta antes de redirigir a 3DS
- Guarda estado del formulario con Checkout.saveFormFields()

window.evoAfterRedirect()
- Se ejecuta después de regresar de 3DS
- Restaura estado del formulario con Checkout.restoreFormFields()
```

**3. Página de Retorno**
```
GET /evo-return?orderId={orderId}&resultIndicator={resultIndicator}
- Valida resultIndicator contra localStorage
- Muestra página de confirmación con diseño consistente
- Fallback en caso de que callbacks fallen
```

**3. Procesar Reembolso**
```
POST /api/evo/process-refund
Parámetros:
- orderId: string
- transactionId: string
- amount: número
```

**4. Webhook de Notificación**
```
POST /api/evo/webhook
Endpoint para recibir notificaciones de EVO Payments
```

### Stack Tecnológico
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Autenticación**: HTTP Basic Auth (merchant.{MERCHANT_ID})
- **API Version**: 100 (última versión)
- **Operación Principal**: INITIATE_CHECKOUT
- **Moneda**: MXN
- **Checkout SDK**: /static/checkout/checkout.min.js
- **Integración**: Embedded Page (showEmbeddedPage)
- **3DS**: Callbacks beforeRedirect/afterRedirect
- **Ambiente**: Prueba (TEST1323002)

---

## 6. CAMBIOS RECIENTES Y CORRECCIONES

### Actualización a API v100 (6 Feb 2026)
- ✅ Migración de API v53 → v100
- ✅ Cambio de CREATE_CHECKOUT_SESSION → INITIATE_CHECKOUT
- ✅ Implementación de embedded checkout inline (no modal)
- ✅ Agregado soporte para 3D Secure con callbacks
- ✅ Diseño de página de éxito consistente con Stripe
- ✅ Envío automático de correos de confirmación
- ✅ Integración con CRM automática

### Correcciones Técnicas
- ✅ Removidos campos `customerEmail` y `displayControl` (incompatibles con v100)
- ✅ Orden correcto de campos en request: returnUrl antes de campos opcionales
- ✅ Iframe con tamaño adecuado (640px altura) y mejor estilo
- ✅ Callbacks JavaScript para manejo de 3DS sin errores CSP
- ✅ Validación de successIndicator en cliente y servidor

---

## 7. RESULTADO FINAL

✅ **Estado**: Integración exitosa y completamente funcional

**Métodos de Pago Integrados**:
- ✅ EVO Payments (Mastercard) - NUEVO
- ✅ Stripe
- ✅ Mercado Pago
- ✅ PayPal

**Funcionalidades Soportadas**:
- ✅ Pagos únicos (INITIATE_CHECKOUT + PURCHASE)
- ✅ Renovación de membresías
- ✅ Historial de transacciones
- ✅ Confirmación por email automática
- ✅ Integración con CRM automática
- ✅ Embedded checkout inline (sin popups)
- ✅ Soporte completo 3D Secure (3DS)
- ✅ Reembolsos (REFUND operation)
- ✅ Anulaciones (VOID operation)
- ✅ Validación de transacciones con successIndicator

---

## 8. PRÓXIMOS PASOS PARA PRODUCCIÓN

1. ✅ Validar flujo de prueba (documento actual)
2. ⏳ Obtener credenciales de producción
3. ⏳ Obtener webhook secret de producción
4. ⏳ Realizar pruebas en ambiente de producción
5. ⏳ Cambiar a credenciales de producción
6. ⏳ Habilitar transacciones reales

---

**Documento preparado por**: Fit Sanctuary Development Team  
**Fecha**: 6 de Febrero, 2026  
**Versión**: 2.0 (Actualizado para API v100)  
**Estado**: Listo para Pase a Producción  
**Última Actualización**: Migración completa a API v100 con embedded checkout

