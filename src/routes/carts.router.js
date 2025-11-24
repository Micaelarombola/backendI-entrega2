const { Router } = require('express');
const path = require('path');
const CartManager = require('../managers/CartManager');

const router = Router();
const manager = new CartManager(path.join(__dirname, '../../data/carts.json'));

// POST /api/carts
router.post('/', async (req, res) => {
  try {
    const created = await manager.createCart();
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart.products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const qty = Number(req.body?.quantity) || 1;
    const cart = await manager.addProductToCart(req.params.cid, req.params.pid, qty);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
