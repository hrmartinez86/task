const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class BoardMember extends Model {}

BoardMember.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    boardId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    role: { type: DataTypes.ENUM('owner', 'member'), allowNull: false, defaultValue: 'member' }
  },
  { sequelize, modelName: 'BoardMember', tableName: 'board_members' }
);

module.exports = BoardMember;
