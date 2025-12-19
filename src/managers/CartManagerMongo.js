const mongoose = require("mongoose");
const CartModel = require("../models/cart.model");
const ProductModel = require("../models/product.model");

class CartManagerMongo {

  // =========================
  // CREAR CARRITO
  // =========================
  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart.toObject();
  }

  // =========================
  // TRAER TODOS LOS CARRITOS
  // =========================
  async getAllCarts() {
    const carts = await CartModel.find()
      .populate("products.product")
      .lean();

    return carts;
  }

  // =========================
  // TRAER CARRITO POR ID
  // =========================
  async getCartById(cid) {
    if (!mongoose.Types.ObjectId.isValid(cid)) return null;

    const cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    return cart;
  }

  // =========================
  // AGREGAR PRODUCTO AL CARRITO
  // =========================
  async addProductToCart(cid, pid, quantity = 1) {
    if (!mongoose.Types.ObjectId.isValid(cid)) return null;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      const err = new Error("Invalid product id");
      err.statusCode = 400;
      throw err;
    }

    const productExists = await ProductModel.findById(pid).lean();
    if (!productExists) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const qty = Number(quantity) || 1;

    const index = cart.products.findIndex(
      (p) => String(p.product) === String(pid)
    );

    if (index !== -1) {
      cart.products[index].quantity += qty;
    } else {
      cart.products.push({
        product: new mongoose.Types.ObjectId(pid),
        quantity: qty,
      });
    }

    await cart.save();

    return CartModel.findById(cid)
      .populate("products.product")
      .lean();
  }

  // =========================
  // ELIMINAR PRODUCTO DEL CARRITO
  // =========================
  async deleteProductFromCart(cid, pid) {
    if (!mongoose.Types.ObjectId.isValid(cid)) return null;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      const err = new Error("Invalid product id");
      err.statusCode = 400;
      throw err;
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const originalLength = cart.products.length;

    cart.products = cart.products.filter(
      (p) => String(p.product) !== String(pid)
    );

    if (cart.products.length === originalLength) {
      const err = new Error("Product not in cart");
      err.statusCode = 404;
      throw err;
    }

    await cart.save();

    return CartModel.findById(cid)
      .populate("products.product")
      .lean();
  }

  // =========================
  // REEMPLAZAR TODOS LOS PRODUCTOS
  // =========================
  async replaceCartProducts(cid, productsArray) {
    if (!mongoose.Types.ObjectId.isValid(cid)) return null;

    const normalizedProducts = [];

    for (const item of productsArray) {
      const { product, quantity } = item;

      if (!mongoose.Types.ObjectId.isValid(product)) {
        const err = new Error(`Invalid product id: ${product}`);
        err.statusCode = 400;
        throw err;
      }

      const exists = await ProductModel.findById(product).lean();
      if (!exists) {
        const err = new Error(`Product not found: ${product}`);
        err.statusCode = 404;
        throw err;
      }

      normalizedProducts.push({
        product: new mongoose.Types.ObjectId(product),
        quantity: Number(quantity) || 1,
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = normalizedProducts;
    await cart.save();

    return CartModel.findById(cid)
      .populate("products.product")
      .lean();
  }

  // =========================
  // ACTUALIZAR SOLO QUANTITY
  // =========================
  async updateProductQuantity(cid, pid, quantity) {
    if (!mongoose.Types.ObjectId.isValid(cid)) return null;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      const err = new Error("Invalid product id");
      err.statusCode = 400;
      throw err;
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      const err = new Error("quantity must be >= 1");
      err.statusCode = 400;
      throw err;
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const index = cart.products.findIndex(
      (p) => String(p.product) === String(pid)
    );

    if (index === -1) return null;

    cart.products[index].quantity = qty;
    await cart.save();

    return CartModel.findById(cid)
      .populate("products.product")
      .lean();
  }

  // =========================
  // VACIAR CARRITO
  // =========================
  async clearCart(cid) {
    if (!mongoose.Types.ObjectId.isValid(cid)) return null;

    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();

    return CartModel.findById(cid)
      .populate("products.product")
      .lean();
  }
}

module.exports = CartManagerMongo;
