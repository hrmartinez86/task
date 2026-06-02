'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      list_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lists', key: 'id' },
        onDelete: 'CASCADE'
      },
      assignee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL'
      },
      title: { type: Sequelize.STRING(180), allowNull: false },
      description: { type: Sequelize.TEXT('long') },
      priority: { type: Sequelize.ENUM('low', 'medium', 'high'), allowNull: false, defaultValue: 'medium' },
      due_date: { type: Sequelize.DATE },
      due_reminder_sent: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('cards');
  }
};
