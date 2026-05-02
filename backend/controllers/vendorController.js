const Product = require("../models/Product");

const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, location, contact } = req.body;
    let images = [];
    
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      location,
      contact,
      images,
      vendorId: req.user.id
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, location } = req.query;
    let query = {};
    if (category) query.category = category;
    if (location) query.location = location;

    const products = await Product.find(query).populate('vendorId', 'name email');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.vendorId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await product.deleteOne();
    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addProduct, getProducts, getMyProducts, deleteProduct };
