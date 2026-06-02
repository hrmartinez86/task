const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Card extends Model {}

Card.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    listId: { type: DataTypes.INTEGER, allowNull: false },
    assigneeId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT('long'), allowNull: true },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium'
    },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    dueReminderSent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  { sequelize, modelName: 'Card', tableName: 'cards' }
);

module.exports = Card;
