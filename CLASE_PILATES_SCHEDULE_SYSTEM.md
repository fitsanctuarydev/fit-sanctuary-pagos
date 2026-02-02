# Sistema de Selección de Horarios para Clase de Pilates

## 📋 Descripción General

Se ha implementado un sistema completo de selección de horarios para la **Clase de Pilates** ($160) en la plataforma de pagos. Los clientes ahora pueden:

1. Seleccionar la "Clase de Pilates" durante el checkout
2. Ver todos los horarios disponibles del sistema
3. Elegir su horario preferido
4. Proceder al pago con el horario registrado

## 🎯 Características Implementadas

### 1. **Selector Visual de Horarios**
- Grid responsivo que muestra todos los horarios de Pilates disponibles
- Información clara: día, hora, instructor, capacidad
- Selección visual con resaltado en color amarillo
- Carga dinámica desde Firestore

### 2. **Validaciones**
- Se requiere seleccionar un horario antes de procesar el pago
- Se valida en todos los métodos de pago (Stripe, Mercado Pago, PayPal, Transferencia)
- Mensaje de error claro si intenta pagar sin horario

### 3. **Integración con Firestore**
- Lee horarios desde la colección `schedules` en Firestore
- Filtra automáticamente solo clases de Pilates
- Muestra información en tiempo real

### 4. **Confirmación de Reserva**
- El horario seleccionado se envía junto con los datos de pago
- Se registra en el CRM con:
  - `scheduleId`: ID del horario
  - `dayOfWeek`: Día de la semana (0-6)
  - `startTime`: Hora de inicio
  - `endTime`: Hora de fin
  - `instructor`: Nombre del instructor

## 🔧 Cambios Técnicos

### Frontend (fit-sanctuary-pagos/client)

**Estados agregados en App.jsx:**
```javascript
const [availableSchedules, setAvailableSchedules] = useState([]);
const [selectedSchedule, setSelectedSchedule] = useState(null);
const [schedulesLoading, setSchedulesLoading] = useState(false);
```

**Nueva función:**
```javascript
const loadPilatesSchedules = async () => {
  // Obtiene horarios desde /api/schedules/pilates
  // Filtra solo clases de Pilates
  // Actualiza estado de availableSchedules
};
```

**Cambios en handleSelectPlan:**
- Detecta cuando se selecciona "clase_pilates"
- Llama automáticamente a `loadPilatesSchedules()`
- Resetea `selectedSchedule` al cambiar de plan

**Actualización en handleSuccess:**
- Incluye información de horario en `clientData` si es disponible
- Envía `scheduleInfo` en el email de confirmación

**Validaciones de pago:**
- Todos los métodos de pago verifican:
  ```javascript
  if (selectedPlan.id === 'clase_pilates' && !selectedSchedule) {
    alert('Por favor selecciona un horario para la clase de Pilates');
    return;
  }
  ```

### Backend (fit-sanctuary-pagos/server.js)

**Nuevo endpoint:**
```javascript
GET /api/schedules/pilates
```

Funcionalidad:
1. Intenta obtener desde CRM API primero
2. Si no está disponible, obtiene desde Firestore
3. Devuelve array de horarios con formato:
   ```json
   {
     "id": "schedule_id",
     "className": "Clase de Pilates",
     "instructor": "Juan Pérez",
     "dayOfWeek": 2,
     "startTime": "18:00",
     "endTime": "19:00",
     "capacity": 20,
     "description": "..."
   }
   ```

## 📊 Flujo de Compra - Clase de Pilates

```
1. Cliente selecciona "Clase de Pilates" en tienda
                    ↓
2. Se carga lista de horarios disponibles
                    ↓
3. Cliente completa formulario personal
                    ↓
4. Cliente selecciona horario preferido (REQUERIDO)
                    ↓
5. Cliente selecciona método de pago
                    ↓
6. Sistema valida que hay horario seleccionado
                    ↓
7. Se procesa pago
                    ↓
8. Se crea cliente en CRM con:
   - Datos personales
   - Tipo: clase_pilates
   - Horario seleccionado
                    ↓
9. Se envía email de confirmación con detalles del horario
```

## 🎨 Interfaz de Usuario

### Selector de Horarios
```
┌─────────────────────────────────────────────┐
│ SELECCIONA TU HORARIO                       │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Lunes • 18:00 - 19:00                   │ │
│ │ Instructor: Juan Pérez          20 lug │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Miércoles • 19:00 - 20:00 (SELECCIONADO) │ │
│ │ Instructor: María López         20 lug │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Viernes • 18:30 - 19:30                 │ │
│ │ Instructor: Carlos Ruiz         20 lug │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## ✅ Validaciones Implementadas

1. **Selección de Horario (REQUERIDO)**
   - Si clase_pilates sin horario → Alerta
   - Bloquea procesar pago hasta seleccionar

2. **Carga de Horarios**
   - Intenta CRM primero
   - Fallback a Firestore
   - Maneja casos sin horarios disponibles

3. **Información Correcta**
   - Filtra solo Pilates
   - Valida formato de datos
   - Maneja errores silenciosamente

## 📧 Email de Confirmación

El email ahora incluye (cuando aplica):
```
Detalles de tu clase:
- Día: Miércoles
- Hora: 19:00 - 20:00
- Instructor: María López
- Ubicación: Blvrd Aldama 1410, Tehuacán
```

## 🔄 Integración con CRM

Los datos del horario se guardan en Firestore bajo la membresía:
```javascript
membership: {
  clientId: "...",
  tipo: "clase_pilates",
  monto: 160,
  fechaInicio: "2026-02-02",
  fechaFin: "2026-02-03",
  scheduleInfo: {
    dayOfWeek: 2,
    startTime: "19:00",
    endTime: "20:00",
    instructor: "María López"
  }
}
```

## 🚀 Despliegue

```bash
# Client
cd fit-sanctuary-pagos/client
npm run build

# Server (automático)
# Los cambios en server.js se despliegan en Render
```

## 🧪 Testing Manual

```
Test 1: Cargar horarios
- Acceder a checkout de Clase de Pilates
- Verificar que aparecen los horarios
- Confirmar que están correctos

Test 2: Seleccionar horario
- Hacer clic en diferentes horarios
- Verificar que se resaltan correctamente
- Confirmar que el estado se actualiza

Test 3: Validar pago sin horario
- Intentar pagar sin seleccionar horario
- Debe aparecer alerta
- No debe procesar pago

Test 4: Pago con horario
- Seleccionar horario
- Procesar pago
- Verificar que se crea cliente en CRM con horario
- Confirmar email recibido con detalles

Test 5: Múltiples métodos de pago
- Probar con Stripe
- Probar con Mercado Pago
- Probar con PayPal
- Probar con Transferencia
```

## 📝 Notas Importantes

1. **Capacidad de Clase**: Si hay límite, se muestra (ej: "20 lugares")
2. **Instructor Dinámico**: Se obtiene del sistema de horarios
3. **Sin Horarios**: Si no hay disponibles, muestra mensaje amigable
4. **Responsivo**: Funciona en móvil, tablet y desktop

## 🔗 Referencias

- **Colección Firestore**: `schedules`
- **Endpoint API**: `GET /api/schedules/pilates`
- **Componente**: `fit-sanctuary-pagos/client/src/App.jsx` (línea ~585)
- **Servidor**: `fit-sanctuary-pagos/server.js` (nuevo endpoint)

## ✨ Mejoras Futuras

1. **Confirmación Visual**: Modal de confirmación antes de pagar
2. **Ocupación en Vivo**: Mostrar lugares disponibles en tiempo real
3. **Notificación de Cambios**: Alertar si instructor cambia
4. **Recordatorio por Email**: 24 horas antes de la clase
5. **Estadísticas**: Rastrear clases más populares

---

**Versión:** 1.0.0  
**Fecha**: 2026-02-02  
**Estado**: ✅ En Producción  
**Último Cambio**: Sistema completo de selección de horarios implementado

