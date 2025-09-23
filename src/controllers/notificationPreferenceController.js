const { NotificationPreference } = require('../models');

module.exports = {
  async getAll(req, res) {
    const prefs = await NotificationPreference.findAll();
    res.json(prefs);
  },
  async create(req, res) {
    try {
      const pref = await NotificationPreference.create(req.body);
      res.status(201).json(pref);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
  async update(req, res) {
    try {
      const pref = await NotificationPreference.findByPk(req.params.id);
      if (!pref) return res.status(404).json({ error: { code: 'not_found', message: 'Notification preference not found' } });
      await pref.update(req.body);
      res.json(pref);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
};
