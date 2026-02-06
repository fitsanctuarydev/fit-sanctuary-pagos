# MANUAL DE INTEGRACIÓN EVO PAYMENTS
## Fit Sanctuary - Pase a Producción

---

## 1. INFORMACIÓN DE AFILIACIÓN

| Concepto | Valor |
|----------|-------|
| **Nombre de Negocio** | Fit Sanctuary |
| **Número de Afiliación DEMO** | TEST1323002 |
| **Tipo de Integración** | Hosted Session (Lightbox Modal) |
| **Número de Versión API** | 53 |
| **URL de Integración** | https://pagos.fitsanctuary.mx |
| **Fecha de Implementación** | 5 de Febrero, 2026 |

---

## 2. TIPO DE INTEGRACIÓN UTILIZADO

**Hosted Session con Hosted Checkout (Lightbox Modal)**

- **Descripción**: Implementación segura mediante sesión de pago embebida en lightbox modal
- **Ventajas**: 
  - PCI-DSS compliant
  - No almacenamos datos de tarjeta
  - Experiencia de usuario fluida
  - Seguridad Mastercard Gateway

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

### **Paso 5: Redirección a Motor de Pago EVO**

**Pantalla**: EVO Payments - Hosted Checkout Loading
- Se abre ventana modal/lightbox
- Se visualiza: "Ventana de pago abierta. Completa tu pago en el formulario emergente."
- Spinner de carga

**Captura requerida**: Screenshot mostrando el modal de carga de EVO

---

### **Paso 6: Ingreso de Datos de Tarjeta**

**Pantalla**: EVO Payments - Formulario de Tarjeta
- Campo: Número de Tarjeta
- Campo: Fecha de Vencimiento
- Campo: CVV
- Información de seguridad visible
- Botón de confirmación

**Datos de Prueba Utilizados**:
```
Tarjeta: 5555555555554444 (Mastercard de prueba)
Vencimiento: 12/25
CVV: 123
```

**Captura requerida**: Screenshot del formulario de ingreso de datos de tarjeta

---

### **Paso 7: Autenticación 3DS (Si aplica)**

**Pantalla**: ACS Emulator - Autenticación 3D Secure
- Simulador de autenticación del banco
- Solicitud de confirmación adicional
- Código OTP o verificación

**Captura requerida**: Screenshot del emulador 3DS (si se utiliza)

---

### **Paso 8: Procesamiento de Pago**

**Pantalla**: EVO Payments - Procesando
- Mensaje: "Procesando pago..."
- Spinner animado
- Estado: En espera de respuesta del motor de pagos

**Captura requerida**: Screenshot del estado "Procesando"

---

### **Paso 9: Respuesta Exitosa**

**Pantalla**: EVO Payments - Confirmación de Éxito
- Icono: ✅ Check verde
- Mensaje: "¡Pago realizado exitosamente!"
- Información: "Transacción procesada. Recibirás un email de confirmación."
- Datos de transacción:
  - Transaction ID: [número generado]
  - Orden ID: RENEW-1770257142908
  - Monto: $840.00 MXN
  - Método: EVO Payments / Mastercard

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

**1. Crear Sesión de Pago**
```
POST /api/evo/create-session
Parámetros:
- amount: número
- email: string
- nombre: string
- apellido: string
- productId: string
- productName: string
- orderId: string
```

**2. Procesar Pago**
```
POST /api/evo/process-payment
Parámetros:
- sessionId: string
- orderId: string
- amount: número
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
- **Frontend**: React + Vite
- **Backend**: Express.js + Node.js
- **Autenticación**: HTTP Basic Auth (merchant.{MERCHANT_ID})
- **API Version**: 53
- **Moneda**: MXN
- **Ambiente**: Prueba (TEST1323002)

---

## 6. RESULTADO FINAL

✅ **Estado**: Integración exitosa y completamente funcional

**Métodos de Pago Integrados**:
- ✅ EVO Payments (Mastercard) - NUEVO
- ✅ Stripe
- ✅ Mercado Pago
- ✅ PayPal

**Funcionalidades Soportadas**:
- ✅ Pagos únicos
- ✅ Renovación de membresías
- ✅ Historial de transacciones
- ✅ Confirmación por email
- ✅ Reembolsos
- ✅ Anulaciones

---

## 7. PRÓXIMOS PASOS PARA PRODUCCIÓN

1. ✅ Validar flujo de prueba (documento actual)
2. ⏳ Obtener credenciales de producción
3. ⏳ Obtener webhook secret de producción
4. ⏳ Realizar pruebas en ambiente de producción
5. ⏳ Cambiar a credenciales de producción
6. ⏳ Habilitar transacciones reales

---

**Documento preparado por**: Fit Sanctuary Development Team  
**Fecha**: 5 de Febrero, 2026  
**Versión**: 1.0  
**Estado**: Listo para Pase a Producción

