const { Router } = require('express');
const path = require('path');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const manager = new ProductManager(path.join(__dirname, '../../data/products.json'));

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await manager.getAll();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const prod = await manager.getById(req.params.pid);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json(prod);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const created = await manager.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const updated = await manager.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const ok = await manager.delete(req.params.pid);
    if (!ok) return res.status(404).json({ error: 'Product not found' });
    res.json({ status: 'deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
