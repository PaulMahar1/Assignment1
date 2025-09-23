const { Subscription, PaymentAccount, Category } = require('../models');

module.exports = {
  async getAll(req, res) {
    // Filtering, sorting, pagination
    const { status, category_id, sort_by = 'created_at', sort_order = 'asc', limit = 50, offset = 0 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    const order = [[sort_by, sort_order]];
    const subscriptions = await Subscription.findAndCountAll({
      where,
      order,
      limit: Math.min(Number(limit), 200),
      offset: Number(offset),
      include: [PaymentAccount, Category],
    });
    res.json({
      subscriptions: subscriptions.rows,
      total_count: subscriptions.count,
      has_more: subscriptions.count > Number(limit) + Number(offset),
    });
  },

  async getById(req, res) {
    const sub = await Subscription.findByPk(req.params.id, { include: [PaymentAccount, Category] });
    if (!sub) return res.status(404).json({ error: { code: 'not_found', message: 'Subscription not found' } });
    res.json(sub);
  },

  async create(req, res) {
    try {
      const sub = await Subscription.create(req.body);
      res.status(201).json(sub);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const sub = await Subscription.findByPk(req.params.id);
      if (!sub) return res.status(404).json({ error: { code: 'not_found', message: 'Subscription not found' } });
      await sub.update(req.body);
      res.json(sub);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },

  async remove(req, res) {
    const sub = await Subscription.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ error: { code: 'not_found', message: 'Subscription not found' } });
    await sub.destroy();
    res.status(204).end();
  },

  // Upcoming payments endpoint
  async getUpcoming(req, res) {
    const days = Number(req.query.days) || 30;
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const subs = await Subscription.findAll({
      where: {
        next_billing_date: { $between: [now, future] },
        status: 'active',
      },
      include: [PaymentAccount, Category],
    });
    const upcoming = subs.map(sub => ({
      subscription: sub,
      days_until_payment: Math.ceil((new Date(sub.next_billing_date) - now) / (1000 * 60 * 60 * 24)),
    }));
    res.json({ upcoming_subscriptions: upcoming });
  },
};
