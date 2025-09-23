const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const models = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import routes
const subscriptionRoutes = require('./routes/subscriptions');
const paymentAccountRoutes = require('./routes/paymentAccounts');
const categoryRoutes = require('./routes/categories');
const budgetAlertRoutes = require('./routes/budgetAlerts');
const notificationPreferenceRoutes = require('./routes/notificationPreferences');
const analyticsRoutes = require('./routes/analytics');
const exportRoutes = require('./routes/export');

app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payment-accounts', paymentAccountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budget-alerts', budgetAlertRoutes);
app.use('/api/notification-preferences', notificationPreferenceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Subscription Tracker API is running.' });
});

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.error('Database sync error:', err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
