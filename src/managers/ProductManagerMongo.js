const ProductModel = require("../models/product.model");

class ProductManagerMongo {
  async getAll() {
    return ProductModel.find().lean();
  }

  async getById(id) {
    return ProductModel.findById(id).lean();
  }

  async create(productData) {
    return ProductModel.create(productData);
  }

  async update(id, updates) {
    return ProductModel.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async delete(id) {
    const r = await ProductModel.findByIdAndDelete(id);
    return !!r;
  }
}

module.exports = ProductManagerMongo;
