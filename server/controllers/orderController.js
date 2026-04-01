const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No order items' });

    const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
    const shippingCost = subtotal > 75 ? 0 : 9.99;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + shippingCost + tax).toFixed(2));

    const order = await Order.create({
      user: req.user._id, 
      items, 
      shippingAddress,
      subtotal, 
      shippingCost, 
      tax, 
      totalAmount, 
      isPaid: true, 
      paidAt: Date.now()
    });

    // Verification Step: Ensure data exists in Atlas
    const savedOrder = await Order.findById(order._id).lean();
    if (!savedOrder) throw new Error('Order creation failed in Atlas');

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try { res.json(await Order.find({ user: req.user._id }).sort('-createdAt')); }
  catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getAllOrders = async (req, res) => {
  try { res.json(await Order.find().populate('user', 'name email').sort('-createdAt')); }
  catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status || order.status;
    res.json(await order.save());
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getOrderStats = async (req, res) => {
  try {
    const [totalOrders, revenue, pending, delivered] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' })
    ]);
    res.json({ totalOrders, totalRevenue: revenue[0]?.total || 0, pendingOrders: pending, deliveredOrders: delivered });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
