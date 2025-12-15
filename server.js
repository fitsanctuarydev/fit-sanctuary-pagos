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

// --- CONFIGURACIÓN PAGOS ---
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const mpClient = process.env.MP_ACCESS_TOKEN ? new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN }) : null;
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const PAYPAL_API = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

// --- ENDPOINTS ---

// 1. MERCADO PAGO (Generar Preferencia)
app.post('/api/mp/create-preference', async (req, res) => {
  if (!mpClient) return res.status(500).json({ error: "Falta MP_ACCESS_TOKEN" });
  try {
    const { title, price } = req.body;
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [{ title, unit_price: Number(price), quantity: 1, currency_id: 'MXN' }],
        back_urls: { success: "https://fit-sanctuary-pagos.onrender.com", failure: "https://fit-sanctuary-pagos.onrender.com" },
        auto_return: "approved",
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

// 4. CORREO (SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

app.post('/api/send-email', async (req, res) => {
  const { email, plan, price, orderId } = req.body;
  if (!process.env.SMTP_USER) return res.json({ success: true, message: "Mock email" });

  try {
    await transporter.sendMail({
      from: '"Fit Sanctuary" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: `Confirmación #${orderId}`,
      html: `<h1>Pago Exitoso</h1><p>Plan: ${plan}</p><p>Total: $${price}</p>`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ error: "Error mail" });
  }
});

// --- SERVIR FRONTEND ---
// Esto es lo que hace que funcione en Render: Sirve la App de React compilada
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
