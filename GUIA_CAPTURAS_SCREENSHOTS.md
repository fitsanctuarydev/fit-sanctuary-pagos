# GUÍA: CÓMO TOMAR LAS CAPTURAS DE PANTALLA PARA EVO

## Tarjetas de Prueba Disponibles

Usa estas tarjetas de la documentación oficial de EVO:
https://evopaymentsmexico.gateway.mastercard.com/api/documentation/integrationGuidelines/supportedFeatures/pickAdditionalFunctionality/authentication/3DS/test_your_integration.html?locale=es_MX

### Mastercard de Prueba (Recomendada)
```
Número: 5555 5555 5555 4444
Vencimiento: 12/25
CVV: 123
Nombre: TEST USER
```

### Visa de Prueba
```
Número: 4111 1111 1111 1111
Vencimiento: 12/25
CVV: 123
```

---

## LISTA DE CAPTURAS A TOMAR (11 screenshots)

### 1️⃣ PANTALLA DE SELECCIÓN DE PRODUCTO
**URL**: https://pagos.fitsanctuary.mx/
**Qué capturar**: 
- Catálogo completo de membresías
- Botón "Comprar" del producto "Pack Pilates 2x"
- Precio visible: $840 MXN

**Pasos**:
1. Ir a https://pagos.fitsanctuary.mx
2. Desplazarse hacia las opciones de membresías
3. Tomar screenshot del catálogo

---

### 2️⃣ PANTALLA DE CARRITO/RESUMEN
**Qué capturar**:
- Producto seleccionado: "Pack Pilates 2x"
- Monto: $840.00 MXN
- Campos de cliente (nombre, email, apellido)
- Botón "Continuar"

**Pasos**:
1. Hacer clic en "Comprar" de Pack Pilates 2x
2. Llenar datos: 
   - Nombre: TEST
   - Apellido: USER
   - Email: test@example.com
3. Tomar screenshot antes de continuar

---

### 3️⃣ PANTALLA DE SELECCIÓN DE MÉTODO DE PAGO
**Qué capturar**:
- Botones de métodos disponibles:
  - ✅ EVO Payments (Mastercard Seguro)
  - Stripe
  - Mercado Pago
  - PayPal
- El botón EVO debe verse destacado/seleccionado

**Pasos**:
1. Continuar desde pantalla anterior
2. Ver la sección "Selecciona tu método de pago"
3. Tomar screenshot mostrando todos los botones
4. Hacer clic en botón EVO Payments

---

### 4️⃣ PANTALLA DEL FORMULARIO EVO (antes de abrir modal)
**Qué capturar**:
- Formulario de EVO con:
  - Título: "Pagar con EVO Payments"
  - Resumen: "Pack Pilates 2x • $840.00 MXN"
  - Botón dorado: "Pagar Ahora"

**Pasos**:
1. Después de hacer clic en EVO
2. Tomar screenshot del formulario
3. Hacer clic en "Pagar Ahora"

---

### 5️⃣ PANTALLA DE CARGA DEL MODAL DE EVO
**Qué capturar**:
- Modal/lightbox abriéndose
- Spinner de carga
- Mensaje: "Ventana de pago abierta..."

**Pasos**:
1. Hacer clic en "Pagar Ahora"
2. El modal comenzará a cargar
3. Tomar screenshot rápidamente (spinner animado)

---

### 6️⃣ PANTALLA DE INGRESO DE DATOS DE TARJETA
**Qué capturar**:
- Formulario de EVO con campos:
  - Número de tarjeta
  - Fecha de vencimiento
  - CVV
  - Nombre del titular
- Botón de confirmar/enviar

**Pasos**:
1. Esperar a que cargue completamente el modal de EVO
2. Se abrirá el formulario de ingreso de tarjeta
3. Ingresar datos:
   ```
   Número: 5555555555554444
   Vencimiento: 12/25
   CVV: 123
   Nombre: TEST USER
   ```
4. Tomar screenshot ANTES de hacer clic en enviar

---

### 7️⃣ PANTALLA DE AUTENTICACIÓN 3DS (Opcional pero recomendado)
**Qué capturar**:
- ACS Emulator de 3D Secure
- Pantalla de autenticación del banco
- Campos OTP o confirmación

**Pasos**:
1. Después de enviar datos de tarjeta
2. Se abrirá emulador 3DS
3. Ingresar código (generalmente 111111 o similar)
4. Tomar screenshot

**Nota**: Si no aparece 3DS, usar tarjeta sin verificación:
```
Número: 5200005200005200 (sin 3DS)
```

---

### 8️⃣ PANTALLA DE PROCESAMIENTO
**Qué capturar**:
- Estado: "Procesando pago..."
- Spinner/loader animado
- Mensaje de espera

**Pasos**:
1. Después de confirmar 3DS (o tarjeta)
2. EVO comienza a procesar
3. Tomar screenshot del estado de procesamiento

---

### 9️⃣ PANTALLA DE CONFIRMACIÓN EXITOSA
**Qué capturar**:
- ✅ Check verde
- Mensaje: "¡Pago realizado exitosamente!"
- ID de transacción
- Monto confirmado: $840.00 MXN
- Mensaje: "Transacción procesada. Recibirás un email de confirmación."

**Pasos**:
1. Esperar procesamiento
2. Se mostrará pantalla de éxito
3. Tomar screenshot

**Esta es la captura más importante para demostrar que funciona**

---

### 🔟 EMAIL DE CONFIRMACIÓN
**Qué capturar**:
- Email recibido en bandeja de entrada
- Contenido visible:
  - Orden ID / Transaction ID
  - Monto: $840.00 MXN
  - Producto: Pack Pilates 2x
  - Método de pago: EVO Payments

**Pasos**:
1. Verificar email (puede tardar 1-2 minutos)
2. Abrir el email de confirmación
3. Tomar screenshot mostrando los detalles

---

### 1️⃣1️⃣ HISTORIAL DE PAGOS EN PORTAL
**Qué capturar**:
- Panel de usuario / Mi Cuenta
- Sección: Historial de Pagos
- Fila del pago realizado mostrando:
  - Producto: Pack Pilates 2x
  - Monto: $840.00 MXN
  - Método: EVO Payments / Mastercard
  - Fecha: [fecha del pago]
  - Estado: Completado ✅

**Pasos**:
1. Después de confirmación exitosa
2. Ir a perfil/panel de usuario
3. Buscar sección de historial de pagos
4. Tomar screenshot mostrando el pago registrado

---

## INSTRUCCIONES PARA ARMAR EL DOCUMENTO

### Opción 1: Microsoft Word (Recomendado)
1. Descargar la plantilla `DOCUMENTACION_PRODUCCION_EVO.md`
2. Abrir en Microsoft Word o Google Docs
3. Por cada sección con `**Captura requerida**`:
   - Insertar la imagen correspondiente
   - Colocar debajo de la descripción
   - Ajustar tamaño (máx 6 pulgadas de ancho)
4. Guardar como PDF

### Opción 2: Google Docs
1. Crear documento nuevo
2. Copiar contenido del markdown
3. Insertar → Imagen → Subir desde computadora
4. Descargar como PDF

### Opción 3: PDF Directo (Adobe)
1. Crear documento en Word
2. Guardar como PDF
3. Usar Adobe Acrobat para insertar imágenes si es necesario

---

## CHECKLIST ANTES DE ENVIAR

- [ ] 11 capturas de pantalla de buena calidad (1920x1080+)
- [ ] Número de Afiliación: TEST1323002 ✅
- [ ] Tipo de Integración: Hosted Session ✅
- [ ] Versión API: 53 ✅
- [ ] Flujo exitoso de Mastercard ✅
- [ ] Email de confirmación ✅
- [ ] Historial de pagos actualizado ✅
- [ ] Documento en PDF o Word ✅
- [ ] Nombre de archivo: `EVO_Payments_Produccion_FitSanctuary.pdf` ✅

---

## CONTACTO PARA DUDAS

**Andrea Vite Gonzalez**  
Implementation & Production Support  
T: +5583100960  
andrea.vite@globalpayments.com

---

**¡Listo para enviar!** 🚀
