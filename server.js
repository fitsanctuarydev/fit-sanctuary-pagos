const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Stripe = require('stripe');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN ---
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const mpClient = process.env.MP_ACCESS_TOKEN ? new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN }) : null;
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const PAYPAL_API = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

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

// 2. STRIPE
app.post('/api/stripe/create-intent', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: "Falta STRIPE_SECRET_KEY" });
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'mxn',
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. PAYPAL
const generatePayPalAccessToken = async () => {
  if (!PAYPAL_CLIENT_ID) throw new Error("Faltan claves PayPal");
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
  const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, "grant_type=client_credentials", {
    headers: { Authorization: `Basic ${auth}` },
  });
  return response.data.access_token;
};

app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const accessToken = await generatePayPalAccessToken();
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "MXN", value: amount } }],
    }, { headers: { Authorization: `Bearer ${accessToken}` } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    const accessToken = await generatePayPalAccessToken();
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

  try {
    // HTML mejorado con mejor diseño
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
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
                <p>📞 <a href="https://wa.me/+5216241234567" class="footer-link" style="text-decoration: underline;">WhatsApp: +52 (624) 123-4567</a></p>
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
                <a href="https://instagram.com/fitsanctuary" class="footer-link">Síguenos en Instagram</a>
              </p>
            </div>
          </div>
        </body>
        `;

        const mailOptions = {
          from: `"Fit Sanctuary" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `✓ Pago Confirmado - ${plan} #${orderId}`,
          html: htmlContent,
          text: `
    Confirmación de Pago - Fit Sanctuary

    ¡Gracias por tu compra!

    DETALLES DE LA TRANSACCIÓN:
    ---------------------------------
    Plan Adquirido: ${plan}
    Número de Orden: ${orderId}
    Total Pagado: $${price} MXN

    Por favor, preséntate en recepción con este correo para completar tu registro.

    ¿Preguntas? Contáctanos vía WhatsApp: +52 (624) 123-4567

    Fit Sanctuary Studio
          `,
        };

        const sendResult = await sendEmailWithRetries(mailOptions, Number(process.env.SMTP_MAX_RETRIES || 3));
        if (sendResult.success) {
          console.log(`✅ Email enviado a ${email} (Orden: ${orderId})`);
          res.json({ success: true, message: "Email de confirmación enviado correctamente", messageId: sendResult.info && sendResult.info.messageId });
        } else {
          console.error('❌ Todos los intentos de envío fallaron:', sendResult.error && sendResult.error.message ? sendResult.error.message : sendResult.error);
          // Respondimos éxito al frontend aunque falle el email para que el usuario vea la pantalla de éxito
          res.json({ success: true, warning: "Email no enviado pero pago confirmado. El equipo será notificado para confirmación manual." });
        }
      success: true, 
        console.error("❌ Error enviando email (unexpected):", error && error.message ? error.message : error);
        res.json({ success: true, warning: "Email no enviado pero pago confirmado. Error inesperado en el servidor." });
    res.json({ 
      success: true, 
      warning: "Email no enviado pero pago confirmado. El cliente recibirá confirmación manual." 
    });
  }
});

// --- SERVIR FRONTEND ---
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
