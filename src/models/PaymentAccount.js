const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentAccount = sequelize.define('PaymentAccount', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_account', 'paypal', 'apple_pay', 'google_pay', 'other'),
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = PaymentAccount;
