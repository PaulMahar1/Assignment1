const express = require('express');
const router = express.Router();
const controller = require('../controllers/exportController');

router.get('/subscriptions', controller.exportSubscriptions);
router.get('/analytics', controller.exportAnalytics);

module.exports = router;
