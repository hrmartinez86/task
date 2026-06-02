const { User } = require('../models');
const { sendWhatsAppMessage } = require('./whatsappService');

async function notifyTaskAssigned(card) {
  if (!card.assigneeId) {
    return;
  }

  const assignee = await User.findByPk(card.assigneeId);
  if (!assignee) {
    return;
  }

  const phone = assignee.phone || '+5215512345678';
  const message = `Nueva tarea asignada: ${card.title}. Prioridad: ${card.priority}.`;
  await sendWhatsAppMessage(phone, message);
}

async function notifyDueSoon(card, user) {
  const phone = user.phone || '+5215512345678';
  const message = `Recordatorio: la tarea "${card.title}" vence en menos de 24 horas.`;
  await sendWhatsAppMessage(phone, message);
}

module.exports = {
  notifyTaskAssigned,
  notifyDueSoon
};
