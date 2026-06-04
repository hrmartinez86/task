'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('card_links', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cards', key: 'id' },
        onDelete: 'CASCADE'
      },
      label: { type: Sequelize.STRING(255), allowNull: false },
      url: { type: Sequelize.STRING(2048), allowNull: false },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('card_links');
  }
};
