const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { vendorId, products } = req.body;

    const newOrder = new Order({
      customerId: req.user.id,
      vendorId,
      products
    });

    const order = await newOrder.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).populate('vendorId', 'name email').populate('products.productId');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await order.deleteOne();
    res.json({ msg: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createOrder, getMyOrders, cancelOrder };
