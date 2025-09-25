const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const { sequelize, testConnection } = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Read and parse swagger.json
const swaggerPath = path.join(__dirname, '../swagger.json');
let swaggerDocument;
try {
    const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
    swaggerDocument = JSON.parse(swaggerFile);
    // Serve Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
    console.error('Error loading swagger.json:', err);
}

// Import models
const models = require('./models');

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
  res.json({ 
    message: 'Subscription Tracker API is running.',
    docs: '/api-docs'
  });
});

// Start server and initialize database
const startServer = async () => {
  // Start the server first
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
  });

  // Then try to connect to database
  const isConnected = await testConnection();
  if (isConnected) {
    try {
      await sequelize.sync();
      console.log('Database synced successfully');
    } catch (err) {
      console.error('Database sync error:', err);
      console.log('API will run with limited functionality');
    }
  } else {
    console.log('API will run with limited functionality - database not available');
  }
};

startServer();
