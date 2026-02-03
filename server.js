const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Stripe = require('stripe');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const admin = require('firebase-admin');
const { isContractualPackage, getPriceForMembership, getDurationDays, mapPaymentTypeToMembership } = require('./membership-pricing-config');

const app = express();
app.use(cors());
app.use(express.json());

// --- FIREBASE ADMIN INITIALIZATION ---
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT environment variable is required');
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
console.log('✓ Firebase Admin initialized successfully');

// --- CONFIGURACIÓN ---
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const mpClient = process.env.MP_ACCESS_TOKEN ? new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN }) : null;
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const PAYPAL_API = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
const CRM_API_URL = process.env.CRM_API_URL || 'https://fit-sanctuary-api.onrender.com';

// 1. MERCADO PAGO (Preferencia con Validación)
app.post('/api/mp/create-preference', async (req, res) => {
  if (!mpClient) return res.status(500).json({ error: "Falta MP_ACCESS_TOKEN" });
  try {
    const { title, price, orderId, userEmail } = req.body;
    
    // ✓ Validación de entrada
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: "Título de producto inválido" });
    }
    if (!price || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: "Precio debe ser mayor a 0" });
    }
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: "ID de orden requerido" });
    }
    
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [{
          title: title.trim().substring(0, 256),
          unit_price: Number(price),
          quantity: 1,
          currency_id: 'MXN'
        }],
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'https://pagos.fitsanctuary.mx'}/success`,
          failure: `${process.env.FRONTEND_URL || 'https://pagos.fitsanctuary.mx'}/checkout`,
          pending: `${process.env.FRONTEND_URL || 'https://pagos.fitsanctuary.mx'}/pending`
        },
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/webhooks/mercadopago`,
        external_reference: orderId,
        payer: userEmail ? { email: userEmail } : undefined,
        statement_descriptor: "FITSANCTUARY",
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: []
        }
      }
    });
    
    if (!result || !result.id) {
      throw new Error("MP no devolvió ID de preferencia");
    }
    
    console.log(`✓ Preferencia MP creada: ${result.id} (Orden: ${orderId})`);
    res.json({ 
      id: result.id, 
      init_point: result.init_point,
      amount: Number(price)
    });
    
  } catch (error) {
    console.error("❌ Error MP:", error.message);
    res.status(500).json({ 
      error: error.message.includes('unauthorized') 
        ? "Token de MP inválido o expirado" 
        : "Error creando preferencia de pago: " + error.message
    });
  }
});

// 2. STRIPE - Suscripciones y Pagos
app.post('/api/stripe/create-intent', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: "Falta STRIPE_SECRET_KEY" });
  try {
    const { amount, email, nombre, apellido, productId, productName } = req.body;
    
    // Validación
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    // Determinar si debe ser suscripción (para membresías mensuales)
    const isMonthlyMembership = productId && (productId === 'm_est' || productId === 'm_gen' || 
                                               productId === 'ai_01' || productId === 'ai_02' || 
                                               productId === 'c_pil' || productId === 'c_hyr');
    
    if (isMonthlyMembership && email) {
      // CREAR SUSCRIPCIÓN PARA MEMBRESÍAS MENSUALES
      console.log(`🔄 Creando suscripción mensual para ${email}`);
      
      // Buscar o crear cliente en Stripe
      let customer;
      const existingCustomers = await stripe.customers.list({ email, limit: 1 });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        console.log(`✓ Cliente existente encontrado: ${customer.id}`);
      } else {
        customer = await stripe.customers.create({
          email,
          name: `${nombre || ''} ${apellido || ''}`.trim(),
          metadata: { source: 'fit_sanctuary_pagos' }
        });
        console.log(`✓ Nuevo cliente Stripe creado: ${customer.id}`);
      }
      
      // Crear precio recurrente para esta suscripción
      const price = await stripe.prices.create({
        unit_amount: Math.round(amount * 100),
        currency: 'mxn',
        recurring: { interval: 'month' },
        product_data: {
          name: productName || 'Membresía Fit Sanctuary',
          metadata: { productId }
        }
      });
      
      // Crear suscripción
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          productId,
          productName: productName || 'Membresía',
          source: 'fit_sanctuary'
        }
      });
      
      console.log(`✓ Suscripción creada: ${subscription.id}`);
      
      return res.json({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id,
        customerId: customer.id,
        isSubscription: true
      });
    } else {
      // PAGO ÚNICO PARA PAQUETES MULTI-MES
      console.log(`💳 Creando pago único de $${amount} MXN`);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'mxn',
        automatic_payment_methods: { enabled: true },
        metadata: {
          productId: productId || 'unknown',
          productName: productName || 'Paquete',
          source: 'fit_sanctuary'
        }
      });
      
      return res.json({ 
        clientSecret: paymentIntent.client_secret,
        isSubscription: false
      });
    }
  } catch (error) {
    console.error('❌ Error Stripe:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. PAYPAL
const generatePayPalAccessToken = async () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET en env");
  }
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
  try {
    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, "grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error getting PayPal token:", error.response?.data || error.message);
    throw new Error("Error autenticando con PayPal: " + (error.response?.data?.error_description || error.message));
  }
};

app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // ✓ Validación de entrada
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: "Cantidad debe ser un número mayor a 0" });
    }
    
    const accessToken = await generatePayPalAccessToken();
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "MXN",
          value: String(amount.toFixed(2)) // PayPal requiere string con 2 decimales
        }
      }],
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!response.data || !response.data.id) {
      throw new Error("PayPal no devolvió ID de orden");
    }
    
    console.log(`✓ Orden PayPal creada: ${response.data.id} (Monto: $${amount} MXN)`);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error PayPal create-order:", error.message);
    const errorMsg = error.response?.data?.message || error.message;
    res.status(500).json({
      error: errorMsg,
      details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
    });
  }
});

app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    
    // ✓ Validación de entrada
    if (!orderID || typeof orderID !== 'string' || orderID.trim().length === 0) {
      return res.status(400).json({ error: "orderID es requerido" });
    }
    
    const accessToken = await generatePayPalAccessToken();
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID.trim()}/capture`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    if (!response.data) {
      throw new Error("PayPal no devolvió respuesta de captura");
    }
    
    console.log(`✓ Orden PayPal capturada: ${orderID}`);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error PayPal capture-order:", error.message);
    const errorMsg = error.response?.data?.message || error.message;
    res.status(500).json({
      error: errorMsg,
      details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
    });
  }
});

// ============================================
// CRM INTEGRATION - CREATE CLIENT
// ============================================
app.post('/api/crm/create-client', async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      fechaNacimiento,
      genero,
      direccion,
      contactoEmergencia,
      telefonoEmergencia,
      membershipType,
      amount,
      orderId
    } = req.body;

    // Validate required fields
    if (!nombre || !apellido || !email || !telefono || !membershipType) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.error(`❌ Email mal formateado: "${email}"`);
      return res.status(400).json({ 
        error: 'invalid_email_format',
        message: 'El email proporcionado no tiene un formato válido'
      });
    }
    
    // Limpiar y normalizar el email
    const cleanEmail = email.trim().toLowerCase();
    console.log(`📧 Email limpio: ${cleanEmail}`);

    // Map product IDs to membership types
    const membershipMapping = {
      'm_est': 'estudiante',
      'm_gen': 'general',
      'p_tri': 'trimestral',
      'p_sem': 'semestral',
      'p_anu': 'anual',
      'ai_01': 'paquete01',
      'ai_02': 'paquete02',
      'c_pil': 'pilates',
      'c_hyr': 'hyrox'
    };

    const mappedMembershipType = membershipMapping[membershipType] || 'general';

    // Check if client already exists
    const existingClients = await db.collection('clients')
      .where('email', '==', cleanEmail)
      .get();

    let clientId;
    let clientData;
    let isNewClient = false;

    if (!existingClients.empty) {
      // Client exists, use existing data
      const existingClient = existingClients.docs[0];
      clientId = existingClient.id;
      clientData = existingClient.data();
      
      console.log(`✓ Cliente existente encontrado: ${cleanEmail} (ID: ${clientId})`);
      
      // Opcionalmente actualizar datos si son diferentes
      const updates = {};
      if (telefono && telefono !== clientData.telefono) updates.telefono = telefono;
      if (direccion && Object.keys(direccion).length > 0) updates.direccion = direccion;
      if (contactoEmergencia) updates.contactoEmergencia = contactoEmergencia;
      if (telefonoEmergencia) updates.telefonoEmergencia = telefonoEmergencia;
      
      if (Object.keys(updates).length > 0) {
        await db.collection('clients').doc(clientId).update(updates);
        console.log(`✓ Datos del cliente actualizados: ${clientId}`);
      }
    } else {
      // Create new client in Firestore
      isNewClient = true;
      clientData = {
        nombre: `${nombre} ${apellido}`, // Guardar nombre completo concatenado
        apellido: apellido, // También guardar apellido por separado para compatibilidad
        email: cleanEmail,
        telefono,
        fechaNacimiento: fechaNacimiento || '',
        genero: genero || '',
        direccion: direccion || {},
        contactoEmergencia: contactoEmergencia || '',
        telefonoEmergencia: telefonoEmergencia || '',
        fechaRegistro: new Date().toISOString(),
        activo: true
      };

      const clientRef = await db.collection('clients').add(clientData);
      clientId = clientRef.id;
      
      console.log(`✓ Nuevo cliente creado en Firebase: ${clientId}`);

      // Send invitation email to members portal (solo para nuevos clientes)
      try {
        await axios.post(`${CRM_API_URL}/api/clients/send-invitation`, {
          email: cleanEmail,
          nombre,
          apellido
        }, { timeout: 10000 }); // 10 segundos timeout
        console.log(`✓ Email de invitación enviado a: ${cleanEmail}`);
      } catch (emailError) {
        console.error('⚠️ Error enviando invitación (no crítico):', emailError.message);
        // No lanzamos error, solo logueamos
      }
    }

    // Calculate membership end date and pricing using centralized configuration
    const dias = getDurationDays(mappedMembershipType);
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + dias);

    // 🔄 RENOVACIÓN INTELIGENTE: Si es renovación, obtener membresía anterior y aplicar lógica de precio
    const { esRenovacion, membershipId: oldMembershipId } = req.body;
    let previousPrice = null;
    let oldMembershipData = null;
    
    if (esRenovacion && oldMembershipId) {
      try {
        const oldMembershipRef = await db.collection('memberships').doc(oldMembershipId).get();
        if (oldMembershipRef.exists) {
          oldMembershipData = oldMembershipRef.data();
          previousPrice = oldMembershipData.monto;
          console.log(`✓ Membresía anterior encontrada: ${oldMembershipId} (Precio anterior: $${previousPrice})`);
        }
      } catch (err) {
        console.warn(`⚠️ No se pudo obtener membresía anterior ${oldMembershipId}:`, err.message);
      }
    }

    // Aplicar lógica inteligente de precios:
    // - Para paquetes contractuales (trimestral, semestral, anual, paquete01, paquete02): conservar precio si es renovación
    // - Para membresías regulares: usar precio actual siempre
    const precioFinal = getPriceForMembership(mappedMembershipType, previousPrice, esRenovacion);
    console.log(`💰 Precio aplicado: $${precioFinal} (${esRenovacion ? 'renovación' : 'nueva'}${isContractualPackage(mappedMembershipType) ? ', paquete contractual' : ''})`);

    // 🗑️ ELIMINAR membresía anterior si es renovación del MISMO TIPO
    // Esto previene duplicados y mantiene el historial limpio
    if (esRenovacion && oldMembershipId && oldMembershipData) {
      try {
        // Solo eliminar si es del mismo tipo para evitar afectar otras membresías activas
        if (oldMembershipData.tipo === mappedMembershipType) {
          await db.collection('memberships').doc(oldMembershipId).delete();
          console.log(`✓ Membresía anterior eliminada (renovación del mismo tipo): ${oldMembershipId}`);
        } else {
          // Si es tipo diferente, solo desactivar
          await db.collection('memberships').doc(oldMembershipId).update({
            estado: 'renovada',
            fechaRenovacion: new Date().toISOString()
          });
          console.log(`✓ Membresía anterior desactivada (tipo diferente): ${oldMembershipId}`);
        }
      } catch (err) {
        console.warn(`⚠️ No se pudo actualizar membresía anterior ${oldMembershipId}:`, err.message);
      }
    } else if (!esRenovacion) {
      // NUEVA MEMBRESÍA: Desactivar membresías del MISMO TIPO para permitir múltiples membresías de tipos diferentes
      const oldMemberships = await db.collection('memberships')
        .where('clienteId', '==', clienteId)
        .where('tipo', '==', mappedMembershipType)
        .where('estado', '==', 'activa')
        .get();

      if (!oldMemberships.empty) {
        const batch = db.batch();
        oldMemberships.forEach(doc => {
          batch.update(doc.ref, { 
            estado: 'reemplazada', 
            fechaReemplazo: new Date().toISOString() 
          });
        });
        await batch.commit();
        console.log(`✓ ${oldMemberships.size} membresía(s) anterior(es) del tipo "${mappedMembershipType}" desactivada(s)`);
      }
    }

    // Create new membership with intelligent pricing
    const membershipData = {
      clienteId: clientId,
      clienteNombre: `${nombre} ${apellido}`,
      tipo: mappedMembershipType,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      estado: 'activa',
      pagoId: orderId || 'N/A',
      monto: precioFinal,  // Use intelligent price, not request amount
      montoOriginal: amount || precioFinal,  // Keep original payment amount for audit
      esRenovacion: esRenovacion || false,  // Track if this is a renewal
      membershipAnteriorId: oldMembershipId || null,  // Link to previous membership
      fechaCreacion: new Date().toISOString()
    };

    const membershipRef = await db.collection('memberships').add(membershipData);
    console.log(`✓ Membresía creada: ${membershipRef.id}`);

    // Create payment record
    const paymentData = {
      clienteId: clientId,
      clienteName: `${nombre} ${apellido}`,
      monto: amount || 0,
      metodo: 'online_payment',
      estado: 'completado',
      orderId: orderId || 'N/A',
      fecha: new Date().toISOString(),
      tipo: mappedMembershipType
    };

    const paymentRef = await db.collection('payments').add(paymentData);
    console.log(`✓ Pago registrado: ${paymentRef.id}`);

    res.json({
      ok: true,
      clientId,
      isNewClient,
      membershipId: membershipRef.id,
      paymentId: paymentRef.id,
      message: isNewClient ? 'Cliente creado y membresía activada exitosamente' : 'Membresía renovada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error creando/actualizando cliente en CRM:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 4. WEBHOOKS DE MERCADO PAGO
app.post('/webhooks/mercadopago', async (req, res) => {
  try {
    const { id, type, data } = req.body;
    
    console.log(`📩 Webhook MP: ${type} (ID: ${id})`);
    
    // Solo procesamos pagos
    if (type !== 'payment') {
      return res.json({ acknowledged: true });
    }
    
    // Nota: En producción, aquí verificarías la firma del webhook
    // const xSignature = req.headers['x-signature'];
    // if (!verifyMPSignature(req.body, xSignature)) return res.status(401).json({});
    
    console.log(`✓ Webhook de pago reconocido: ${data.id}`);
    res.json({ acknowledged: true });
    
    // En producción, aquí actualizarías tu BD:
    // - Cambiar estado de orden a 'paid'
    // - Enviar correo de confirmación
    // - Registrar el paymentId en tu sistema
    
  } catch (error) {
    console.error("❌ Error en webhook:", error.message);
    res.status(500).json({ error: "Error procesando webhook" });
  }
});

// 5. CORREO (Protegido contra fallos)
app.post('/api/send-email', async (req, res) => {
  // Si no hay credenciales, respondemos éxito falso para no romper el flujo del usuario
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP no configurado, correo omitido.");
    return res.json({ success: true, message: "Email skipped (no config)" });
  }

  const { email, plan, price, orderId } = req.body;

  // Validar inputs
  if (!email || !plan || !price || !orderId) {
    return res.status(400).json({ error: "Datos incompletos para enviar email" });
  }

  const createTransporter = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    // Timeouts to avoid long blocking in server logs
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10000),
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
  });

  const sendEmailWithRetries = async (mailOptions, attempts = 3) => {
    let lastErr = null;
    for (let i = 1; i <= attempts; i++) {
      const transporter = createTransporter();
      try {
        // verify connection configuration (fast fail)
        await transporter.verify();
        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
      } catch (err) {
        lastErr = err;
        console.error(`⚠️ SMTP attempt ${i} failed (host=${process.env.SMTP_HOST || 'smtp.gmail.com'} port=${process.env.SMTP_PORT || 465}):`, err && err.message ? err.message : err);
        // small backoff between retries
        await new Promise(r => setTimeout(r, 500 * i));
      }
    }
    return { success: false, error: lastErr };
  };

  // HTTP fallback using MXRoute Email API (or compatible HTTP SMTP API)
  // It will use the same SMTP credentials (`SMTP_USER` and `SMTP_PASS`) for authentication
  // Configure `MXROUTE_API_URL` to point to the provider API endpoint (see https://docs.mxroute.com/docs/api/smtp-api.html).
  const sendEmailHttpFallback = async (mailOptions) => {
    // Default MXRoute API endpoint per docs
    const apiUrl = process.env.MXROUTE_API_URL || 'https://smtpapi.mxroute.com/';

    try {
      // Build payload to match MXRoute SMTP API spec
      const payload = {
        server: process.env.SMTP_HOST || process.env.MXROUTE_SMTP_SERVER || '',
        username: process.env.SMTP_USER,
        password: process.env.SMTP_PASS,
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        body: mailOptions.html || mailOptions.text || ''
      };

      // Basic validation
      if (!payload.server || !payload.username || !payload.password) {
        const err = new Error('Missing MXRoute required credentials/server in env vars');
        console.error('⚠️ HTTP fallback pre-check failed:', err.message);
        return { success: false, error: err };
      }

      const response = await axios.post(apiUrl, payload, {
        timeout: Number(process.env.MXROUTE_TIMEOUT || 10000),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = response && response.data ? response.data : {};
      if (response.status >= 200 && response.status < 300 && data.success) {
        return { success: true, info: data };
      }

      const message = data && data.message ? data.message : `HTTP fallback returned status ${response.status}`;
      return { success: false, error: new Error(message) };
    } catch (err) {
      console.error('⚠️ HTTP fallback error:', err && err.message ? err.message : err);
      return { success: false, error: err };
    }
  };

  try {
    // HTML mejorado con mejor diseño
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%); color: #eab308; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { padding: 30px 20px; color: #333; }
            .success-badge { background-color: #4caf50; color: white; padding: 12px 20px; border-radius: 5px; display: inline-block; font-weight: bold; margin-bottom: 20px; }
            .order-details { background-color: #f9f9f9; border-left: 4px solid #eab308; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { font-weight: 600; color: #555; }
            .detail-value { color: #333; text-align: right; }
            .total-row { display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #eab308; margin-top: 10px; font-size: 18px; font-weight: bold; }
            .total-value { color: #eab308; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .footer-link { color: #eab308; text-decoration: none; }
            .security-badge { display: inline-block; background-color: #e8f5e9; border: 1px solid #4caf50; color: #2e7d32; padding: 10px 15px; border-radius: 5px; font-size: 12px; margin-top: 15px; }
            .contact-info { margin-top: 20px; padding: 15px; background-color: #fff3e0; border-radius: 5px; }
            .contact-info p { margin: 5px 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>🏋️ FIT SANCTUARY</h1>
              <p style="margin: 10px 0; font-size: 14px;">Plataforma de Pagos Premium</p>
            </div>

            <!-- Main Content -->
            <div class="content">
              <div class="success-badge">✓ PAGO CONFIRMADO</div>

              <h2 style="color: #0f0f0f; margin-top: 20px;">¡Gracias por tu compra!</h2>
              <p>Tu pago ha sido procesado exitosamente. A continuación encontrarás los detalles de tu transacción.</p>

              <!-- Order Details -->
              <div class="order-details">
                <div class="detail-row">
                  <span class="detail-label">Plan Adquirido:</span>
                  <span class="detail-value"><strong>${plan}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Número de Orden:</span>
                  <span class="detail-value"><code style="background:#f0f0f0; padding:5px 10px; border-radius:3px;">${orderId}</code></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email Registrado:</span>
                  <span class="detail-value">${email}</span>
                </div>
                <div class="total-row">
                  <span>Total Pagado:</span>
                  <span class="total-value">$${price.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              <!-- Next Steps -->
              <h3 style="color: #0f0f0f; margin-top: 30px;">Próximos Pasos</h3>
              <ol style="color: #555; line-height: 1.8;">
                <li><strong>Preséntate en recepción</strong> con este correo o tu documento de identificación</li>
                <li><strong>Completa tus datos</strong> en nuestro sistema de membresía</li>
                <li><strong>Recibe tu acceso</strong> a todas las instalaciones y clases</li>
              </ol>

              <!-- Contact Info -->
              <div class="contact-info">
                <p><strong>¿Problemas con tu acceso?</strong></p>
                <p>Si tienes dudas o problemas con tu membresía, no dudes en contactarnos:</p>
                <p>📞 <a href="https://wa.me/525533727291" class="footer-link" style="text-decoration: underline;">WhatsApp: +52 55 3372 7291</a></p>
                <p>📧 Email: soporte@fitsanctuary.com</p>
              </div>

              <!-- Security Info -->
              <div class="security-badge">
                🔒 Transacción segura procesada con Mercado Pago
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 10px 0;">© 2025 Fit Sanctuary Studio. Todos los derechos reservados.</p>
              <p style="margin: 10px 0; color: #999;">Este es un correo automático, por favor no responda.</p>
              <p style="margin: 10px 0;">
                <a href="https://pagos.fitsanctuary.mx" class="footer-link">Visita nuestro sitio de pagos</a> | 
                <a href="https://www.instagram.com/fit.sanctuary.mx/" class="footer-link">Síguenos en Instagram</a>
              </p>
            </div>
          </div>
        </body>
        `;

        const mailOptions = {
          from: `Modulo de Pagos Fit Sanctuary <${process.env.SMTP_USER}>`,
          to: email,
          subject: `✓ Pago Confirmado - ${plan} #${orderId}`,
          html: htmlContent,
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'Content-Transfer-Encoding': '8bit'
          },
          text: `
    Confirmación de Pago - Fit Sanctuary

    ¡Gracias por tu compra!

    DETALLES DE LA TRANSACCIÓN:
    ---------------------------------
    Plan Adquirido: ${plan}
    Número de Orden: ${orderId}
    Total Pagado: $${price} MXN

    Por favor, preséntate en recepción con este correo para completar tu registro.

    ¿Preguntas? Contáctanos vía WhatsApp: +52 55 3372 7291

    Fit Sanctuary Studio
          `,
        };

        const sendResult = await sendEmailWithRetries(mailOptions, Number(process.env.SMTP_MAX_RETRIES || 3));
        if (sendResult.success) {
          console.log(`✅ Email enviado a ${email} (Orden: ${orderId})`);
          return res.json({ success: true, message: "Email de confirmación enviado correctamente", messageId: sendResult.info && sendResult.info.messageId });
        } else {
          console.error('❌ Todos los intentos de envío SMTP fallaron:', sendResult.error && sendResult.error.message ? sendResult.error.message : sendResult.error);
          // Intentar HTTP fallback (MXRoute API)
          try {
            const httpFallbackResult = await sendEmailHttpFallback(mailOptions);
            if (httpFallbackResult.success) {
              console.log(`✅ Email enviado vía HTTP fallback a ${email} (Orden: ${orderId})`);
              return res.json({ success: true, message: "Email enviado vía HTTP fallback", info: httpFallbackResult.info });
            } else {
              console.error('❌ HTTP fallback falló:', httpFallbackResult.error && httpFallbackResult.error.message ? httpFallbackResult.error.message : httpFallbackResult.error);
              return res.json({ success: true, warning: "Email no enviado pero pago confirmado. El equipo será notificado para confirmación manual." });
            }
          } catch (err) {
            console.error('❌ Error en HTTP fallback:', err && err.message ? err.message : err);
            return res.json({ success: true, warning: "Email no enviado pero pago confirmado. Error en fallback HTTP." });
          }
        }
  } catch (error) {
    console.error("❌ Error enviando email (unexpected):", error && error.message ? error.message : error);
    return res.json({ success: true, warning: "Email no enviado pero pago confirmado. Error inesperado en el servidor." });
  }
});

// --- OBTENER HORARIOS DE PILATES ---
app.get('/api/schedules/pilates', async (req, res) => {
  try {
    // Intentar obtener desde el CRM primero
    try {
      const crmResponse = await axios.get(`${CRM_API_URL}/api/schedules`);
      if (crmResponse.data && crmResponse.data.schedules) {
        return res.json({ 
          schedules: crmResponse.data.schedules 
        });
      }
    } catch (crmError) {
      console.log('⚠️ CRM API no disponible, intentando Firestore');
    }

    // Si el CRM no funciona, obtener desde Firestore
    const schedulesRef = db.collection('schedules');
    const snapshot = await schedulesRef.get();
    
    const schedules = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      schedules.push({
        id: doc.id,
        className: data.className || '',
        instructor: data.instructor || '',
        dayOfWeek: data.dayOfWeek || 0,
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        capacity: data.capacity || 20,
        description: data.description || ''
      });
    });

    res.json({ 
      schedules: schedules,
      source: 'firestore'
    });
  } catch (error) {
    console.error('Error getting Pilates schedules:', error);
    res.status(500).json({ 
      error: 'Error obtaining schedules',
      schedules: []
    });
  }
});

// --- OBTENER MEMBRESÍA POR ID (para renovaciones) ---
app.get('/api/memberships/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'ID de membresía inválido' });
    }

    const membershipRef = await db.collection('memberships').doc(id).get();
    
    if (!membershipRef.exists) {
      return res.status(404).json({ error: 'Membresía no encontrada' });
    }

    const membershipData = membershipRef.data();
    res.json({
      id: membershipRef.id,
      ...membershipData
    });
  } catch (error) {
    console.error('Error obteniendo membresía:', error);
    res.status(500).json({ error: 'Error al obtener membresía: ' + error.message });
  }
});

// --- OBTENER MEMBRESÍAS ACTIVAS DE UN CLIENTE ---
app.get('/api/clients/:clientId/active-memberships', async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId || clientId === 'null' || clientId === 'undefined') {
      return res.status(400).json({ error: 'ID de cliente inválido' });
    }

    const membershipsRef = await db.collection('memberships')
      .where('clienteId', '==', clientId)
      .where('estado', '==', 'activa')
      .get();

    const memberships = [];
    membershipsRef.forEach(doc => {
      memberships.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      clientId,
      activeMemberships: memberships,
      count: memberships.length
    });
  } catch (error) {
    console.error('Error obteniendo membresías activas:', error);
    res.status(500).json({ error: 'Error al obtener membresías: ' + error.message });
  }
});

// --- RENOVAR MEMBRESÍA DESDE EL SISTEMA (CRM) ---
app.post('/api/crm/renew-membership', async (req, res) => {
  try {
    const { clientId, oldMembershipId, membershipType, esRenovacion } = req.body;

    if (!clientId || !oldMembershipId || !membershipType) {
      return res.status(400).json({ error: 'Faltan datos requeridos (clientId, oldMembershipId, membershipType)' });
    }

    // Obtener información del cliente y membresía anterior
    const clientDoc = await db.collection('clients').doc(clientId).get();
    if (!clientDoc.exists) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const oldMembershipDoc = await db.collection('memberships').doc(oldMembershipId).get();
    if (!oldMembershipDoc.exists) {
      return res.status(404).json({ error: 'Membresía anterior no encontrada' });
    }

    const client = clientDoc.data();
    const oldMembership = oldMembershipDoc.data();

    // Marcar membresía anterior como renovada
    await db.collection('memberships').doc(oldMembershipId).update({
      estado: 'renovada',
      fechaRenovacion: new Date().toISOString()
    });

    console.log(`✓ Membresía anterior marcada como renovada: ${oldMembershipId}`);

    // Calcular fecha de fin (30 días por defecto, excepto membresías especiales)
    const duracionDias = {
      'estudiante': 30,
      'general': 30,
      'trimestral': 90,
      'semestral': 180,
      'anual': 365,
      'paquete01': 30,
      'paquete02': 30,
      'pilates': 30,
      'pilates_2x': 30,
      'hyrox': 30,
      'grupal_3m': 90
    };

    const dias = duracionDias[membershipType] || 30;
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + dias);

    // Crear nueva membresía
    const newMembershipData = {
      clienteId: clientId,
      clienteNombre: client.nombre || `${client.nombre} ${client.apellido}`,
      tipo: membershipType,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      estado: 'activa',
      pagoId: 'renovacion_manual',
      monto: oldMembership.monto || oldMembership.precio || 579,
      fechaCreacion: new Date().toISOString(),
      renovadaDesde: oldMembershipId
    };

    const newMembershipRef = await db.collection('memberships').add(newMembershipData);
    console.log(`✓ Nueva membresía creada por renovación: ${newMembershipRef.id}`);

    // Crear registro de pago para auditoría
    const paymentData = {
      clienteId: clientId,
      clienteName: client.nombre || `${client.nombre} ${client.apellido}`,
      monto: oldMembership.monto || oldMembership.precio || 579,
      metodo: 'renovacion_manual',
      estado: 'completado',
      orderId: `renovacion_${oldMembershipId}`,
      fecha: new Date().toISOString(),
      tipo: membershipType,
      notas: 'Renovación realizada manualmente desde el CRM'
    };

    const paymentRef = await db.collection('payments').add(paymentData);
    console.log(`✓ Pago registrado para renovación: ${paymentRef.id}`);

    res.json({
      ok: true,
      clientId,
      oldMembershipId,
      newMembershipId: newMembershipRef.id,
      paymentId: paymentRef.id,
      message: '✅ Membresía renovada exitosamente desde el sistema'
    });
  } catch (error) {
    console.error('Error renewing membership:', error);
    res.status(500).json({ error: 'Error al renovar membresía: ' + error.message });
  }
});

// --- SERVIR FRONTEND ---
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
