const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Attachment extends Model {}

Attachment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cardId: { type: DataTypes.INTEGER, allowNull: false },
    fileName: { type: DataTypes.STRING(255), allowNull: false },
    filePath: { type: DataTypes.STRING(255), allowNull: false },
    mimeType: { type: DataTypes.STRING(120), allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, modelName: 'Attachment', tableName: 'attachments' }
);

module.exports = Attachment;
