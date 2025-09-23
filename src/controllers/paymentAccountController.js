const { PaymentAccount } = require('../models');

module.exports = {
  async getAll(req, res) {
    const accounts = await PaymentAccount.findAll();
    res.json(accounts);
  },
  async getById(req, res) {
    const account = await PaymentAccount.findByPk(req.params.id);
    if (!account) return res.status(404).json({ error: { code: 'not_found', message: 'Payment account not found' } });
    res.json(account);
  },
  async create(req, res) {
    try {
      const account = await PaymentAccount.create(req.body);
      res.status(201).json(account);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
  async update(req, res) {
    try {
      const account = await PaymentAccount.findByPk(req.params.id);
      if (!account) return res.status(404).json({ error: { code: 'not_found', message: 'Payment account not found' } });
      await account.update(req.body);
      res.json(account);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
  async remove(req, res) {
    const account = await PaymentAccount.findByPk(req.params.id);
    if (!account) return res.status(404).json({ error: { code: 'not_found', message: 'Payment account not found' } });
    await account.destroy();
    res.status(204).end();
  },
};
