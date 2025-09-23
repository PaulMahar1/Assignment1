const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/costs', controller.getCosts);
router.get('/spending-comparison', controller.getSpendingComparison);

module.exports = router;
