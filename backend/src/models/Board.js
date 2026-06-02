const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Board extends Model {}

Board.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, modelName: 'Board', tableName: 'boards' }
);

module.exports = Board;
