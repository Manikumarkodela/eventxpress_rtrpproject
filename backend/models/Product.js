const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: "" },
  category: { type: String, default: "Uncategorized", trim: true },
  location: { type: String, enum: ['Hyderabad', 'Warangal'], default: 'Hyderabad' },
  contact: { type: String, default: "", trim: true },
  images: { type: [String], default: [] },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
