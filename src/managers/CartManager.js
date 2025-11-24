const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (e) {
      if (e.code === 'ENOENT') {
        await this._writeFile([]);
        return [];
      }
      throw e;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  _generateId(items) {
    const maxId = items.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
    return String(maxId + 1);
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = { id: this._generateId(carts), products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(cid)) || null;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const carts = await this._readFile();
    const idx = carts.findIndex(c => String(c.id) === String(cid));
    if (idx === -1) return null;

    const cart = carts[idx];
    const existing = cart.products.find(p => String(p.product) === String(pid));

    if (existing) existing.quantity += Number(quantity) || 1;
    else cart.products.push({ product: String(pid), quantity: Number(quantity) || 1 });

    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
