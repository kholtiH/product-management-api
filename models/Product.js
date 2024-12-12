const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  image: String,
  category: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  internalReference: String,
  shellId: Number,
  inventoryStatus: {
    type: String,
    enum: ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'],
    required: true,
  },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
