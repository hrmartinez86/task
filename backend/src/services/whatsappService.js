const axios = require('axios');
const env = require('../config/env');

async function sendWhatsAppMessage(to, message) {
  try {
    await axios.post(env.whatsappWebhookUrl, {
      to,
      message,
      source: 'trello-backend'
    });
  } catch (error) {
    console.error('WhatsApp notification failed:', error.message);
  }
}

module.exports = {
  sendWhatsAppMessage
};
