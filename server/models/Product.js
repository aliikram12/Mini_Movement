const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: 0 },
  category: { type: String, required: true, enum: ['Classic Bears', 'Premium Bears', 'Mini Bears', 'Gift Sets', 'Accessories'] },
  images: [{ type: String }],
  colors: [{ name: String, hex: String }],
  sizes: [{ name: String, price: Number }],
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: [String],
  details: [{ label: String, value: String }]
}, { timestamps: true });

productSchema.index({ featured: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
