const { Subscription } = require('../models');
const { Parser } = require('json2csv');

module.exports = {
  async exportSubscriptions(req, res) {
    const { format = 'json', include_cancelled = false, category_id } = req.query;
    const where = {};
    if (!include_cancelled) where.status = { $ne: 'cancelled' };
    if (category_id) where.category_id = category_id;
    const subs = await Subscription.findAll({ where });
    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(subs.map(s => s.toJSON()));
      res.header('Content-Type', 'text/csv');
      res.attachment('subscriptions.csv');
      return res.send(csv);
    }
    res.json(subs);
  },
  async exportAnalytics(req, res) {
    // Placeholder: implement analytics export logic
    res.json({ message: 'Analytics export not implemented yet.' });
  },
};
