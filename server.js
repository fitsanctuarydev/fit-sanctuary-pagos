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

// --- CONFIGURACIÓN CORREO (SMTP) ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true para 465, false para otros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Template de Correo HTML
const getEmailTemplate = (plan, price, orderId) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background-color: #0f0f0f; color: #ffffff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 1px solid #333; border-radius: 10px; overflow: hidden; }
    .header { background-color: #000; padding: 20px; text-align: center; border-bottom: 2px solid #ca8a04; }
    .content { padding: 30px; }
    .h1 { color: #eab308; text-transform: uppercase; margin: 0; }
    .details { background-color: #252525; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; font-size: 12px; color: #666; padding: 20px; }
    .button { display: inline-block; background-color: #eab308; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="h1">Fit Sanctuary</h1>
    </div>
    <div class="content">
      <h2>¡Pago Confirmado!</h2>
      <p>Hola, gracias por unirte a la familia Fit Sanctuary. Tu membresía ha sido activada correctamente.</p>
      
      <div class="details">
        <p><strong>Orden:</strong> #${orderId}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Total Pagado:</strong> $${price} MXN</p>
      </div>

      <p>Presenta este correo en recepción para recoger tu acceso.</p>
      
      <center>
        <a href="https://wa.me/525533727291" class="button">Contactar Soporte</a>
      </center>
    </div>
    <div class="footer">
      Fit Sanctuary Studio - Tehuacán, Puebla
    </div>
  </div>
</body>
</html>
`;

// Endpoint para enviar correo
app.post('/api/send-email', async (req, res) => {
  const { email, plan, price, orderId } = req.body;
  
  if (!process.env.SMTP_USER) {
    console.log("⚠️ SMTP no configurado. Saltando envío de correo.");
    return res.json({ success: true, message: "Mock email sent" });
  }

  try {
    await transporter.sendMail({
      from: '"Fit Sanctuary Pagos" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: `Confirmación de Pago #${orderId} - Fit Sanctuary`,
      html: getEmailTemplate(plan, price, orderId),
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ error: "Error enviando correo" });
  }
});

// --- CONFIGURACIÓN PAGOS ---
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const mpClient = process.env.MP_ACCESS_TOKEN ? new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN }) : null;
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const PAYPAL_API = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

// 1. STRIPE
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

// 2. MERCADO PAGO
app.post('/api/mp/create-preference', async (req, res) => {
  if (!mpClient) return res.status(500).json({ error: "Falta MP_ACCESS_TOKEN" });
  try {
    const { title, price } = req.body;
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [{ title, unit_price: Number(price), quantity: 1, currency_id: 'MXN' }],
        back_urls: { success: "https://fit-sanctuary.com", failure: "https://fit-sanctuary.com" },
      }
    });
    res.json({ id: result.id });
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

app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
