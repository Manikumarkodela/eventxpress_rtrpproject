const express = require("express");
const { addProduct, getProducts, getMyProducts, deleteProduct } = require("../controllers/vendorController");
const { authMiddleware, isVendor } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.get("/products", getProducts);
router.get("/my-products", authMiddleware, isVendor, getMyProducts);
router.post("/products", authMiddleware, isVendor, upload.array("images", 5), addProduct);
router.post("/product", authMiddleware, isVendor, upload.array("images", 5), addProduct);
router.delete("/products/:id", authMiddleware, isVendor, deleteProduct);

module.exports = router;
