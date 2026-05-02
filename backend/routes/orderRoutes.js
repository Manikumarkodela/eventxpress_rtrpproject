const express = require("express");
const { createOrder, getMyOrders, cancelOrder } = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);
router.delete("/:id", authMiddleware, cancelOrder);

module.exports = router;