const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationPreference = sequelize.define('NotificationPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('upcoming_payment', 'trial_ending', 'budget_exceeded'),
    allowNull: false,
  },
  days_before: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = NotificationPreference;
