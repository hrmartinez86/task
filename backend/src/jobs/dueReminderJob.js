const { Op } = require('sequelize');
const { Card, User } = require('../models');
const { notifyDueSoon } = require('../services/notificationService');

function startDueReminderJob() {
  const intervalMs = 60 * 1000;

  setInterval(async () => {
    try {
      const now = new Date();
      const next24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const cards = await Card.findAll({
        where: {
          dueDate: {
            [Op.gt]: now,
            [Op.lte]: next24h
          },
          dueReminderSent: false,
          assigneeId: {
            [Op.ne]: null
          }
        }
      });

      for (const card of cards) {
        const user = await User.findByPk(card.assigneeId);
        if (!user) {
          continue;
        }

        await notifyDueSoon(card, user);
        card.dueReminderSent = true;
        await card.save();
      }
    } catch (error) {
      console.error('Due reminder job error:', error.message);
    }
  }, intervalMs);
}

module.exports = {
  startDueReminderJob
};
