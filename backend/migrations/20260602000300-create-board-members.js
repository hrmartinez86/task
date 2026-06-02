'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('board_members', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      board_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'boards', key: 'id' },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      role: { type: Sequelize.ENUM('owner', 'member'), allowNull: false, defaultValue: 'member' },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('board_members', {
      fields: ['board_id', 'user_id'],
      type: 'unique',
      name: 'board_members_board_user_unique'
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('board_members');
  }
};
