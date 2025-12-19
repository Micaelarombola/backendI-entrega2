const { Router } = require("express");
const ProductManagerMongo = require("../managers/ProductManagerMongo");
const ProductModel = require("../models/product.model");

const router = Router();
const manager = new ProductManagerMongo();

// GET /api/products
// Paginación + filtros + sort + formato pedido por la consigna
router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const sort = req.query.sort;      // asc | desc
    const query = req.query.query;    // category:Ropa | availability:true

    // Filtros
    const filter = {};
    if (query) {
      const [key, value] = query.split(":");
      if (key === "category") filter.category = value;
      if (key === "availability") filter.status = value === "true";
    }

    // Ordenamiento por precio
    const sortOption = sort
      ? { price: sort === "asc" ? 1 : -1 }
      : {};

    const result = await ProductModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

    const buildLink = (p) => {
      const params = new URLSearchParams();
      params.set("limit", limit);
      params.set("page", p);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const prod = await manager.getById(req.params.pid);
    if (!prod) return res.status(404).json({ error: "Product not found" });
    res.json(prod);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const created = await manager.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const updated = await manager.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const ok = await manager.delete(req.params.pid);
    if (!ok) return res.status(404).json({ error: "Product not found" });
    res.json({ status: "deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
