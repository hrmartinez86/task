'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attachments', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cards', key: 'id' },
        onDelete: 'CASCADE'
      },
      file_name: { type: Sequelize.STRING(255), allowNull: false },
      file_path: { type: Sequelize.STRING(255), allowNull: false },
      mime_type: { type: Sequelize.STRING(120), allowNull: false },
      size: { type: Sequelize.INTEGER, allowNull: false },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('attachments');
  }
};
