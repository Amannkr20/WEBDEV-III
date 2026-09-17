const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function handleError(res, error) {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  if (error.code === 11000) {
    return res.status(400).json({ message: "SKU already exists" });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  res.status(500).json({ message: "Server error: " + error.message });
}

router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/low-stock", async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    });
    res.json(lowStockProducts);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/summary", async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalInventoryValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          averagePrice: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalProducts: 1,
          totalQuantity: 1,
          totalInventoryValue: { $round: ["$totalInventoryValue", 2] },
          averagePrice: { $round: ["$averagePrice", 2] },
        },
      },
      { $sort: { category: 1 } },
    ]);
    res.json(summary);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/", async (req, res) => {
  try {
    const { category, search, sortBy, order, page, limit } = req.query;

    const pageNumber = parseInt(page);
    if (page !== undefined && (isNaN(pageNumber) || pageNumber < 1)) {
      return res.status(400).json({ message: "page must be a positive integer" });
    }

    const pageSize = parseInt(limit);
    if (limit !== undefined && (isNaN(pageSize) || pageSize < 1)) {
      return res.status(400).json({ message: "limit must be a positive integer" });
    }
    if (limit !== undefined && pageSize > 100) {
      return res.status(400).json({ message: "limit cannot exceed 100" });
    }

    const currentPage = pageNumber || 1;
    const currentLimit = pageSize || 10;
    const skip = (currentPage - 1) * currentLimit;

    const filter = {};
    if (category) filter.category = { $regex: category, $options: "i" };
    if (search) filter.name = { $regex: search, $options: "i" };

    const sortObject = {};
    const allowedSortFields = ["price", "quantity"];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      sortObject[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortObject.createdAt = -1;
    }

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(currentLimit);

    res.json({
      total: totalProducts,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(totalProducts / currentLimit),
      products,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/:id/stock", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const { change } = req.body;

    if (change === undefined) {
      return res.status(400).json({ message: "change field is required" });
    }
    if (typeof change !== "number" || !Number.isFinite(change)) {
      return res.status(400).json({ message: "change must be a finite number" });
    }
    if (change === 0) {
      return res.status(400).json({ message: "change value cannot be zero" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newQuantity = product.quantity + change;
    if (newQuantity < 0) {
      return res.status(400).json({
        message: `Insufficient stock. Current stock: ${product.quantity}, requested change: ${change}`,
      });
    }

    product.quantity = newQuantity;
    await product.save();
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
