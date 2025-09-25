const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
  cost: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: { min: 0 },
  },
  billing_cycle: {
    type: DataTypes.ENUM('weekly', 'monthly', 'quarterly', 'semi_annual', 'annual'),
    allowNull: false,
  },
  billing_day: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  next_billing_date: DataTypes.DATE,
  payment_account_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'cancelled', 'expired'),
    allowNull: false,
  },
  trial_end_date: DataTypes.DATE,
  is_trial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  icon: DataTypes.STRING,
  service_logo: DataTypes.STRING,
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: DataTypes.DATE,
}, {
  timestamps: true,
  underscored: true,
});

module.exports = Subscription;
