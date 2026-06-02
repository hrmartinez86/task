const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'whatsapp-mock' });
});

app.post('/webhook/send', (req, res) => {
  const { to, message, source } = req.body;

  // Mock seguro: imprime el envio en consola.
  // Para integracion real, reemplazar por llamada a la API de WhatsApp Business.
  console.log(`[WhatsApp Mock] to=${to} source=${source} message="${message}"`);

  res.json({ success: true, provider: 'mock', to, message });
});

app.listen(port, () => {
  console.log(`WhatsApp mock listening on port ${port}`);
});
