const User = require('../models/User');

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Sync cart (overwrite or merge logic handled by frontend, but this replaces the DB cart)
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = items.map(item => ({
      product: item._id,
      quantity: item.quantity,
      color: item.color || '',
      size: item.size || ''
    }));

    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
