const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String, image: String, price: Number,
  quantity: { type: Number, required: true, min: 1 },
  color: String, size: String
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String, email: String, phone: String,
    street: String, city: String, state: String, zip: String, country: String
  },
  paymentMethod: { type: String, default: 'stripe' },
  stripePaymentId: { type: String },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isCustomOrder: { type: Boolean, default: false },
  customOrderRef: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomOrder' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
