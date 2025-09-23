const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BudgetAlert = sequelize.define('BudgetAlert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  limit_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: { min: 0 },
  },
  period: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual'),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = BudgetAlert;
