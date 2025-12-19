const { Router } = require("express");
const CartManagerMongo = require("../managers/CartManagerMongo");

const router = Router();
const manager = new CartManagerMongo();

// =====================================
// POST /api/carts → crear carrito
// =====================================
router.post("/", async (req, res) => {
  try {
    const cart = await manager.createCart();
    res.status(201).json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =====================================
// GET /api/carts → listar TODOS los carritos  ✅ (AGREGADO)
// =====================================
router.get("/", async (req, res) => {
  try {
    const carts = await manager.getAllCarts();
    res.json(carts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =====================================
// GET /api/carts/:cid → traer carrito con populate
// =====================================
router.get("/:cid", async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// =====================================
// POST /api/carts/:cid/products/:pid → agregar producto (o sumar quantity)
// =====================================
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const quantity = Number(req.body?.quantity) || 1;
    const cart = await manager.addProductToCart(
      req.params.cid,
      req.params.pid,
      quantity
    );
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

// =====================================
// DELETE /api/carts/:cid/products/:pid → eliminar producto del carrito
// =====================================
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await manager.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

// =====================================
// PUT /api/carts/:cid → reemplazar TODOS los productos del carrito
// =====================================
router.put("/:cid", async (req, res) => {
  try {
    const products = req.body.products;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "products must be an array" });
    }

    const cart = await manager.replaceCartProducts(req.params.cid, products);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

// =====================================
// PUT /api/carts/:cid/products/:pid → actualizar SOLO quantity
// =====================================
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({ error: "quantity is required" });
    }

    const cart = await manager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      quantity
    );
    if (!cart) {
      return res.status(404).json({ error: "Cart or product not found" });
    }

    res.json(cart);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

// =====================================
// DELETE /api/carts/:cid → vaciar carrito completo
// =====================================
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await manager.clearCart(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
