'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('Password123!', 10);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Demo User 1',
        email: 'demo1@example.com',
        password_hash: hash,
        phone: '+5215511111111',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Demo User 2',
        email: 'demo2@example.com',
        password_hash: hash,
        phone: '+5215522222222',
        created_at: now,
        updated_at: now
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: ['demo1@example.com', 'demo2@example.com'] });
  }
};
