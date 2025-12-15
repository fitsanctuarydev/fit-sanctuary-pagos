const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- MOCK API ---
app.post('/api/create-preference', async (req, res) => {
  console.log("Creando preferencia para:", req.body.title);
  res.json({ id: "mock_preference_id" }); 
});

app.post('/api/create-payment-intent', async (req, res) => {
  console.log("Intentando cobro Stripe por:", req.body.amount);
  res.json({ clientSecret: "mock_secret" });
});

// --- SERVIR FRONTEND ---
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor listo en puerto ' + PORT));
