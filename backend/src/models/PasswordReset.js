const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PasswordReset extends Model {}

PasswordReset.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING(255), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  { sequelize, modelName: 'PasswordReset', tableName: 'password_resets' }
);

module.exports = PasswordReset;
