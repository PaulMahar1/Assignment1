const { Category } = require('../models');

module.exports = {
  async getAll(req, res) {
    const categories = await Category.findAll();
    res.json(categories);
  },
  async getById(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: { code: 'not_found', message: 'Category not found' } });
    res.json(category);
  },
  async create(req, res) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: { code: 'not_found', message: 'Category not found' } });
      await category.update(req.body);
      res.json(category);
    } catch (err) {
      res.status(422).json({ error: { code: 'validation_error', message: err.message } });
    }
  },
  async remove(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: { code: 'not_found', message: 'Category not found' } });
    await category.destroy();
    res.status(204).end();
  },
};
