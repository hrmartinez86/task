const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class List extends Model {}

List.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    boardId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(120), allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  { sequelize, modelName: 'List', tableName: 'lists' }
);

module.exports = List;
