const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(40), allowNull: true },
    resetToken: { type: DataTypes.STRING(255), allowNull: true },
    resetTokenExpiresAt: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, modelName: 'User', tableName: 'users' }
);

module.exports = User;
