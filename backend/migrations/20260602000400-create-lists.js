'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lists', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      board_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'boards', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: { type: Sequelize.STRING(120), allowNull: false },
      position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('lists');
  }
};
