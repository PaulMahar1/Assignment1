const { Subscription, Category, PaymentAccount } = require('../models');
const { Op } = require('sequelize');

function getPeriodDates(period, start, end) {
  // Returns start/end dates for the requested period
  const now = start ? new Date(start) : new Date();
  let periodStart, periodEnd;
  switch (period) {
    case 'daily':
      periodStart = new Date(now.setHours(0,0,0,0));
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 1);
      break;
    case 'weekly':
      periodStart = new Date(now);
      periodStart.setDate(periodStart.getDate() - periodStart.getDay());
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 7);
      break;
    case 'monthly':
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'quarterly':
      const q = Math.floor(now.getMonth() / 3);
      periodStart = new Date(now.getFullYear(), q * 3, 1);
      periodEnd = new Date(now.getFullYear(), (q + 1) * 3, 1);
      break;
    case 'annual':
      periodStart = new Date(now.getFullYear(), 0, 1);
      periodEnd = new Date(now.getFullYear() + 1, 0, 1);
      break;
    default:
      periodStart = start ? new Date(start) : new Date();
      periodEnd = end ? new Date(end) : new Date();
  }
  return { periodStart, periodEnd };
}

module.exports = {
  async getCosts(req, res) {
    const { period, start_date, end_date, category_id } = req.query;
    if (!period) return res.status(400).json({ error: { code: 'bad_request', message: 'Period is required' } });
    const { periodStart, periodEnd } = getPeriodDates(period, start_date, end_date);
    const where = {
      status: 'active',
      start_date: { [Op.lte]: periodEnd },
      [Op.or]: [
        { end_date: null },
        { end_date: { [Op.gte]: periodStart } }
      ]
    };
    if (category_id) where.category_id = category_id;
    const subs = await Subscription.findAll({ where, include: [Category, PaymentAccount] });
    // Cost calculations
    let total_cost = 0;
    let cost_by_category = {};
    let cost_by_payment_account = {};
    subs.forEach(sub => {
      total_cost += parseFloat(sub.cost);
      if (sub.Category) {
        cost_by_category[sub.Category.id] = (cost_by_category[sub.Category.id] || 0) + parseFloat(sub.cost);
      }
      if (sub.PaymentAccount) {
        cost_by_payment_account[sub.PaymentAccount.id] = (cost_by_payment_account[sub.PaymentAccount.id] || 0) + parseFloat(sub.cost);
      }
    });
    // Format response
    res.json({
      total_cost,
      period_cost: total_cost,
      cost_by_category: Object.entries(cost_by_category).map(([id, cost]) => ({ category: id, cost, percentage: cost / total_cost })),
      cost_by_payment_account: Object.entries(cost_by_payment_account).map(([id, cost]) => ({ payment_account: id, cost, percentage: cost / total_cost })),
      trend_data: [], // Placeholder
    });
  },

  async getSpendingComparison(req, res) {
    const { period } = req.query;
    if (!period) return res.status(400).json({ error: { code: 'bad_request', message: 'Period is required' } });
    // Current period
    const { periodStart, periodEnd } = getPeriodDates(period);
    const currentSubs = await Subscription.findAll({
      where: {
        status: 'active',
        start_date: { [Op.lte]: periodEnd },
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gte]: periodStart } }
        ]
      }
    });
    const current_cost = currentSubs.reduce((sum, sub) => sum + parseFloat(sub.cost), 0);
    // Previous period
    let prevStart, prevEnd;
    switch (period) {
      case 'monthly':
        prevStart = new Date(periodStart);
        prevStart.setMonth(prevStart.getMonth() - 1);
        prevEnd = new Date(periodStart);
        break;
      case 'quarterly':
        prevStart = new Date(periodStart);
        prevStart.setMonth(prevStart.getMonth() - 3);
        prevEnd = new Date(periodStart);
        break;
      case 'annual':
        prevStart = new Date(periodStart);
        prevStart.setFullYear(prevStart.getFullYear() - 1);
        prevEnd = new Date(periodStart);
        break;
      default:
        prevStart = new Date(periodStart);
        prevEnd = new Date(periodStart);
    }
    const prevSubs = await Subscription.findAll({
      where: {
        status: 'active',
        start_date: { [Op.lte]: prevEnd },
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gte]: prevStart } }
        ]
      }
    });
    const prev_cost = prevSubs.reduce((sum, sub) => sum + parseFloat(sub.cost), 0);
    const change_amount = current_cost - prev_cost;
    const change_percentage = prev_cost ? change_amount / prev_cost : 0;
    res.json({
      current_period: { cost: current_cost, subscription_count: currentSubs.length },
      previous_period: { cost: prev_cost, subscription_count: prevSubs.length },
      change_percentage,
      change_amount,
    });
  },
};
