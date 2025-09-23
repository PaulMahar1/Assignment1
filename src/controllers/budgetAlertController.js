const { BudgetAlert, Category } = require('../models');

module.exports = {
  async getAll(req, res) {
    const alerts = await BudgetAlert.findAll({ include: [Category] });
    res.json(alerts);
  },
  async getById(req, res) {
    const alert = await BudgetAlert.findByPk(req.params.id, { include: [Category] });
    if (!alert) return res.status(404).json({ error: { code: 'not_found', message: 'Budget alert not found' } });
    res.json(alert);
  },
  async create(req, res) {
    try {
      const alert = await BudgetAlert.create(req.body);
      res.status(201).json(alert);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
  async update(req, res) {
    try {
      const alert = await BudgetAlert.findByPk(req.params.id);
      if (!alert) return res.status(404).json({ error: { code: 'not_found', message: 'Budget alert not found' } });
      await alert.update(req.body);
      res.json(alert);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
  async remove(req, res) {
    const alert = await BudgetAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: { code: 'not_found', message: 'Budget alert not found' } });
    await alert.destroy();
    res.status(204).end();
  },
  async getViolations(req, res) {
    // Placeholder: implement logic for budget violations
    res.json({ violations: [] });
  },
};
