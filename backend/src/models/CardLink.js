const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CardLink extends Model {}

CardLink.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cardId: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING(255), allowNull: false },
    url: { type: DataTypes.STRING(2048), allowNull: false }
  },
  { sequelize, modelName: 'CardLink', tableName: 'card_links' }
);

module.exports = CardLink;
