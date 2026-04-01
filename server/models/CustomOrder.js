const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teddyProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  babyName: { type: String, required: true, trim: true },
  customMessage: { type: String, default: '' },
  outfitImages: [{ type: String }], // Cloudinary URLs
  customerNote: { type: String, default: '' },
  selectedColor: { type: String, default: '' },
  selectedSize: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'outfit_received', 'in_progress', 'dressing', 'quality_check', 'ready', 'shipped', 'delivered'],
    default: 'pending'
  },
  price: { type: Number, required: true },
  shippingAddress: {
    fullName: String, email: String, phone: String,
    street: String, city: String, state: String, zip: String, country: String
  },
  isPaid: { type: Boolean, default: false },
  stripePaymentId: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  adminNotes: String
}, { timestamps: true });

module.exports = mongoose.model('CustomOrder', customOrderSchema);
