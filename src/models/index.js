const Subscription = require('./Subscription');
const PaymentAccount = require('./PaymentAccount');
const Category = require('./Category');
const BudgetAlert = require('./BudgetAlert');
const NotificationPreference = require('./NotificationPreference');

// Associations
Subscription.belongsTo(PaymentAccount, { foreignKey: 'payment_account_id' });
Subscription.belongsTo(Category, { foreignKey: 'category_id' });
BudgetAlert.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  Subscription,
  PaymentAccount,
  Category,
  BudgetAlert,
  NotificationPreference,
};
