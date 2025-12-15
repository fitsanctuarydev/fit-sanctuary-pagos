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

// 1. MERCADO PAGO (Preferencia Limpia)
app.post('/api/mp/create-preference', async (req, res) => {
  if (!mpClient) return res.status(500).json({ error: "Falta MP_ACCESS_TOKEN" });
  try {
    const { title, price } = req.body;
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [{ title: title, unit_price: Number(price), quantity: 1, currency_id: 'MXN' }],
        back_urls: { success: "https://fit-sanctuary.com", failure: "https://fit-sanctuary.com" },
        auto_return: "approved",
        // No forzamos excluded_payment_methods para evitar errores de cuenta
      }
    });
    res.json({ id: result.id });
  } catch (error) {
    console.error("MP Error:", error);
    res.status(500).json({ error: error.message });
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

// 4. CORREO (Protegido contra fallos)
app.post('/api/send-email', async (req, res) => {
  // Si no hay credenciales, respondemos éxito falso para no romper el flujo del usuario
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP no configurado, correo omitido.");
    return res.json({ success: true, message: "Email skipped (no config)" });
  }

  const { email, plan, price, orderId } = req.body;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: '"Fit Sanctuary" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: `Confirmación de Pago #${orderId}`,
      html: `
        <div style="font-family:sans-serif;background:#111;color:#fff;padding:20px;border-radius:10px;">
          <h2 style="color:#eab308;">¡Pago Exitoso!</h2>
          <p>Bienvenido a Fit Sanctuary.</p>
          <div style="background:#222;padding:15px;margin:20px 0;border-radius:5px;">
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Total:</strong> $${price} MXN</p>
            <p><strong>Orden:</strong> ${orderId}</p>
          </div>
          <p>Muestra este correo en recepción.</p>
        </div>
      `,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando email:", error.message);
    // Respondemos éxito al frontend aunque falle el email para que el usuario vea la pantalla de éxito
    res.json({ success: true, warning: "Email failed but payment ok" });
  }
});

// --- SERVIR FRONTEND ---
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
