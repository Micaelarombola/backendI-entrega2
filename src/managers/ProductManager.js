const fs = require('fs').promises;
const path = require('path');

class ProductManager {
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
    const maxId = items.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
    return String(maxId + 1);
  }

  async getAll() {
    return this._readFile();
  }

  async getById(id) {
    const items = await this._readFile();
    return items.find(p => String(p.id) === String(id)) || null;
  }

  async create(productData) {
    // Validaciones mínimas según consigna
    const required = ['title','description','code','price','status','stock','category'];
    for (const k of required) {
      if (productData[k] === undefined) {
        const err = new Error(`Missing field: ${k}`);
        err.statusCode = 400;
        throw err;
      }
    }

    const items = await this._readFile();

    // code único
    if (items.some(p => p.code === productData.code)) {
      const err = new Error('Product code already exists');
      err.statusCode = 400;
      throw err;
    }

    const newItem = {
      id: this._generateId(items),
      title: String(productData.title),
      description: String(productData.description),
      code: String(productData.code),
      price: Number(productData.price),
      status: Boolean(productData.status),
      stock: Number(productData.stock),
      category: String(productData.category),
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails.map(String) : []
    };

    items.push(newItem);
    await this._writeFile(items);
    return newItem;
  }

  async update(id, updates) {
    const items = await this._readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;

    // no permitir cambiar id
    if ('id' in updates) delete updates.id;

    // si cambia code, que no choque
    if (updates.code && items.some(p => p.code === updates.code && String(p.id) !== String(id))) {
      const err = new Error('Product code already exists');
      err.statusCode = 400;
      throw err;
    }

    items[idx] = { ...items[idx], ...updates };
    await this._writeFile(items);
    return items[idx];
  }

  async delete(id) {
    const items = await this._readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return false;
    items.splice(idx, 1);
    await this._writeFile(items);
    return true;
  }
}

module.exports = ProductManager;
